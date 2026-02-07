'use client'

import { useState, useEffect } from 'react'
import { useAuth, signInWithGoogle, signInWithMagicLink } from '@/lib/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [magicLinkError, setMagicLinkError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const authError = searchParams.get('error')

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/client')
    }
  }, [isAuthenticated, router])

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsSubmitting(true)
    setMagicLinkError('')
    const { error } = await signInWithMagicLink(email)
    if (error) {
      setMagicLinkError(error.message)
    } else {
      setMagicLinkSent(true)
    }
    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #252525 0%, #252525 80px, #5a5a5a 100%)', color: '#fff' }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #252525 0%, #252525 80px, #5a5a5a 100%)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: 'none', backdropFilter: 'blur(20px)' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>SmartBrainUp</h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>Sign in to your account</p>
        </div>

        {authError && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(220,38,38,0.15)', border: 'none', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Authentication failed. Please try again.
          </div>
        )}

        <button onClick={signInWithGoogle} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: '#fff', color: '#111', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'opacity 0.15s' }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {magicLinkSent ? (
          <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', border: 'none', textAlign: 'center' }}>
            <p style={{ color: '#4ade80', fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>Check your email</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '0.5rem' }}>We sent a magic link to <strong style={{ color: '#fff' }}>{email}</strong></p>
            <button onClick={() => { setMagicLinkSent(false); setEmail('') }} style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleMagicLink}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            {magicLinkError && <p style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.5rem' }}>{magicLinkError}</p>}
            <button type="submit" disabled={isSubmitting} style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.9rem', fontWeight: 500, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1, transition: 'background 0.15s' }}>
              {isSubmitting ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', marginTop: '2rem' }}>
          AI-UP Second Brain™ by SmartBrainUp S.r.l.
        </p>
      </div>
    </div>
  )
}
