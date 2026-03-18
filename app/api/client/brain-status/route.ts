// app/api/client/brain-status/route.ts
// Returns prompt_status for the logged-in user's second_brains
// Uses admin client to bypass RLS

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // ── Verify session ──
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Fetch second_brains for this user (admin client bypasses RLS) ──
    const supabaseAdmin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: brains, error: brainsError } = await supabaseAdmin
      .from('second_brains')
      .select('assessment_id, prompt_status')
      .eq('user_id', user.id)

    if (brainsError) {
      return NextResponse.json({ error: 'Failed to fetch brain status' }, { status: 500 })
    }

    return NextResponse.json({ brains: brains || [] })

  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
