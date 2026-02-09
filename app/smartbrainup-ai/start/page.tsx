'use client'

// app/(smartbrainup-ai)/start/page.tsx

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/layout/Container'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { 
  questionsMap,
  strati,
  startQuestionId,
  assessmentContent, 
  AdaptiveOption,
  CollectedData 
} from '@/content/smartbrainup-ai/start'

// ── Render label with mobile-only line breaks ──
const renderLabel = (label: string) => {
  if (!label.includes('\n')) return label
  return label.split('\n').map((part, i) => (
    <span key={i}>
      {i > 0 && <br className="md:hidden" />}
      {i > 0 && <span className="hidden md:inline"> </span>}
      {part}
    </span>
  ))
}

export default function StartPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [currentQuestionId, setCurrentQuestionId] = useState(startQuestionId)
  const [history, setHistory] = useState<string[]>([])
  const [collectedData, setCollectedData] = useState<CollectedData>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  // Multi-select state
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  
  // Auth state for completion card
  const [authEmail, setAuthEmail] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [magicLinkError, setMagicLinkError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const question = questionsMap[currentQuestionId]
  const { hero, complete } = assessmentContent

  // Get current strato index for progress
  const currentStratoIndex = strati.indexOf(question?.strato || '')
  
  // Dynamic total: history + remaining path from current question
  const totalQuestions = useMemo(() => {
    let remaining = 0
    let id: string | null = currentQuestionId
    const visited = new Set<string>()
    while (id && !visited.has(id)) {
      visited.add(id)
      remaining++
      const q: any = questionsMap[id]
      if (!q) break
      id = q.options[0].nextId
    }
    return history.length + remaining
  }, [currentQuestionId, history.length])

  // Restore multi-select state when navigating back to a multi question
  useEffect(() => {
    if (question?.type === 'multi') {
      const existing = collectedData[question.collectAs]
      if (existing && Array.isArray(existing)) {
        setMultiSelected(existing)
      } else {
        setMultiSelected([])
      }
    } else {
      setMultiSelected([])
    }
  }, [currentQuestionId])

  // If user is already logged in when completing Phase 1, save and redirect
  useEffect(() => {
    if (isComplete && isAuthenticated && user) {
      saveResultsAndRedirect(user.id, user.user_metadata?.full_name || '', user.email || '')
    }
  }, [isComplete, isAuthenticated, user])

  // Save results to localStorage before auth
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('phase1_results', JSON.stringify(collectedData))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }

  // Save results directly to Supabase (for already-authenticated users)
  const saveResultsAndRedirect = async (userId: string, userName: string, userEmail: string) => {
    try {
      await supabase.from('assessments').insert([{
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        responses: collectedData,
        phase2_complete: false,
      }])
      // Clear any localStorage remnant
      localStorage.removeItem('phase1_results')
      router.push('/client')
    } catch (err) {
      console.error('Failed to save assessment:', err)
    }
  }

  // Google OAuth — save first, then auth
  const handleGoogleLogin = async () => {
    saveToLocalStorage()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error('Google login error:', error)
  }

  // Magic Link — save first, then send
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authEmail.trim()) return
    setIsSubmitting(true)
    setMagicLinkError('')
    saveToLocalStorage()
    const { error } = await supabase.auth.signInWithOtp({
      email: authEmail.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setMagicLinkError(error.message)
    } else {
      setMagicLinkSent(true)
    }
    setIsSubmitting(false)
  }

  // ── Single-select handler ──
  const handleOptionClick = (option: AdaptiveOption) => {
    if (question.type === 'multi') return

    setCollectedData(prev => ({
      ...prev,
      [question.collectAs]: option.value,
    }))

    setIsTransitioning(true)
    
    setTimeout(() => {
      if (option.nextId === null) {
        setIsComplete(true)
        console.log('Assessment complete:', { ...collectedData, [question.collectAs]: option.value })
      } else {
        setHistory(prev => [...prev, currentQuestionId])
        setCurrentQuestionId(option.nextId)
      }
      
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 300)
  }

  // ── Multi-select toggle ──
  const handleMultiToggle = (value: string) => {
    const max = question.maxSelect || 2
    setMultiSelected(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value)
      }
      if (prev.length >= max) {
        return [...prev.slice(0, max - 1), value]
      }
      return [...prev, value]
    })
  }

  // ── Multi-select confirm ──
  const handleMultiConfirm = () => {
    if (multiSelected.length === 0) return

    setCollectedData(prev => ({
      ...prev,
      [question.collectAs]: multiSelected,
    }))

    const nextId = question.options[0].nextId

    setIsTransitioning(true)

    setTimeout(() => {
      if (nextId === null) {
        setIsComplete(true)
        console.log('Assessment complete:', { ...collectedData, [question.collectAs]: multiSelected })
      } else {
        setHistory(prev => [...prev, currentQuestionId])
        setCurrentQuestionId(nextId)
      }

      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 300)
  }

  // ── Header block (badge only) — shared ──
  const renderHeader = () => (
    <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-11">
      <span className="opacity-100">{hero.badge.primary}</span>
      <span className="opacity-50"> {hero.badge.secondary}</span>
    </p>
  )

  // ── Intro lines — shared ──
  const renderIntro = () => (
    <div>
      <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-6 opacity-70">
        {hero.phaseLabel}
      </p>
      {hero.intro.map((line, index) => (
        <p key={index} className="text-[17px] md:text-[18px] leading-[1.5] opacity-40 mb-1">
          {line}
        </p>
      ))}
    </div>
  )

  // ── COMPLETION SCREEN ──
  if (isComplete) {
    // If already authenticated, the useEffect above handles save+redirect
    // Show a loading state while that happens
    if (isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1a1a' }}>
          <p className="text-white/50 text-[13px] font-ui">Saving your results…</p>
        </div>
      )
    }

    return (
      <div className="min-h-screen" style={{ background: '#1a1a1a' }}>
        <div className="relative w-full overflow-hidden text-white" style={{ background: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 100%)' }}>
          <section className="relative z-10 pt-20 md:pt-32 pb-16 md:pb-24">
            <Container>
              {renderHeader()}

              {/* Complete Card with Login */}
              <div 
                className="rounded-[4px] p-8 py-10 md:p-12 md:py-14 mb-11"
                style={{ background: 'linear-gradient(to bottom, #353535 0%, #232323 100%)' }}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  
                  {/* Complete message */}
                  <h2 className="text-[24px] md:text-[32px] font-normal leading-[1.1] text-white mb-3">
                    {complete.title.map((line, index) => (
                      <span key={index} className="block">{line}</span>
                    ))}
                  </h2>
                  <p className="text-[16px] md:text-[17px] font-normal leading-[1.3] text-white/50 mb-10">
                    {complete.body}
                  </p>
                  
                  {/* Auth UI */}
                  <div className="w-full max-w-[320px]">
                    
                    {/* Google */}
                    <button
                      onClick={handleGoogleLogin}
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
                          We sent a magic link to <strong className="text-white">{authEmail}</strong>
                        </p>
                        <button
                          onClick={() => { setMagicLinkSent(false); setAuthEmail('') }}
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
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
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
              </div>

              {renderIntro()}

            </Container>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#1a1a1a' }}>
      {/* Hero - DARK zone */}
      <div className="relative w-full overflow-hidden text-white" style={{ background: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 100%)' }}>
        <section className="relative z-10 pt-20 md:pt-32 pb-16 md:pb-24">
          <Container>
            {renderHeader()}

            {/* Question Card */}
            <div 
              className="rounded-[4px] p-8 pt-8 pb-10 md:p-12 md:pt-10 md:pb-16 mb-11"
              style={{ background: 'linear-gradient(to bottom, #353535 0%, #232323 100%)' }}
            >
              {/* Strato label - top */}
              <p className="text-center font-ui text-[11px] font-medium tracking-widest uppercase text-white/[0.45]" style={{ marginBottom: '4px' }}>
                {question.strato}
              </p>
              {/* Topic label */}
              <p className="text-center font-ui text-[11px] font-medium tracking-widest uppercase text-white/[0.45]" style={{ marginBottom: '40px' }}>
                {question.topic}
              </p>

              {/* Content with transition */}
              <div 
                className={`transition-opacity duration-300 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {/* Center content */}
                <div className="flex flex-col items-center text-center">
                  
                  {/* Question */}
                  <h2 className="text-[24px] md:text-[32px] font-normal leading-[1.1] text-white" style={{ marginBottom: '40px' }}>
                    {question.question}
                  </h2>
                  
                  {/* Options - full width, key resets hover on question change */}
                  <div className="space-y-3 w-full" key={currentQuestionId}>
                    {question.options.map((option, index) => (

                      question.type === 'multi' ? (
                        // ── Multi-select: toggleable ──
                        <button
                          key={index}
                          onClick={() => handleMultiToggle(option.value)}
                          className={`w-full px-8 py-5 rounded-[4px] text-white text-[17px] md:text-[18px] font-normal text-center transition-all touch-manipulation ${
                            multiSelected.includes(option.value)
                              ? 'bg-white/10 ring-1 ring-white/20'
                              : 'bg-white/[0.02] [@media(hover:hover)]:hover:bg-white/10 active:bg-white/10'
                          }`}
                        >
                          {renderLabel(option.label)}
                        </button>
                      ) : (
                        // ── Single-select: instant advance ──
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="w-full px-8 py-5 bg-white/[0.02] [@media(hover:hover)]:hover:bg-white/10 active:bg-white/10 rounded-[4px] text-white text-[17px] md:text-[18px] font-normal text-center transition-all touch-manipulation"
                        >
                          {renderLabel(option.label)}
                        </button>
                      )

                    ))}
                  </div>

                  {/* Multi-select confirm button */}
                  {question.type === 'multi' && (
                    <button
                      onClick={handleMultiConfirm}
                      disabled={multiSelected.length === 0}
                      className={`mt-6 px-8 py-5 rounded-[4px] text-white text-[17px] md:text-[18px] font-medium text-center transition-all touch-manipulation ${
                        multiSelected.length > 0
                          ? 'bg-white/10 [@media(hover:hover)]:hover:bg-white/20 active:bg-white/20'
                          : 'bg-white/[0.02] opacity-30 cursor-not-allowed'
                      }`}
                    >
                      Continue
                    </button>
                  )}
                  
                </div>
              </div>

              {/* Navigation: arrows + page number */}
              <div className="flex justify-center items-center gap-6 mt-10 md:mt-14">
                <button
                  onClick={() => {
                    if (history.length > 0) {
                      setIsTransitioning(true)
                      setTimeout(() => {
                        const prevQuestionId = history[history.length - 1]
                        setCollectedData(prev => {
                          const newData = { ...prev }
                          delete newData[question.collectAs]
                          return newData
                        })
                        setHistory(prev => prev.slice(0, -1))
                        setCurrentQuestionId(prevQuestionId)
                        setTimeout(() => {
                          setIsTransitioning(false)
                        }, 50)
                      }, 300)
                    }
                  }}
                  className={`w-12 h-12 flex items-center justify-center transition-opacity ${
                    history.length > 0 ? 'opacity-80 hover:opacity-100 cursor-pointer' : 'opacity-20 cursor-not-allowed'
                  }`}
                  disabled={history.length === 0}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-white/40 min-w-[60px] text-center">
                  {history.length + 1} / {totalQuestions}
                </p>

                <button
                  className="w-12 h-12 flex items-center justify-center opacity-20 cursor-not-allowed"
                  disabled={true}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
              
            </div>

            {renderIntro()}

          </Container>
        </section>
      </div>
    </div>
  )
}
