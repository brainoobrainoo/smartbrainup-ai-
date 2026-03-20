// app/api/founder/brains/route.ts
// Returns all clients with submitted = true (from assessments)
// LEFT JOIN with second_brains — shows all submitted, with or without brain record
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

    // ── Fetch all submitted assessments ──
    const { data: assessments, error: assessmentsError } = await supabaseAdmin
      .from('assessments')
      .select('id, user_id, brain_name, created_at')
      .eq('submitted', true)
      .order('created_at', { ascending: false })

    if (assessmentsError) {
      return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 })
    }

    if (!assessments || assessments.length === 0) {
      return NextResponse.json({ brains: [] })
    }

    // ── Fetch all second_brains for these assessments ──
    const assessmentIds = assessments.map(a => a.id)
    const { data: secondBrains } = await supabaseAdmin
      .from('second_brains')
      .select('id, assessment_id, prompt_key, prompt_version, prompt_status')
      .in('assessment_id', assessmentIds)

    const brainMap: Record<number, any> = {}
    if (secondBrains) {
      secondBrains.forEach((sb: any) => { brainMap[sb.assessment_id] = sb })
    }

    // ── Get user emails ──
    const userIds = Array.from(new Set(assessments.map(a => a.user_id)))
    const emailMap: Record<string, string> = {}
    for (const uid of userIds) {
      try {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(uid)
        if (authUser?.user?.email) emailMap[uid] = authUser.user.email
      } catch { }
    }

    // ── Build result ──
    const result = assessments.map((a: any) => {
      const sb = brainMap[a.id]
      return {
        id: sb?.id || `assessment_${a.id}`,
        assessment_id: a.id,
        name: a.brain_name || 'Second Brain',
        user_id: a.user_id,
        user_email: emailMap[a.user_id] || a.user_id,
        created_at: a.created_at,
        prompt_key: sb?.prompt_key || '',
        prompt_version: sb?.prompt_version || '',
        prompt_status: sb?.prompt_status || 'pending',
        submitted: true,
      }
    })

    return NextResponse.json({ brains: result })

  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
