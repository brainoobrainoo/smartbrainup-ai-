// Stripe Webhook — SmartBrainUp.ai
// POST /api/stripe/webhook

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { STRIPE_CONFIG, LicensingProductId, SubscriptionPriceId } from '@/lib/stripe/config'
import Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ============================================
// MAIN WEBHOOK HANDLER
// ============================================

export async function POST(request: NextRequest) {
  let event: Stripe.Event

  // 1. Verify Stripe signature
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('[Webhook] Signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // 2. Idempotency check
  const { data: existingEvent } = await supabaseAdmin
    .from('stripe_events')
    .select('event_id')
    .eq('event_id', event.id)
    .single()

  if (existingEvent) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  await supabaseAdmin.from('stripe_events').insert({
    event_id: event.id,
    event_type: event.type,
  })

  // 3. Route event to handler
  try {
    const obj = event.data.object as any

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(obj)
        break
      case 'invoice.paid':
        await handleInvoicePaid(obj)
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(obj)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(obj)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(obj)
        break
      default:
        console.log(`[Webhook] Unhandled event: ${event.type}`)
    }
  } catch (err: any) {
    console.error(`[Webhook] Error handling ${event.type}:`, err.message)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

// ============================================
// HELPER: Extract subscription fields safely
// ============================================

function getSubFields(sub: any) {
  return {
    id: sub.id as string,
    status: sub.status as string,
    trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    current_period_end: sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null,
    priceId: sub.items?.data?.[0]?.price?.id as string | undefined,
  }
}

// ============================================
// EVENT HANDLERS
// ============================================

async function handleCheckoutCompleted(session: any) {
  const customerEmail = session.customer_details?.email as string | undefined
  let customerId = session.customer as string | null

  if (!customerEmail) {
    console.error('[Webhook] No customer email in session')
    return
  }

  // If no customer was created by Stripe (common with Payment Links in payment mode),
  // create one so we can attach subscriptions later
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: customerEmail,
      name: session.customer_details?.name || undefined,
    })
    customerId = customer.id
    console.log(`[Webhook] Created Stripe customer for ${customerEmail}: ${customerId}`)
  }

  if (session.mode === 'payment') {
    await handleLicensingPurchase(session, customerEmail, customerId)
  } else if (session.mode === 'subscription') {
    await handleSubscriptionPurchase(session, customerEmail, customerId)
  }
}

// --- LICENSING PURCHASE (one-time) → credits + Basic trial ---

async function handleLicensingPurchase(
  session: any,
  email: string,
  customerId: string
) {
  const fullSession: any = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items.data.price.product'],
  })

  const lineItem = fullSession.line_items?.data?.[0]
  const productId = (typeof lineItem?.price?.product === 'string'
    ? lineItem.price.product
    : lineItem?.price?.product?.id) as LicensingProductId

  const licensingInfo = STRIPE_CONFIG.licensing[productId]
  if (!licensingInfo) {
    console.error(`[Webhook] Unknown licensing product: ${productId}`)
    return
  }

  console.log(`[Webhook] Licensing: ${email} → ${licensingInfo.name} (${licensingInfo.credits} credits)`)

  // Fetch current credits to add (not overwrite)
  const { data: existingProfile } = await supabaseAdmin
    .from('user_profiles')
    .select('id, credits')
    .eq('email', email)
    .single()

  if (!existingProfile) {
    // No account yet → save to pending_credits
    console.log(`[Webhook] No user profile found for ${email} → saving to pending_credits`)

    const creditsToplan: Record<number, { plan: string; brains: number }> = {
      1:  { plan: 'single',       brains: 1  },
      3:  { plan: 'team',         brains: 3  },
      5:  { plan: 'department',   brains: 5  },
      10: { plan: 'organization', brains: 10 },
    }
    const planInfo = creditsToplan[licensingInfo.credits] ?? { plan: 'single', brains: 1 }

    const { error: pendingError } = await supabaseAdmin
      .from('pending_credits')
      .insert({
        email,
        plan: planInfo.plan,
        brains_count: planInfo.brains,
        stripe_session: session.id,
        stripe_amount: session.amount_total ?? null,
        status: 'pending',
      })

    if (pendingError) {
      console.error('[Webhook] Failed to save pending_credits:', pendingError.message)
      throw pendingError
    }

    console.log(`[Webhook] Pending credits saved for ${email}: ${planInfo.brains} brains`)
    return
  }

  // Account exists — add credits to existing balance
  const newCredits = (existingProfile.credits || 0) + licensingInfo.credits
  console.log(`[Webhook] Adding ${licensingInfo.credits} credits to ${email}: ${existingProfile.credits} → ${newCredits}`)

  const { error: updateError } = await supabaseAdmin
    .from('user_profiles')
    .update({
      stripe_customer_id: customerId,
      credits: newCredits,
      licensing_status: 'active',
      purchased_at: new Date().toISOString(),
    })
    .eq('email', email)

  if (updateError) {
    console.error('[Webhook] Update error:', updateError.message)
    throw updateError
  }

  await createBasicTrial(customerId, email)
}

// --- CREATE BASIC TRIAL (auto after licensing) ---

