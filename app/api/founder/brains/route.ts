// app/api/founder/brains/route.ts
// Returns Second Brains with prompt_status = 'pending' (work queue)
// and prompt_status = 'active' (delivered) — founder only
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

    // ── Admin client ──
    const supabaseAdmin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ── Fetch all Second Brains ──
    const { data: brains, error: brainsError } = await supabaseAdmin
      .from('second_brains')
      .select('id, name, prompt_key, prompt_version, prompt_status, user_id, created_at')
      .order('created_at', { ascending: false })

    if (brainsError) {
      return NextResponse.json({ error: 'Failed to fetch brains' }, { status: 500 })
    }

    if (!brains || brains.length === 0) {
      return NextResponse.json({ brains: [] })
    }

    // ── Get user emails ──
    const userIds = Array.from(new Set(brains.map(b => b.user_id)))
    const emailMap: Record<string, string> = {}
    for (const uid of userIds) {
      try {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(uid)
        if (authUser?.user?.email) emailMap[uid] = authUser.user.email
      } catch { }
    }

    // ── Attach email and submitted flag ──
    const result = brains.map(b => ({
      ...b,
      user_email: emailMap[b.user_id] || b.user_id,
      submitted: b.prompt_status === 'pending',
    }))

    return NextResponse.json({ brains: result })

  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
