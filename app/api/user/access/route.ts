// app/api/user/access/route.ts
// ─────────────────────────────────────────────────────────
// Returns the authenticated user's access state.
// Called by the useUserAccess hook on the client.
// ─────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractAccessProfile, computeAccessState } from '@/lib/stripe/gating'

export async function GET() {
  try {
    const supabase = await createClient()

    // 1. Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // 2. Fetch access-relevant columns from user_profiles
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('credits, licensing_status, subscription_status, subscription_plan, trial_end, current_period_end')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      // User exists in auth but no profile row yet.
      // Return default (no access) state.
      return NextResponse.json({
        access: computeAccessState({
          credits: 0,
          licensing_status: null,
          subscription_status: null,
          subscription_plan: null,
          trial_end: null,
          current_period_end: null,
        })
      })
    }

    // 3. Compute and return access state
    const accessProfile = extractAccessProfile(profile)
    const access = computeAccessState(accessProfile)

    return NextResponse.json({ access })

  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
