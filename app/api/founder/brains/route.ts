// app/api/founder/brains/route.ts
// Returns all Second Brains grouped by status:
// 1. ACTIVE — prompt delivered
// 2. DA LAVORARE — submitted, waiting for Prompt Genesi™
// 3. NON INIZIATI — cards created, phases not completed
//
// Without search: returns ALL clients, all statuses
// With search (email/name): returns ALL brains of that specific client
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

    // ── Fetch all assessments ──
    const { data: assessments, error: assessmentsError } = await supabaseAdmin
      .from('assessments')
      .select('id, user_id, brain_name, submitted, responses, created_at')
      .order('created_at', { ascending: false })

    if (assessmentsError) {
      return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 })
    }

    if (!assessments || assessments.length === 0) {
      return NextResponse.json({ brains: [] })
    }

    // ── Fetch all second_brains ──
    const assessmentIds = assessments.map((a: any) => a.id)
    const { data: secondBrains } = await supabaseAdmin
      .from('second_brains')
      .select('id, assessment_id, prompt_key, prompt_version, prompt_status')
      .in('assessment_id', assessmentIds)

    const brainMap: Record<number, any> = {}
    if (secondBrains) {
      secondBrains.forEach((sb: any) => { brainMap[sb.assessment_id] = sb })
    }

    // ── Get user emails ──
    const userIds = Array.from(new Set(assessments.map((a: any) => a.user_id)))
    const emailMap: Record<string, string> = {}
    for (const uid of userIds) {
      try {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(uid as string)
        if (authUser?.user?.email) emailMap[uid as string] = authUser.user.email
      } catch { }
    }

    // ── Build result with status classification ──
    const result = assessments.map((a: any) => {
      const sb = brainMap[a.id]
      const r = a.responses || {}

      // Determine status
      let status: 'active' | 'da_lavorare' | 'non_iniziato'

      if (sb?.prompt_status === 'active') {
        status = 'active'
      } else if (a.submitted === true) {
        status = 'da_lavorare'
      } else {
        status = 'non_iniziato'
      }

      // Phase completion
      const p1 = !!(r.phase1 && Object.keys(r.phase1).length > 0)
      const p2 = !!(r.phase2 && Object.keys(r.phase2).length > 0)
      const p3 = !!(r.phase3 && r.phase3.length > 0)

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
        submitted: a.submitted || false,
        status,
        phases: { p1, p2, p3 },
      }
    })

    // ── Sort: ACTIVE first, then DA_LAVORARE, then NON_INIZIATO ──
    const order = { active: 0, da_lavorare: 1, non_iniziato: 2 }
    result.sort((a: any, b: any) => {
      const diff = order[a.status as keyof typeof order] - order[b.status as keyof typeof order]
      if (diff !== 0) return diff
      // Within same group: most recent first
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return NextResponse.json({ brains: result })

  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
