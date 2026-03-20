// app/api/founder/brains/route.ts
// Returns all Second Brains — founder only
// Includes submitted status from latest assessment per user
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

    // ── Get latest assessment submitted status per user ──
    // One query: latest assessment per distinct user_id
    const userIds = Array.from(new Set(brains.map(b => b.user_id)))

    const { data: assessments } = await supabaseAdmin
      .from('assessments')
      .select('user_id, submitted')
      .in('user_id', userIds)
      .order('id', { ascending: false })

    // Build map: user_id → submitted (from latest assessment)
    const submittedMap: Record<string, boolean> = {}
    if (assessments) {
      for (const a of assessments) {
        // First occurrence = latest (ordered DESC) — only set once
        if (!(a.user_id in submittedMap)) {
          submittedMap[a.user_id] = a.submitted === true
        }
      }
    }

    // ── Attach submitted to each brain ──
    const brainsWithStatus = brains.map(b => ({
      ...b,
      submitted: submittedMap[b.user_id] ?? false,
    }))

    return NextResponse.json({ brains: brainsWithStatus })

  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
