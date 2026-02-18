'use client'

// app/(smartbrainup-ai)/start/page.tsx

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/layout/Container'
import { useAuth } from '@/lib/useAuth'
import { createClient } from '@/lib/supabase/client'
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

  // Accept session tokens from secondbrain-chat redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    if (accessToken && refreshToken) {
      const supabase = createClient()
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(() => {
          window.history.replaceState({}, '', window.location.pathname)
        })
    }
  }, [])
  const [currentQuestionId, setCurrentQuestionId] = useState(startQuestionId)
  const [history, setHistory] = useState<string[]>([])
  const [collectedData, setCollectedData] = useState<CollectedData>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  // Multi-select state
  const [multiSelected, setMultiSelected] = useState<string[]>([])

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

  // Save to localStorage when assessment completes
  useEffect(() => {
    if (!isComplete) return
    try {
      localStorage.setItem('phase1_results', JSON.stringify(collectedData))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [isComplete])

  // Handle continue button — go to /client if logged in, /login if not
  const handleContinue = () => {
    if (isAuthenticated && user) {
      router.push('/client')
    } else {
      router.push('/login')
    }
  }

  // ── Single-select handler ──
  const handleOptionClick = (option: AdaptiveOption) => {
    if (question.type === 'multi') return

    const updatedData = {
      ...collectedData,
      [question.collectAs]: option.value,
    }
    setCollectedData(updatedData)

    setIsTransitioning(true)
    
    setTimeout(() => {
      if (option.nextId === null) {
        setCollectedData(updatedData)
        setIsComplete(true)
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

    const updatedData = {
      ...collectedData,
      [question.collectAs]: multiSelected,
    }
    setCollectedData(updatedData)

    const nextId = question.options[0].nextId

    setIsTransitioning(true)

    setTimeout(() => {
      if (nextId === null) {
        setCollectedData(updatedData)
        setIsComplete(true)
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

  // ── COMPLETION CARD ──
  if (isComplete) {
    return (
      <div className="min-h-screen" style={{ background: '#1a1a1a' }}>
        <div className="relative w-full overflow-hidden text-white" style={{ background: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 100%)' }}>
          <section className="relative z-10 pt-20 md:pt-32 pb-16 md:pb-24">
            <Container>
              {renderHeader()}

              {/* Completion Card */}
              <div 
                className="rounded-[4px] p-8 py-10 md:p-12 md:py-14 mb-11"
                style={{ background: 'linear-gradient(to bottom, #353535 0%, #232323 100%)' }}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  
                  {/* Section label */}
                  <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-white/[0.45] mb-8">
                    {complete.section}
                  </p>

                  {/* Title */}
                  <h2 className="text-[24px] md:text-[32px] font-normal leading-[1.1] text-white mb-4">
                    {complete.title.map((line, index) => (
                      <span key={index} className="block">{line}</span>
                    ))}
                  </h2>

                  {/* Body */}
                  <p className="text-[16px] md:text-[17px] font-normal leading-[1.4] text-white/50 mb-10 max-w-[400px]">
                    {Array.isArray(complete.body) ? complete.body.map((line, i) => (
                      <span key={i} className="block">{line}</span>
                    )) : complete.body}
                  </p>

                  {/* Detail */}
                  {complete.detail && (
                    <p className="text-[15px] md:text-[16px] font-normal leading-[1.4] text-white/35 mb-10 max-w-[400px]">
                      {complete.detail}
                    </p>
                  )}
                  
                  {/* CTA Button */}
                  <button 
                    onClick={handleContinue}
                    className="px-10 py-3.5 bg-white/[0.08] hover:bg-white/[0.14]
                               rounded-[4px] text-white text-[16px] font-medium
                               tracking-wide transition-all cursor-pointer border-0"
                  >
                    {complete.cta}
                  </button>

                  {/* Footer */}
                  <p className="text-center text-[0.7rem] text-white/20 mt-8">
                    AI-UP Second Brain™ by SmartBrainUp S.r.l.
                  </p>
                  
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
