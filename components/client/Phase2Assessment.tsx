'use client'

// components/client/Phase2Assessment.tsx
// Light theme questionnaire — runs inside client area
// Exit at any time → no save. Complete → saves to Supabase.

import { useState, useEffect, useMemo } from 'react'
import Container from '@/components/layout/Container'
import {
  phase2QuestionsMap,
  phase2Strati,
  phase2StartQuestionId,
  phase2Content,
  Phase2Option,
  Phase2CollectedData,
} from '@/content/smartbrainup-ai/phase2'

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

interface Phase2Props {
  brainName: string
  onExit: () => void
  onComplete: (data: Phase2CollectedData) => void
}

export default function Phase2Assessment({ brainName, onExit, onComplete }: Phase2Props) {
  const [currentQuestionId, setCurrentQuestionId] = useState(phase2StartQuestionId)
  const [history, setHistory] = useState<string[]>([])
  const [collectedData, setCollectedData] = useState<Phase2CollectedData>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [multiSelected, setMultiSelected] = useState<string[]>([])

  const question = phase2QuestionsMap[currentQuestionId]
  const { header, complete } = phase2Content

  // Dynamic total
  const totalQuestions = useMemo(() => {
    let remaining = 0
    let id: string | null = currentQuestionId
    const visited = new Set<string>()
    while (id && !visited.has(id)) {
      visited.add(id)
      remaining++
      const q: any = phase2QuestionsMap[id]
      if (!q) break
      id = q.options[0].nextId
    }
    return history.length + remaining
  }, [currentQuestionId, history.length])

  // Restore multi-select state on back
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

  // Single-select handler
  const handleOptionClick = (option: Phase2Option) => {
    if (question.type === 'multi') return
    const updatedData = { ...collectedData, [question.collectAs]: option.value }
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
      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }

  // Multi-select toggle
  const handleMultiToggle = (value: string) => {
    const max = question.maxSelect || 2
    setMultiSelected(prev => {
      if (prev.includes(value)) return prev.filter(v => v !== value)
      if (prev.length >= max) return [...prev.slice(0, max - 1), value]
      return [...prev, value]
    })
  }

  // Multi-select confirm
  const handleMultiConfirm = () => {
    if (multiSelected.length === 0) return
    const updatedData = { ...collectedData, [question.collectAs]: multiSelected }
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
      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }

  // ── COMPLETION SCREEN — light theme ──
  if (isComplete) {
    return (
      <div className="min-h-screen bg-white">
        <section className="relative z-10 pt-20 md:pt-32 pb-16 md:pb-24">
          <Container>
            {/* Header */}
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-11 text-[#1a1a1a]">
              <span className="opacity-60">{header.badge.primary}</span>
              <span className="opacity-30"> {header.badge.secondary}</span>
            </p>

            {/* Completion Card */}
            <div
              className="rounded-[4px] p-8 py-10 md:p-12 md:py-14 mb-11"
              style={{ background: 'linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%)' }}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-8">
                  {complete.section}
                </p>
                <h2 className="text-[24px] md:text-[32px] font-normal leading-[1.1] text-[#1a1a1a] mb-4">
                  {complete.title.map((line, index) => (
                    <span key={index} className="block">{line}</span>
                  ))}
                </h2>
                <p className="text-[16px] md:text-[17px] font-normal leading-[1.4] text-[#1a1a1a]/50 mb-2 max-w-[400px]">
                  {complete.body}
                </p>
                <p className="text-[15px] md:text-[16px] font-normal leading-[1.4] text-[#1a1a1a]/35 mb-10 max-w-[400px]">
                  {complete.detail}
                </p>
                <button
                  onClick={() => onComplete(collectedData)}
                  className="px-10 py-3.5 bg-[#1a1a1a]/[0.08] hover:bg-[#1a1a1a]/[0.14]
                             rounded-[4px] text-[#1a1a1a] text-[16px] font-medium
                             tracking-wide transition-all cursor-pointer border-0"
                >
                  {complete.cta}
                </button>
                <p className="text-center text-[0.7rem] text-[#1a1a1a]/20 mt-8">
                  AI-UP Second Brain™ by SmartBrainUp S.r.l.
                </p>
              </div>
            </div>

            {/* Intro — below card */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-6 text-[#1a1a1a]/60">
                02 — PRIVATE PHASE
              </p>
              <p className="text-[17px] md:text-[18px] leading-[1.5] text-[#1a1a1a]/35 mb-1">This is where your Second Brain takes shape</p>
              <p className="text-[17px] md:text-[18px] leading-[1.5] text-[#1a1a1a]/35 mb-1">phase 2 is private and requires login</p>
              <p className="text-[17px] md:text-[18px] leading-[1.5] text-[#1a1a1a]/35 mb-1">the system adapts through your choices</p>
              <p className="text-[17px] md:text-[18px] leading-[1.5] text-[#1a1a1a]/35 mb-1">to reflect how you work and decide</p>
              <p className="text-[17px] md:text-[18px] leading-[1.5] text-[#1a1a1a]/35 mb-1">and what actually drives your actions</p>
            </div>

          </Container>
        </section>
      </div>
    )
  }

  // ── QUESTIONNAIRE — light theme ──
  return (
    <div className="min-h-screen bg-white">
      <section className="relative z-10 pt-20 md:pt-32 pb-16 md:pb-24">
        <Container>
          {/* Header with Exit */}
          <div className="flex items-center justify-between mb-11">
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]">
              <span className="opacity-60">{header.badge.primary}</span>
              <span className="opacity-30"> {header.badge.secondary}</span>
            </p>
            <button
              onClick={onExit}
              className="font-ui text-[13px] font-normal text-[#1a1a1a] opacity-40
                         hover:opacity-70 transition-opacity cursor-pointer
                         bg-transparent border-0"
            >
              {header.exit}
            </button>
          </div>

          {/* Question Card — light */}
          <div
            className="rounded-[4px] p-8 pt-8 pb-10 md:p-12 md:pt-10 md:pb-16 mb-11"
            style={{ background: 'linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%)' }}
          >
            {/* Strato */}
            <p className="text-center font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40" style={{ marginBottom: '4px' }}>
              {question.strato}
            </p>
            {/* Topic */}
            <p className="text-center font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40" style={{ marginBottom: '40px' }}>
              {question.topic}
            </p>

            {/* Content with transition */}
            <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <div className="flex flex-col items-center text-center">

                {/* Question */}
                <h2 className="text-[24px] md:text-[32px] font-normal leading-[1.1] text-[#1a1a1a]" style={{ marginBottom: '40px' }}>
                  {question.question}
                </h2>

                {/* Options */}
                <div className="space-y-3 w-full" key={currentQuestionId}>
                  {question.options.map((option, index) => (
                    question.type === 'multi' ? (
                      <button
                        key={index}
                        onClick={() => handleMultiToggle(option.value)}
                        className={`w-full px-8 py-5 rounded-[4px] text-[#1a1a1a] text-[17px] md:text-[18px] font-normal text-center transition-all touch-manipulation ${
                          multiSelected.includes(option.value)
                            ? 'bg-[#1a1a1a]/10 ring-1 ring-[#1a1a1a]/20'
                            : 'bg-[#1a1a1a]/[0.03] [@media(hover:hover)]:hover:bg-[#1a1a1a]/10 active:bg-[#1a1a1a]/10'
                        }`}
                      >
                        {renderLabel(option.label)}
                      </button>
                    ) : (
                      <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className="w-full px-8 py-5 bg-[#1a1a1a]/[0.03] [@media(hover:hover)]:hover:bg-[#1a1a1a]/10 active:bg-[#1a1a1a]/10 rounded-[4px] text-[#1a1a1a] text-[17px] md:text-[18px] font-normal text-center transition-all touch-manipulation"
                      >
                        {renderLabel(option.label)}
                      </button>
                    )
                  ))}
                </div>

                {/* Multi-select confirm */}
                {question.type === 'multi' && (
                  <button
                    onClick={handleMultiConfirm}
                    disabled={multiSelected.length === 0}
                    className={`mt-6 px-8 py-5 rounded-[4px] text-[#1a1a1a] text-[17px] md:text-[18px] font-medium text-center transition-all touch-manipulation ${
                      multiSelected.length > 0
                        ? 'bg-[#1a1a1a]/10 [@media(hover:hover)]:hover:bg-[#1a1a1a]/20 active:bg-[#1a1a1a]/20'
                        : 'bg-[#1a1a1a]/[0.03] opacity-30 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                )}

              </div>
            </div>

            {/* Navigation */}
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
                      setTimeout(() => setIsTransitioning(false), 50)
                    }, 300)
                  }
                }}
                className={`w-12 h-12 flex items-center justify-center transition-opacity ${
                  history.length > 0 ? 'opacity-60 hover:opacity-100 cursor-pointer' : 'opacity-15 cursor-not-allowed'
                }`}
                disabled={history.length === 0}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/35 min-w-[60px] text-center">
                {history.length + 1} / {totalQuestions}
              </p>

              <button className="w-12 h-12 flex items-center justify-center opacity-15 cursor-not-allowed" disabled>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

          </div>

          {/* Intro — below card */}
          <div>
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-6 text-[#1a1a1a]/60">
              02 — PRIVATE PHASE
            </p>
            <p className="text-[17px] md:text-[18px] leading-[1.5] text-[#1a1a1a]/35 mb-1">This is where your Second Brain takes shape</p>
            <p className="text-[17px] md:text-[18px] leading-[1.5] text-[#1a1a1a]/35 mb-1">phase 2 is private and requires login</p>
            <p className="text-[17px] md:text-[18px] leading-[1.5] text-[#1a1a1a]/35 mb-1">the system adapts through your choices</p>
            <p className="text-[17px] md:text-[18px] leading-[1.5] text-[#1a1a1a]/35 mb-1">to reflect how you work and decide</p>
            <p className="text-[17px] md:text-[18px] leading-[1.5] text-[#1a1a1a]/35 mb-1">and what actually drives your actions</p>
          </div>

        </Container>
      </section>
    </div>
  )
}
