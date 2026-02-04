'use client'

// app/(smartbrainup-ai)/start/page.tsx

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/layout/Container'
import { supabase } from '@/lib/supabase'
import { 
  questionsMap,
  strati,
  startQuestionId,
  assessmentContent, 
  AdaptiveOption,
  CollectedData 
} from '@/content/smartbrainup-ai/start'

// ── Render label with mobile-only line breaks ──
// Labels containing \n will break on mobile, flow on desktop
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
  const [currentQuestionId, setCurrentQuestionId] = useState(startQuestionId)
  const [history, setHistory] = useState<string[]>([])
  const [collectedData, setCollectedData] = useState<CollectedData>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  // Multi-select state
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  
  // Form state
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

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

  // ── Single-select handler (unchanged logic) ──
  const handleOptionClick = (option: AdaptiveOption) => {
    // Only for single-select questions
    if (question.type === 'multi') return

    // Save data
    setCollectedData(prev => ({
      ...prev,
      [question.collectAs]: option.value,
    }))

    // Fade out
    setIsTransitioning(true)
    
    // Wait for fade out, then change content
    setTimeout(() => {
      if (option.nextId === null) {
        // End of assessment
        setIsComplete(true)
        console.log('Assessment complete:', { ...collectedData, [question.collectAs]: option.value })
      } else {
        // Add current to history and move to next
        setHistory(prev => [...prev, currentQuestionId])
        setCurrentQuestionId(option.nextId)
      }
      
      // Small delay then fade in
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
        // Deselect
        return prev.filter(v => v !== value)
      }
      if (prev.length >= max) {
        // At max — replace last
        return [...prev.slice(0, max - 1), value]
      }
      // Add
      return [...prev, value]
    })
  }

  // ── Multi-select confirm ──
  const handleMultiConfirm = () => {
    if (multiSelected.length === 0) return

    // Save as array
    setCollectedData(prev => ({
      ...prev,
      [question.collectAs]: multiSelected,
    }))

    // Get nextId from first option (all point to same destination)
    const nextId = question.options[0].nextId

    // Fade out
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

  const handleSubmit = async () => {
    // Validation
    if (!userName.trim()) {
      setError('Please enter your name')
      return
    }
    if (!userEmail.trim() || !userEmail.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const { data, error: supabaseError } = await supabase
        .from('assessments')
        .insert([
          {
            user_name: userName.trim(),
            user_email: userEmail.trim().toLowerCase(),
            responses: collectedData
          }
        ])
        .select()

      if (supabaseError) {
        console.error('Supabase error:', supabaseError)
        setError('Something went wrong. Please try again.')
        setIsSubmitting(false)
        return
      }

      console.log('Saved to Supabase:', data)
      
      // Redirect to client area
      router.push(`/account?welcome=true&aid=${data[0].id}`)
      
    } catch (err) {
      console.error('Error:', err)
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen" style={{ background: '#1a1a1a' }}>
        {/* Hero - DARK zone */}
        <div className="relative w-full overflow-hidden text-white" style={{ background: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 100%)' }}>
          <section className="relative z-10 pt-20 md:pt-32 pb-16 md:pb-24">
            <Container>
              {/* Badge */}
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-11">
                <span className="opacity-100">{hero.badge.primary}</span>
                <span className="opacity-50"> {hero.badge.secondary}</span>
              </p>

              {/* Complete Card */}
              <div 
                className="rounded-[4px] p-8 py-10 md:p-12 md:py-14 mb-11"
                style={{ background: 'linear-gradient(to bottom, #353535 0%, #232323 100%)' }}
              >
                {/* Single column - centered */}
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
                  
                  {/* Form fields */}
                  <div className="w-full max-w-[360px] md:max-w-[560px] space-y-3 mb-8">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-5 py-3.5 bg-white/[0.04] border-0 rounded-[4px] text-white text-[16px] placeholder-white/30 focus:outline-none focus:bg-white/[0.07] transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-5 py-3.5 bg-white/[0.04] border-0 rounded-[4px] text-white text-[16px] placeholder-white/30 focus:outline-none focus:bg-white/[0.07] transition-all"
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <p className="text-red-400 text-[14px] mb-4">{error}</p>
                  )}
                  
                  {/* CTA Button */}
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-8 py-3.5 bg-white/[0.08] hover:bg-white/[0.14] rounded-[4px] text-white text-[16px] font-medium tracking-wide transition-all ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Creating...' : complete.cta}
                  </button>
                  
                </div>
              </div>

              {/* Intro text — two columns desktop, one mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Column 1 */}
                <div className="text-[17px] md:text-[18px] font-normal leading-[1.15] text-white space-y-5">
                  {hero.intro.col1.map((block, blockIndex) => (
                    <p key={blockIndex}>
                      {block.map((line, lineIndex) => (
                        <span 
                          key={lineIndex} 
                          className={`block ${
                            line.startsWith('Phase 1') 
                              ? '' 
                              : 'opacity-50'
                          }`}
                        >
                          {line.startsWith('Phase 1') ? (
                            <><span className="font-semibold text-white">Phase 1</span><span className="opacity-50">{line.slice(7)}</span></>
                          ) : line}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
                {/* Column 2 */}
                <div className="text-[17px] md:text-[18px] font-normal leading-[1.15] text-white space-y-5">
                  {hero.intro.col2.map((block, blockIndex) => (
                    <p key={blockIndex}>
                      {block.map((line, lineIndex) => (
                        <span key={lineIndex} className={`block ${line.startsWith('Phase 2') ? '' : 'opacity-50'}`}>
                          {line.startsWith('Phase 2') ? (
                            <><span className="font-semibold text-white">Phase 2</span><span className="opacity-50">{line.slice(7)}</span></>
                          ) : line}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              </div>
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
            {/* Badge */}
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-11">
              <span className="opacity-100">{hero.badge.primary}</span>
              <span className="opacity-50"> {hero.badge.secondary}</span>
            </p>

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

              {/* Navigation: arrows + page number - below answers */}
              <div className="flex justify-center items-center gap-6 mt-10 md:mt-14">
                {/* Left arrow */}
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

                {/* Page number */}
                <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-white/40 min-w-[60px] text-center">
                  {history.length + 1} / {totalQuestions}
                </p>

                {/* Right arrow - disabled */}
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

            {/* Intro text — two columns desktop, one mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Column 1 */}
              <div className="text-[17px] md:text-[18px] font-normal leading-[1.15] text-white space-y-5">
                {hero.intro.col1.map((block, blockIndex) => (
                  <p key={blockIndex}>
                    {block.map((line, lineIndex) => (
                      <span 
                        key={lineIndex} 
                        className={`block ${
                          line.startsWith('Phase 1') 
                            ? '' 
                            : 'opacity-50'
                        }`}
                      >
                        {line.startsWith('Phase 1') ? (
                          <><span className="font-semibold text-white">Phase 1</span><span className="opacity-50">{line.slice(7)}</span></>
                        ) : line}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
              {/* Column 2 */}
              <div className="text-[17px] md:text-[18px] font-normal leading-[1.15] text-white space-y-5">
                {hero.intro.col2.map((block, blockIndex) => (
                  <p key={blockIndex}>
                    {block.map((line, lineIndex) => (
                      <span key={lineIndex} className={`block ${line.startsWith('Phase 2') ? '' : 'opacity-50'}`}>
                        {line.startsWith('Phase 2') ? (
                          <><span className="font-semibold text-white">Phase 2</span><span className="opacity-50">{line.slice(7)}</span></>
                        ) : line}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </div>
    </div>
  )
}
