'use client'

// app/(smartbrainup-ai)/account/page.tsx

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import { supabase } from '@/lib/supabase'
import { 
  getPhase2Questions, 
  Phase2Question, 
  CollectedData 
} from '@/content/smartbrainup-ai/start'

export default function AccountPage() {
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === 'true'
  const assessmentId = searchParams.get('aid')

  // Flow states
  const [isLoading, setIsLoading] = useState(true)
  const [showBreather, setShowBreather] = useState(false)
  const [isPhase2Active, setIsPhase2Active] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Phase 2 data
  const [phase2Qs, setPhase2Qs] = useState<Phase2Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase2Answers, setPhase2Answers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [phase1Responses, setPhase1Responses] = useState<CollectedData | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load Phase 1 data → generate Phase 2 questions
  useEffect(() => {
    if (!isWelcome || !assessmentId) {
      setIsLoading(false)
      return
    }

    async function loadPhase1() {
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('responses, phase2_complete')
          .eq('id', assessmentId)
          .single()

        if (!error && data?.responses) {
          // Already completed Phase 2? Skip to default screen
          if (data.phase2_complete) {
            setIsLoading(false)
            return
          }

          const responses = data.responses as CollectedData
          setPhase1Responses(responses)
          const questions = getPhase2Questions(responses)

          if (questions.length > 0) {
            setPhase2Qs(questions)
            setShowBreather(true)
          }
        }
      } catch (err) {
        console.error('Error loading assessment:', err)
      }
      setIsLoading(false)
    }

    loadPhase1()
  }, [isWelcome, assessmentId])

  // Auto-focus textarea after transition
  useEffect(() => {
    if (!isTransitioning && isPhase2Active) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning, currentIndex, isPhase2Active])

  const currentQuestion = phase2Qs[currentIndex]

  // ── Start Phase 2 from breather ──
  const handleStartPhase2 = () => {
    setShowBreather(false)
    setIsPhase2Active(true)
  }

  // ── Continue: save answer and advance ──
  const handleContinue = () => {
    if (!currentAnswer.trim()) return

    const updated = {
      ...phase2Answers,
      [currentQuestion.collectAs]: currentAnswer.trim(),
    }
    setPhase2Answers(updated)

    setIsTransitioning(true)

    setTimeout(async () => {
      if (currentIndex + 1 >= phase2Qs.length) {
        // Last question — single save to Supabase
        try {
          await supabase
            .from('assessments')
            .update({
              responses: { ...(phase1Responses || {}), ...updated },
              phase2_complete: true
            })
            .eq('id', assessmentId)

          console.log('Phase 2 complete — saved to Supabase')
        } catch (err) {
          console.error('Error saving Phase 2:', err)
        }

        setIsPhase2Active(false)
      } else {
        const nextIndex = currentIndex + 1
        setCurrentIndex(nextIndex)
        setCurrentAnswer(phase2Answers[phase2Qs[nextIndex].collectAs] || '')
      }

      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }

  // ── Back navigation ──
  const handleBack = () => {
    if (currentIndex === 0) return

    if (currentAnswer.trim()) {
      setPhase2Answers(prev => ({
        ...prev,
        [currentQuestion.collectAs]: currentAnswer.trim(),
      }))
    }

    setIsTransitioning(true)
    setTimeout(() => {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      setCurrentAnswer(phase2Answers[phase2Qs[prevIndex].collectAs] || '')
      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }


  // ═══════════════════════════════════
  // LOADING
  // ═══════════════════════════════════

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="relative w-full overflow-hidden text-white" style={{ background: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 100%)' }}>
          <section className="relative z-10 pt-20 md:pt-32 pb-16 md:pb-24">
            <Container>
              <div className="min-h-[500px]" />
            </Container>
          </section>
        </div>
      </div>
    )
  }


  // ═══════════════════════════════════
  // BREATHER — BETWEEN PHASE 1 AND 2
  // ═══════════════════════════════════

  if (showBreather) {
    return (
      <div className="min-h-screen">
        <div className="relative w-full overflow-hidden text-white" style={{ background: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 100%)' }}>
          <section className="relative z-10 pt-20 md:pt-32 pb-16 md:pb-24">
            <Container>
              {/* Badge */}
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-11">
                <span className="opacity-100">AI-UP</span>
                <span className="opacity-50"> SECOND BRAIN™ YOUR ACCOUNT</span>
              </p>

              {/* Breather Card */}
              <div 
                className="rounded-[4px] p-8 py-10 md:p-12 md:py-16 mb-11"
                style={{ background: 'linear-gradient(to bottom, #353535 0%, #232323 100%)' }}
              >
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">

                  {/* Checkmark icon */}
                  <div className="w-20 h-20 mb-8 rounded-full bg-white/10 flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-[24px] md:text-[32px] font-normal leading-[1.1] text-white mb-4">
                    <span className="block">Your context has been captured.</span>
                  </h2>

                  {/* Body */}
                  <p className="text-[17px] md:text-[18px] font-normal leading-[1.4] text-white opacity-70 max-w-[480px] mb-10">
                    Now a few open questions to sharpen your Second Brain.
                    <br />
                    It takes about 3 minutes.
                  </p>

                  {/* CTA */}
                  <button
                    onClick={handleStartPhase2}
                    className="px-8 py-5 bg-white/10 [@media(hover:hover)]:hover:bg-white/20 active:bg-white/20 rounded-[4px] text-white text-[17px] md:text-[18px] font-medium transition-all touch-manipulation"
                  >
                    Continue
                  </button>

                </div>

                {/* Section label */}
                <p className="mt-10 md:mt-14 text-center font-ui text-[11px] font-medium tracking-widest uppercase text-white/40">
                  PHASE 2
                </p>
                
              </div>

              {/* Info text */}
              <div className="text-[17px] md:text-[18px] font-normal leading-[1.15] text-white max-w-[560px] space-y-5">
                <p className="opacity-70">
                  <span className="block font-medium">Almost there.</span>
                </p>
                <p className="opacity-70">
                  <span className="block">Your answers so far define your profile.</span>
                  <span className="block">The next step adds the detail that makes your Second Brain precise.</span>
                </p>
              </div>
            </Container>
          </section>
        </div>
      </div>
    )
  }


  // ═══════════════════════════════════
  // PHASE 2 — TEXT QUESTIONS
  // ═══════════════════════════════════

  if (isPhase2Active && currentQuestion) {
    return (
      <div className="min-h-screen">
        <div className="relative w-full overflow-hidden text-white" style={{ background: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 100%)' }}>
          <section className="relative z-10 pt-20 md:pt-32 pb-16 md:pb-24">
            <Container>
              {/* Badge */}
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-11">
                <span className="opacity-100">AI-UP</span>
                <span className="opacity-50"> SECOND BRAIN™ YOUR ACCOUNT</span>
              </p>

              {/* Question Card */}
              <div 
                className="rounded-[4px] p-8 pt-8 pb-10 md:p-12 md:pt-10 md:pb-16 mb-11"
                style={{ background: 'linear-gradient(to bottom, #353535 0%, #232323 100%)' }}
              >
                {/* Layer label - top */}
                <p className="text-center font-ui text-[11px] font-medium tracking-widest uppercase text-white/[0.45]" style={{ marginBottom: '40px' }}>
                  {currentQuestion.strato}
                </p>

                {/* Content with transition */}
                <div 
                  className={`transition-opacity duration-300 ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    
                    {/* Question */}
                    <h2 className="text-[24px] md:text-[32px] font-normal leading-[1.1] text-white" style={{ marginBottom: '40px' }}>
                      {currentQuestion.question}
                    </h2>
                    
                    {/* Text input */}
                    <textarea
                      ref={textareaRef}
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      rows={3}
                      className="w-full max-w-[560px] px-6 py-4 bg-white/[0.05] border border-white/10 rounded-[4px] text-white text-[17px] placeholder-white/40 focus:outline-none focus:border-white/30 transition-all resize-none"
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                          handleContinue()
                        }
                      }}
                    />

                    {/* Continue button */}
                    <button
                      onClick={handleContinue}
                      disabled={!currentAnswer.trim()}
                      className={`mt-6 px-8 py-5 rounded-[4px] text-white text-[17px] md:text-[18px] font-medium text-center transition-all touch-manipulation ${
                        currentAnswer.trim()
                          ? 'bg-white/10 [@media(hover:hover)]:hover:bg-white/20 active:bg-white/20'
                          : 'bg-white/[0.02] opacity-30 cursor-not-allowed'
                      }`}
                    >
                      Continue
                    </button>
                    
                  </div>
                </div>

                {/* Navigation: arrows + page number */}
                <div className="flex justify-center items-center gap-6 mt-10 md:mt-14">
                  <button
                    onClick={handleBack}
                    className={`w-12 h-12 flex items-center justify-center transition-opacity ${
                      currentIndex > 0 ? 'opacity-80 hover:opacity-100 cursor-pointer' : 'opacity-20 cursor-not-allowed'
                    }`}
                    disabled={currentIndex === 0}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>

                  <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-white/40 min-w-[60px] text-center">
                    {currentIndex + 1} / {phase2Qs.length}
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

                <p className="mt-6 text-center font-ui text-[11px] font-medium tracking-widest uppercase text-white/40">
                  PHASE 2
                </p>
                
              </div>

              {/* Info text */}
              <div className="text-[17px] md:text-[18px] font-normal leading-[1.15] text-white max-w-[560px] space-y-5">
                <p className="opacity-70">
                  <span className="block font-medium">Shaping your context.</span>
                </p>
                <p className="opacity-70">
                  <span className="block">These questions refine your Second Brain</span>
                  <span className="block">around your specific situation and goals.</span>
                </p>
              </div>
            </Container>
          </section>
        </div>
      </div>
    )
  }


  // ═══════════════════════════════════
  // DEFAULT — "BEING BUILT" SCREEN
  // ═══════════════════════════════════

  return (
    <div className="min-h-screen">
      <div className="relative w-full overflow-hidden text-white" style={{ background: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 100%)' }}>
        <section className="relative z-10 pt-20 md:pt-32 pb-16 md:pb-24">
          <Container>
            {/* Badge */}
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-11">
              <span className="opacity-100">AI-UP</span>
              <span className="opacity-50"> SECOND BRAIN™ YOUR ACCOUNT</span>
            </p>

            {/* Main Card */}
            <div 
              className="rounded-[4px] p-8 py-10 md:p-12 md:py-16 mb-11"
              style={{ background: 'linear-gradient(to bottom, #353535 0%, #232323 100%)' }}
            >
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                
                {isWelcome && (
                  <div className="mb-8 px-6 py-3 bg-white/10 rounded-[4px]">
                    <p className="text-[15px] text-white/80">Welcome! Your account has been created.</p>
                  </div>
                )}

                <div className="w-20 h-20 mb-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>

                <h1 className="text-[28px] md:text-[40px] font-normal leading-[1.1] text-white mb-4">
                  <span className="block">Your Second Brain</span>
                  <span className="block">is being built</span>
                </h1>
                
                <p className="text-[17px] md:text-[18px] font-normal leading-[1.4] text-white opacity-70 max-w-[480px] mb-10">
                  We've received your assessment data. Our team will configure your personal Second Brain and contact you soon.
                </p>

                <div className="w-full max-w-[400px] p-6 bg-white/[0.03] rounded-[4px] border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[15px] text-white/50">Status</span>
                    <span className="text-[15px] text-white font-medium">In Progress</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-1/4 h-full bg-white/40 rounded-full animate-pulse"></div>
                  </div>
                </div>

              </div>

              <p className="mt-10 md:mt-14 text-center font-ui text-[11px] font-medium tracking-widest uppercase text-white/40">
                ACCOUNT
              </p>
              
            </div>

            <div className="text-[17px] md:text-[18px] font-normal leading-[1.15] text-white max-w-[560px] space-y-5">
              <p className="opacity-70">
                <span className="block font-medium">What happens next?</span>
              </p>
              <p className="opacity-70">
                <span className="block">Your assessment responses are being analyzed.</span>
                <span className="block">We'll configure your Second Brain based on your context.</span>
                <span className="block">You'll receive access instructions via email.</span>
              </p>
            </div>

            <div className="mt-12">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span className="font-ui text-[12px] font-medium tracking-wide uppercase">Back to home</span>
              </Link>
            </div>

          </Container>
        </section>
      </div>
    </div>
  )
}
