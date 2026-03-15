'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [magicLinkError, setMagicLinkError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const authError = searchParams.get('error')
  const [isPostCheckout, setIsPostCheckout] = useState(false)

  useEffect(() => {
    setIsPostCheckout(localStorage.getItem('post_checkout_pending') === 'true')
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      if (localStorage.getItem('post_checkout_pending') === 'true') {
        router.push('/start')
      } else {
        router.push('/client')
      }
    }
  }, [isAuthenticated, router])

  const getNextUrl = () => isPostCheckout ? '/auth/callback?next=/start' : '/auth/callback'

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + getNextUrl() },
    })
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsSubmitting(true)
    setMagicLinkError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin + getNextUrl() },
    })
    if (error) {
      setMagicLinkError(error.message)
    } else {
      setMagicLinkSent(true)
    }
    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div
        className="min-h-[100dvh] flex items-center justify-center"
        style={{ backgroundColor: '#252525', background: 'linear-gradient(to bottom, #252525 0%, #3a3a3a 50%, #4a4a4a 100%)' }}
      >
        <p className="text-white/50 text-[13px] font-ui">Loading...</p>
      </div>
    )
  }

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center px-10 md:px-12"
      style={{ backgroundColor: '#252525', background: 'linear-gradient(to bottom, #252525 0%, #3a3a3a 50%, #4a4a4a 100%)' }}
    >
      <div
        className="w-full max-w-[310px] md:max-w-[320px] rounded-[12px] p-7 md:p-8"
        style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
      >
        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-[1.15rem] font-semibold text-white tracking-[-0.02em] m-0">
            SmartBrainUp
          </h1>
          <p className="text-[0.8rem] text-white/50 mt-2">
            Sign in to your account
          </p>
        </div>

        {/* Auth error */}
        {authError && (
          <div className="px-4 py-3 rounded-[8px] bg-red-600/15 text-red-300 text-[0.8rem] mb-6">
            Authentication failed. Please try again.
          </div>
        )}

        {/* Google */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-[11px] px-4 rounded-[8px] border-0 bg-white text-[#111]
                     text-[0.85rem] font-medium cursor-pointer flex items-center
                     justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-5 gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[0.7rem] text-white/35">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Magic Link */}
        {magicLinkSent ? (
          <div className="p-4 rounded-[8px] bg-green-500/10 text-center">
            <p className="text-[#4ade80] text-[0.85rem] font-medium m-0">Check your email</p>
            <p className="text-white/50 text-[0.75rem] mt-2">
              We sent a magic link to <strong className="text-white">{email}</strong>
            </p>
            <button
              onClick={() => { setMagicLinkSent(false); setEmail('') }}
              className="mt-3 bg-transparent border-0 text-white/40 text-[0.75rem]
                         cursor-pointer underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleMagicLink}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full py-[11px] px-4 rounded-[8px] border-0
                         bg-white/[0.08] text-white text-[16px] outline-none
                         box-border placeholder:text-white/30"
            />
            {magicLinkError && (
              <p className="text-red-300 text-[0.75rem] mt-2">{magicLinkError}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-[11px] px-4 rounded-[8px] border-0
                         bg-white/[0.12] text-white text-[0.85rem] font-medium
                         cursor-pointer transition-colors hover:bg-white/[0.16]
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-[0.7rem] text-white/25 mt-7">
          AI-UP Second Brain™ by SmartBrainUp S.r.l.
        </p>
      </div>
    </div>
  )
}
