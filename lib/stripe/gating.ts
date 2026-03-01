// lib/stripe/gating.ts
// ─────────────────────────────────────────────────────────
// Access gating logic for SmartBrainUp.ai
// Based on Stripe Runbook — Step 5: Gating
// ─────────────────────────────────────────────────────────

/**
 * Subset of user_profiles columns relevant to access control.
 * All fields are nullable because a new user may not have
 * any Stripe data yet.
 */
export interface UserAccessProfile {
  credits: number
  licensing_status: string | null
  subscription_status: string | null
  subscription_plan: string | null
  trial_end: string | null
  current_period_end: string | null
}

/**
 * Computed access state consumed by UI components.
 */
export interface AccessState {
  /** Can access the dashboard at all */
  hasDashboardAccess: boolean
  /** Can use Generic AI features (chat, etc.) */
  hasGenericAIAccess: boolean
  /** Can use Second Brain in full mode */
  hasFullSecondBrainAccess: boolean
  /** Second Brain visible but limited (read-only / restricted) */
  isSecondBrainLimited: boolean
  /** Current subscription plan label */
  plan: 'none' | 'basic' | 'pro' | 'elite'
  /** Current subscription status */
  subscriptionStatus: 'none' | 'trialing' | 'active' | 'past_due' | 'canceled'
  /** Number of Second Brain credits available */
  credits: number
  /** Whether the licensing purchase has been completed */
  hasLicensing: boolean
  /** Whether the subscription trial/period is still valid */
  isSubscriptionValid: boolean
}

// ─────────────────────────────────────────────────────────
// Core gating functions
// ─────────────────────────────────────────────────────────

/**
 * Dashboard access rule:
 * credits >= 1 OR licensing_status = 'active'
 */
export function canAccessDashboard(profile: UserAccessProfile): boolean {
  return profile.credits >= 1 || profile.licensing_status === 'active'
}

/**
 * Generic AI access rule:
 * subscription_status IN ('trialing', 'active')
 */
export function canAccessGenericAI(profile: UserAccessProfile): boolean {
  const status = profile.subscription_status
  return status === 'trialing' || status === 'active'
}

/**
 * Full Second Brain access rule:
 * Dashboard access + Generic AI access
 */
export function canAccessFullSecondBrain(profile: UserAccessProfile): boolean {
  return canAccessDashboard(profile) && canAccessGenericAI(profile)
}

/**
 * Second Brain limited mode:
 * Has dashboard access but subscription is canceled or past_due.
 * User can see their Second Brain but cannot use it actively.
 */
export function isSecondBrainLimited(profile: UserAccessProfile): boolean {
  if (!canAccessDashboard(profile)) return false
  const status = profile.subscription_status
  return status === 'canceled' || status === 'past_due' || !status
}

// ─────────────────────────────────────────────────────────
// Compute full access state from profile
// ─────────────────────────────────────────────────────────

export function computeAccessState(profile: UserAccessProfile): AccessState {
  const hasDashboard = canAccessDashboard(profile)
  const hasAI = canAccessGenericAI(profile)
  const hasFullSB = canAccessFullSecondBrain(profile)
  const sbLimited = isSecondBrainLimited(profile)

  const plan = (['basic', 'pro', 'elite'].includes(profile.subscription_plan || '')
    ? profile.subscription_plan as 'basic' | 'pro' | 'elite'
    : 'none') satisfies AccessState['plan']

  const subStatus = (['trialing', 'active', 'past_due', 'canceled'].includes(profile.subscription_status || '')
    ? profile.subscription_status as 'trialing' | 'active' | 'past_due' | 'canceled'
    : 'none') satisfies AccessState['subscriptionStatus']

  return {
    hasDashboardAccess: hasDashboard,
    hasGenericAIAccess: hasAI,
    hasFullSecondBrainAccess: hasFullSB,
    isSecondBrainLimited: sbLimited,
    plan,
    subscriptionStatus: subStatus,
    credits: profile.credits,
    hasLicensing: profile.licensing_status === 'active',
    isSubscriptionValid: hasAI,
  }
}

// ─────────────────────────────────────────────────────────
// Helper: extract access profile from full user_profiles row
// ─────────────────────────────────────────────────────────

/**
 * Picks only the columns needed for gating from a full
 * user_profiles row. Useful in server components / API routes.
 */
export function extractAccessProfile(row: Record<string, unknown>): UserAccessProfile {
  return {
    credits: (row.credits as number) ?? 0,
    licensing_status: (row.licensing_status as string) ?? null,
    subscription_status: (row.subscription_status as string) ?? null,
    subscription_plan: (row.subscription_plan as string) ?? null,
    trial_end: (row.trial_end as string) ?? null,
    current_period_end: (row.current_period_end as string) ?? null,
  }
}
