'use client'

import { usePathname } from 'next/navigation'

// TODO: Replace with Supabase auth when integrating
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type AuthUser = {
  name: string
  email: string
  initials: string
}

type AuthState = {
  isAuthenticated: boolean
  user: AuthUser | null
  signOut: () => void
}

export function useAuth(): AuthState {
  const pathname = usePathname()

  // TODO: Replace mock with Supabase session check
  // const supabase = createClientComponentClient()
  // const { data: { session } } = await supabase.auth.getSession()

  // Mock: authenticated when on /client routes
  const isClient = pathname?.startsWith('/client')

  if (isClient) {
    return {
      isAuthenticated: true,
      user: {
        name: 'Marco Rossi',
        email: 'marco@example.com',
        initials: 'MR',
      },
      signOut: () => {
        // TODO: Supabase sign out
        // await supabase.auth.signOut()
        window.location.href = '/'
      },
    }
  }

  return {
    isAuthenticated: false,
    user: null,
    signOut: () => {},
  }
}