async function createBasicTrial(customerId: string, email: string) {
  try {
    const rawSub: any = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: STRIPE_CONFIG.basicTrialPriceId }],
      trial_period_days: STRIPE_CONFIG.basicTrialDays,
    })

    const sub = getSubFields(rawSub)
    console.log(`[Webhook] Basic trial created for ${email}: ${sub.id}`)

    await supabaseAdmin
      .from('user_profiles')
      .update({
        subscription_id: sub.id,
        subscription_plan: 'basic',
        subscription_interval: 'month',
        subscription_status: 'trialing',
        trial_end: sub.trial_end,
        current_period_end: sub.current_period_end,
      })
      .eq('email', email)

  } catch (err: any) {
    console.error('[Webhook] Failed to create Basic trial:', err.message)
    throw err
  }
}

// --- SUBSCRIPTION PURCHASE (PRO/ELITE via Payment Link) ---

async function handleSubscriptionPurchase(
  session: any,
  email: string,
  customerId: string
) {
  const subscriptionId = session.subscription as string
  const rawSub: any = await stripe.subscriptions.retrieve(subscriptionId)
  const sub = getSubFields(rawSub)

  const subInfo = sub.priceId
    ? STRIPE_CONFIG.subscriptions[sub.priceId as SubscriptionPriceId]
    : undefined

  if (!subInfo) {
    console.error(`[Webhook] Unknown subscription price: ${sub.priceId}`)
    return
  }

  console.log(`[Webhook] Subscription: ${email} → ${subInfo.plan} (${subInfo.interval})`)

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('purchased_at, subscription_id')
    .eq('email', email)
    .single()

  let discountApplied = false
  let discountEnd: string | null = null

  if (profile?.purchased_at && (subInfo.plan === 'pro' || subInfo.plan === 'elite')) {
    const purchasedAt = new Date(profile.purchased_at)
    const hoursSincePurchase = (Date.now() - purchasedAt.getTime()) / (1000 * 60 * 60)

    if (hoursSincePurchase <= STRIPE_CONFIG.upgradeWindowHours) {
      try {
        const coupons = await stripe.coupons.list({ limit: 10 })
        const existingCoupon = (coupons.data as any[]).find(
          (c) => c.percent_off === 50 && c.duration === 'repeating' && c.duration_in_months === 2
        )

        if (existingCoupon) {
          await (stripe.subscriptions.update as any)(subscriptionId, {
            coupon: existingCoupon.id,
          })
          discountApplied = true
          discountEnd = new Date(Date.now() + 2 * 30 * 24 * 60 * 60 * 1000).toISOString()
          console.log(`[Webhook] Coupon applied to ${email}: ${existingCoupon.id}`)
        }
      } catch (err: any) {
        console.error('[Webhook] Failed to apply coupon:', err.message)
      }
    }
  }

  // Cancel existing Basic trial if present
  if (profile?.subscription_id && profile.subscription_id !== subscriptionId) {
    try {
      await stripe.subscriptions.cancel(profile.subscription_id)
      console.log(`[Webhook] Canceled Basic trial: ${profile.subscription_id}`)
    } catch (err: any) {
      console.error('[Webhook] Failed to cancel Basic trial:', err.message)
    }
  }

  await supabaseAdmin
    .from('user_profiles')
    .update({
      stripe_customer_id: customerId,
      subscription_id: subscriptionId,
      subscription_plan: subInfo.plan,
      subscription_interval: subInfo.interval,
      subscription_status: sub.status,
      trial_end: sub.trial_end,
      current_period_end: sub.current_period_end,
      discount_applied: discountApplied,
      discount_end: discountEnd,
    })
    .eq('email', email)
}

// --- INVOICE PAID ---

async function handleInvoicePaid(invoice: any) {
  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) return

  const rawSub: any = await stripe.subscriptions.retrieve(subscriptionId)
  const sub = getSubFields(rawSub)

  await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'active',
      current_period_end: sub.current_period_end,
    })
    .eq('subscription_id', subscriptionId)

  console.log(`[Webhook] Invoice paid → active: ${subscriptionId}`)
}

// --- INVOICE PAYMENT FAILED ---

async function handleInvoicePaymentFailed(invoice: any) {
  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) return

  await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'past_due',
    })
    .eq('subscription_id', subscriptionId)

  console.log(`[Webhook] Payment failed → past_due: ${subscriptionId}`)
}

// --- SUBSCRIPTION UPDATED ---

async function handleSubscriptionUpdated(subscription: any) {
  const sub = getSubFields(subscription)
  const subInfo = sub.priceId
    ? STRIPE_CONFIG.subscriptions[sub.priceId as SubscriptionPriceId]
    : undefined

  const updateData: Record<string, any> = {
    subscription_status: sub.status,
    trial_end: sub.trial_end,
    current_period_end: sub.current_period_end,
  }

  if (subInfo) {
    updateData.subscription_plan = subInfo.plan
    updateData.subscription_interval = subInfo.interval
  }

  await supabaseAdmin
    .from('user_profiles')
    .update(updateData)
    .eq('subscription_id', sub.id)

  console.log(`[Webhook] Subscription updated: ${sub.id} → ${sub.status}`)
}

// --- SUBSCRIPTION DELETED ---

async function handleSubscriptionDeleted(subscription: any) {
  const sub = getSubFields(subscription)

  await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'canceled',
    })
    .eq('subscription_id', sub.id)

  console.log(`[Webhook] Subscription canceled: ${sub.id}`)
}
