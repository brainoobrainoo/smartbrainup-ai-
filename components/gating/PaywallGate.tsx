// components/gating/PaywallGate.tsx
// ─────────────────────────────────────────────────────────
// Wrapper component that conditionally renders children
// based on the user's access level.
// Shows appropriate upgrade / purchase prompts when blocked.
// ─────────────────────────────────────────────────────────

'use client'

import React from 'react'
import { useUserAccess } from '@/hooks/useUserAccess'

// ─────────────────────────────────────────────────────────
// Gate types
// ─────────────────────────────────────────────────────────

type GateLevel =
  | 'dashboard'       // Requires licensing / credits
  | 'generic-ai'      // Requires active subscription
  | 'second-brain'    // Requires both licensing + subscription

// ─────────────────────────────────────────────────────────
// Main gate component
// ─────────────────────────────────────────────────────────

interface PaywallGateProps {
  /** What level of access is required */
  require: GateLevel
  /** Content shown when access is granted */
  children: React.ReactNode
  /** Optional custom fallback (overrides default) */
  fallback?: React.ReactNode
}

export function PaywallGate({ require, children, fallback }: PaywallGateProps) {
  const { access, loading } = useUserAccess()

  // Loading state — show skeleton
  if (loading || !access) {
    return <GateLoadingSkeleton />
  }

  // Check access based on gate level
  let hasAccess = false
  let defaultFallback: React.ReactNode = null

  switch (require) {
    case 'dashboard':
      hasAccess = access.hasDashboardAccess
      defaultFallback = <NeedLicensingBanner />
      break
    case 'generic-ai':
      hasAccess = access.hasGenericAIAccess
      defaultFallback = <NeedSubscriptionBanner plan={access.plan} />
      break
    case 'second-brain':
      hasAccess = access.hasFullSecondBrainAccess
      defaultFallback = access.isSecondBrainLimited
        ? <LimitedModeBanner />
        : <NeedFullAccessBanner hasLicensing={access.hasLicensing} />
      break
  }

  if (hasAccess) {
    return <>{children}</>
  }

  return <>{fallback ?? defaultFallback}</>
}

// ─────────────────────────────────────────────────────────
// Default fallback banners
// ─────────────────────────────────────────────────────────

function GateLoadingSkeleton() {
  return (
    <div className="animate-pulse rounded-lg bg-gray-100 p-8">
      <div className="h-4 w-48 rounded bg-gray-200 mb-3" />
      <div className="h-3 w-72 rounded bg-gray-200" />
    </div>
  )
}

/**
 * Shown when user has no licensing / credits.
 * They need to purchase the AI-UP Second Brain™ method.
 */
function NeedLicensingBanner() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
      <div className="text-2xl mb-2">🔒</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Licensing Required
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Purchase the AI-UP Second Brain™ method to access your dashboard
        and start creating Second Brains.
      </p>
      <a
        href="/licensing"
        className="inline-block rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
      >
        View Licensing Options
      </a>
    </div>
  )
}

/**
 * Shown when user has licensing but no active subscription.
 * They need to subscribe (or their trial has ended / been canceled).
 */
function NeedSubscriptionBanner({ plan }: { plan: string }) {
  const isExpired = plan !== 'none'
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-center">
      <div className="text-2xl mb-2">⚡</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {isExpired ? 'Subscription Expired' : 'Subscription Required'}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {isExpired
          ? 'Your subscription has ended. Reactivate to continue using Generic AI features.'
          : 'An active subscription is required to access AI features.'}
      </p>
      <a
        href="/licensing"
        className="inline-block rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
      >
        {isExpired ? 'Reactivate Subscription' : 'Subscribe Now'}
      </a>
    </div>
  )
}

/**
 * Shown when user has dashboard access but Second Brain is in limited mode.
 * They can see their Second Brain but can't interact with it fully.
 */
function LimitedModeBanner() {
  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">
            Limited Mode
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            Your Second Brain is visible but interactions are paused.
            Reactivate your subscription to resume full access.
          </p>
          <a
            href="/licensing"
            className="inline-block mt-3 text-sm font-medium text-gray-900 underline hover:no-underline"
          >
            Reactivate →
          </a>
        </div>
      </div>
    </div>
  )
}

/**
 * Shown when user needs both licensing and subscription
 * but doesn't have one or both.
 */
function NeedFullAccessBanner({ hasLicensing }: { hasLicensing: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
      <div className="text-2xl mb-2">🧠</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Full Access Required
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {hasLicensing
          ? 'You have the method. Now activate a subscription to use your Second Brain.'
          : 'Purchase the AI-UP Second Brain™ method and activate a subscription to get started.'}
      </p>
      <a
        href="/licensing"
        className="inline-block rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
      >
        {hasLicensing ? 'Choose a Plan' : 'Get Started'}
      </a>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Inline status badge (for headers, cards, etc.)
// ─────────────────────────────────────────────────────────

interface AccessBadgeProps {
  className?: string
}

export function AccessBadge({ className = '' }: AccessBadgeProps) {
  const { access, loading } = useUserAccess()

  if (loading || !access) return null

  const config = getStatusConfig(access.subscriptionStatus, access.hasLicensing)

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.classes} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  )
}

function getStatusConfig(status: string, hasLicensing: boolean) {
  if (!hasLicensing) {
    return {
      label: 'No License',
      classes: 'bg-gray-100 text-gray-600',
      dotClass: 'bg-gray-400',
    }
  }

  switch (status) {
    case 'active':
      return {
        label: 'Active',
        classes: 'bg-green-50 text-green-700',
        dotClass: 'bg-green-500',
      }
    case 'trialing':
      return {
        label: 'Trial',
        classes: 'bg-blue-50 text-blue-700',
        dotClass: 'bg-blue-500',
      }
    case 'past_due':
      return {
        label: 'Past Due',
        classes: 'bg-red-50 text-red-700',
        dotClass: 'bg-red-500',
      }
    case 'canceled':
      return {
        label: 'Canceled',
        classes: 'bg-orange-50 text-orange-700',
        dotClass: 'bg-orange-500',
      }
    default:
      return {
        label: 'No Subscription',
        classes: 'bg-gray-100 text-gray-600',
        dotClass: 'bg-gray-400',
      }
  }
}
