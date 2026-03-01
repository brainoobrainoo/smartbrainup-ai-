// lib/stripe/gating-server.ts
// ─────────────────────────────────────────────────────────
// Server-side gating — for use in Server Components,
// layouts, and API routes that already have the Supabase
// server client available.
// ─────────────────────────────────────────────────────────

import { createClient } from '@/lib/supabase/server'
import { extractAccessProfile, computeAccessState } from '@/lib/stripe/gating'
import type { AccessState } from '@/lib/stripe/gating'

/**
 * Fetches user profile and computes access state server-side.
 * Returns null if user is not authenticated.
 *
 * Usage in a Server Component or layout:
 *
 *   const access = await getServerAccessState()
 *   if (!access?.hasDashboardAccess) redirect('/licensing')
 */
export async function getServerAccessState(): Promise<AccessState | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('credits, licensing_status, subscription_status, subscription_plan, trial_end, current_period_end')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return computeAccessState({
      credits: 0,
      licensing_status: null,
      subscription_status: null,
      subscription_plan: null,
      trial_end: null,
      current_period_end: null,
    })
  }

  return computeAccessState(extractAccessProfile(profile))
}
