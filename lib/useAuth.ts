'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  displayName: string
  userEmail: string
}

/**
 * Derive a display name from the user object.
 * Priority: user_metadata.full_name → user_metadata.name → email parsing
 */
function deriveDisplayName(user: User | null): string {
  if (!user) return ''

  // Google OAuth provides full_name or name in metadata
  const meta = user.user_metadata
  if (meta?.full_name && typeof meta.full_name === 'string' && meta.full_name.trim()) {
    return meta.full_name.trim()
  }
  if (meta?.name && typeof meta.name === 'string' && meta.name.trim()) {
    return meta.name.trim()
  }

  // Magic Link — derive from email
  const email = user.email
  if (!email) return ''

  const local = email.split('@')[0]
  return local
    .split(/[._\-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    displayName: deriveDisplayName(user),
    userEmail: user?.email ?? '',
  }
}

/**
 * Update display name in Supabase user metadata
 */
export async function updateDisplayName(name: string): Promise<{ error: Error | null }> {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({
    data: { full_name: name },
  })
  return { error: error ? new Error(error.message) : null }
}

export async function signInWithGoogle() {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/auth/callback',
    },
  })
  if (error) console.error('Google sign-in error:', error)
}

export async function signInWithMagicLink(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + '/auth/callback',
    },
  })
  return { error }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) console.error('Sign-out error:', error)
  window.location.href = '/'
}
