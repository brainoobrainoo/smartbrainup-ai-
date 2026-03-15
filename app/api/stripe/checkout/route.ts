// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

const PRICE_IDS: Record<string, string> = {
  single:       'price_1T5swjAs5Tihp760sCMxRSlr', // €1,997
  team:         'price_1T5sygAs5Tihp760Kq5IaNbZ', // €4,997
  department:   'price_1T5vFAAs5Tihp760AqHTqPbM', // €7,997
  organization: 'price_1T5vG7As5Tihp760dSKIL3xg', // €14,997
}

export async function POST(request: NextRequest) {
  try {
    const { plan, planKey } = await request.json()
    const key = plan || planKey

    const priceId = PRICE_IDS[key]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const origin = request.headers.get('origin') || 'https://smartbrainup.ai'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/start?checkout=success`,
      cancel_url: `${origin}/start?checkout=cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[Checkout] Error:', err.message)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
