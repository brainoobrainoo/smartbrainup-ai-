// app/api/founder/brains/route.ts
// Returns all Second Brains — founder only
// Verifies session + role = 'developer' before responding

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

    // ── Verify role = developer ──
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'developer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ── Fetch all Second Brains (admin view) ──
    const supabaseAdmin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: brains, error: brainsError } = await supabaseAdmin
      .from('second_brains')
      .select('id, name, prompt_key, prompt_version, prompt_status, user_id, created_at')
      .order('created_at', { ascending: false })

    if (brainsError) {
      return NextResponse.json({ error: 'Failed to fetch brains' }, { status: 500 })
    }

    return NextResponse.json({ brains: brains || [] })

  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
