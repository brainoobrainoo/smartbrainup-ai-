// hooks/useUserAccess.ts
// ─────────────────────────────────────────────────────────
// Client-side hook that fetches and caches the user's
// access state. Re-fetches on window focus.
// ─────────────────────────────────────────────────────────

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AccessState } from '@/lib/stripe/gating'

interface UseUserAccessReturn {
  /** Computed access state */
  access: AccessState | null
  /** True while the initial fetch is in progress */
  loading: boolean
  /** Error message if fetch failed */
  error: string | null
  /** Manually re-fetch the access state */
  refresh: () => Promise<void>
}

/** Default (no access) state used as fallback */
const NO_ACCESS: AccessState = {
  hasDashboardAccess: false,
  hasGenericAIAccess: false,
  hasFullSecondBrainAccess: false,
  isSecondBrainLimited: false,
  plan: 'none',
  subscriptionStatus: 'none',
  credits: 0,
  hasLicensing: false,
  isSubscriptionValid: false,
}

export function useUserAccess(): UseUserAccessReturn {
  const [access, setAccess] = useState<AccessState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccess = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch('/api/user/access')

      if (!res.ok) {
        if (res.status === 401) {
          // Not authenticated — set no-access state
          setAccess(NO_ACCESS)
          return
        }
        throw new Error(`Failed to fetch access: ${res.status}`)
      }

      const data = await res.json()
      setAccess(data.access)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setAccess(NO_ACCESS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccess()

    // Re-fetch when user returns to the tab
    // (catches Stripe payment completions in other tabs)
    const handleFocus = () => fetchAccess()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchAccess])

  return { access, loading, error, refresh: fetchAccess }
}
