// app/api/stripe/checkout/route.ts
// POST — restituisce il Payment Link Stripe per il piano scelto

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ── Payment Links (TEST mode) ─────────────────────────────
const PAYMENT_LINKS: Record<string, string> = {
  single:       'https://buy.stripe.com/test_fZuaEWgvJ3kWfDHey2enS01',
  team:         'https://buy.stripe.com/test_3cI3cudjx9JkgHLcpUenS02',
  department:   'https://buy.stripe.com/test_7sY8wOcft5t41MR61wenS03',
  organization: 'https://buy.stripe.com/test_dRm6oG0wL6x8crv89EenS04',
}

export async function POST(request: NextRequest) {
  try {
    const { plan, planKey } = await request.json()
    const key = plan || planKey

    const url = PAYMENT_LINKS[key]
    if (!url) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    return NextResponse.json({ url })
  } catch (err: any) {
    console.error('[Checkout] Error:', err.message)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
