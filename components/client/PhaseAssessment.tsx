'use client'

// components/client/PhaseAssessment.tsx
// Exact same style as /start build mode.

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '@/lib/ThemeContext'

export interface PhaseOption {
  label: string
  value: string
  nextId: string | null
}

export interface PhaseQuestion {
  id: string
  topic: string
  question: string
  collectAs: string
  type: 'single' | 'multi'
  maxSelect?: number
  options: PhaseOption[]
}

interface HistoryEntry {
  questionId: string
  topic: string
  question: string
  answer: string
  selectedValue: string | string[]
  nextId: string | null
}

interface PhaseAssessmentProps {
  phaseNumber: 1 | 2
  phaseLabel: string
  introText: string
  questionsMap: Record<string, PhaseQuestion>
  startQuestionId: string
  onComplete: (data: Record<string, string | string[]>) => void
  onExit: () => void
}

const NIGHT_THEMES = [
  '#656c73', '#60706d', '#5f7064', '#736f60', '#807b68', '#776457', '#8c7d7b',
]

export default function PhaseAssessment({
  phaseNumber, phaseLabel, introText, questionsMap, startQuestionId, onComplete, onExit,
}: PhaseAssessmentProps) {
  const { theme, toggleTheme } = useTheme()
  const [isDayMode, setIsDayMode] = useState(false)
  useEffect(() => { setIsDayMode(theme === 'light') }, [theme])

  const [themeBottom, setThemeBottom] = useState(NIGHT_THEMES[0])
  const [hasFaded, setHasFaded] = useState(false)
  const [buildVisible, setBuildVisible] = useState(false)
  const [canHover, setCanHover] = useState(false)
  const [isScrolledDown, setIsScrolledDown] = useState(false)

  const [currentQuestionId, setCurrentQuestionId] = useState(startQuestionId)
  const [collectedData, setCollectedData] = useState<Record<string, string | string[]>>({})
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setThemeBottom(NIGHT_THEMES[Math.floor(Math.random() * NIGHT_THEMES.length)])
    setTimeout(() => setHasFaded(true), 100)
    setTimeout(() => setBuildVisible(true), 200)
    setCanHover(window.matchMedia('(hover: hover)').matches)
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [])

  const smoothScroll = useCallback((target: HTMLElement | null, duration = 1000) => {
    const container = scrollRef.current
    if (!container || !target) return
    const cRect = container.getBoundingClientRect()
    const tRect = target.getBoundingClientRect()
    const offset = cRect.height * 0.08
    const start = container.scrollTop
    const end = start + (tRect.top - cRect.top) - offset
    const distance = end - start
    if (Math.abs(distance) < 5) return
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      container.scrollTop = start + distance * ease
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    if (isComplete) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    } else {
      requestAnimationFrame(() => requestAnimationFrame(() => smoothScroll(currentRef.current, 1000)))
    }
  }, [history.length, isComplete, smoothScroll])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setIsScrolledDown(el.scrollTop > 200)
  }, [])

  const currentQuestion = !isComplete && editingIndex === null ? questionsMap[currentQuestionId] : null
  const editingEntry = editingIndex !== null ? history[editingIndex] : null
  const editingQuestion = editingEntry ? questionsMap[editingEntry.questionId] : null

  useEffect(() => {
    const activeQ = editingQuestion || currentQuestion
    if (!activeQ) return
    if (activeQ.type === 'multi') {
      const existing = collectedData[activeQ.collectAs]
      setMultiSelected(existing && Array.isArray(existing) ? existing : [])
    } else {
      setMultiSelected([])
    }
  }, [currentQuestionId, editingIndex])

  const textColor = isDayMode ? '#252525' : '#ffffff'
  const assistantStyle: React.CSSProperties = {
    maxWidth: '85%', padding: '12px 0', color: textColor,
    fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', lineHeight: 1.6, opacity: 0.85,
  }
  const userBubbleStyle: React.CSSProperties = {
    maxWidth: '85%', padding: '12px 16px', borderRadius: '18px 18px 4px 18px',
    backgroundColor: isDayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
    color: textColor, fontFamily: 'var(--font-inter), sans-serif',
    fontSize: '15px', lineHeight: 1.6, opacity: 0.95,
  }
  const optionHoverBg = isDayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'
  const optionBaseBg = isDayMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)'
  const optionSelectedBg = isDayMode ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.14)'
  const optionBtnBase: React.CSSProperties = {
    width: '100%', padding: '14px 20px', borderRadius: '14px', border: 'none',
    backgroundColor: optionBaseBg, color: textColor,
    fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', lineHeight: 1.5,
    textAlign: 'center' as const, cursor: 'pointer',
    transition: 'background-color 0.2s, opacity 0.2s', opacity: 0.8,
  }
  const topicStyle: React.CSSProperties = {
    marginBottom: '6px', fontFamily: 'var(--font-inter), sans-serif',
    fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em',
    textTransform: 'uppercase' as const, color: textColor, opacity: 0.3,
  }

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

  const renderOptions = (q: PhaseQuestion, onSelect: (o: PhaseOption) => void) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
      {q.options.map((option, idx) => (
        q.type === 'multi' ? (
          <button key={idx} onClick={() => handleMultiToggle(option.value)} style={{
            ...optionBtnBase,
            backgroundColor: multiSelected.includes(option.value) ? optionSelectedBg : optionBaseBg,
            boxShadow: multiSelected.includes(option.value)
              ? (isDayMode ? 'inset 0 0 0 1px rgba(0,0,0,0.15)' : 'inset 0 0 0 1px rgba(255,255,255,0.15)') : 'none',
          }}
            onMouseEnter={canHover ? e => { if (!multiSelected.includes(option.value)) e.currentTarget.style.backgroundColor = optionHoverBg } : undefined}
            onMouseLeave={canHover ? e => { e.currentTarget.style.backgroundColor = multiSelected.includes(option.value) ? optionSelectedBg : optionBaseBg } : undefined}
          >{renderLabel(option.label)}</button>
        ) : (
          <button key={idx} onClick={() => onSelect(option)} style={optionBtnBase}
            onMouseEnter={canHover ? e => { e.currentTarget.style.backgroundColor = optionHoverBg; e.currentTarget.style.opacity = '1' } : undefined}
            onMouseLeave={canHover ? e => { e.currentTarget.style.backgroundColor = optionBaseBg; e.currentTarget.style.opacity = '0.8' } : undefined}
          >{renderLabel(option.label)}</button>
        )
      ))}
      {q.type === 'multi' && (
        <button onClick={handleMultiConfirm} disabled={multiSelected.length === 0} style={{
          ...optionBtnBase, textAlign: 'center', fontWeight: 500, marginTop: '4px',
          opacity: multiSelected.length > 0 ? 0.8 : 0.3,
          cursor: multiSelected.length > 0 ? 'pointer' : 'not-allowed',
          backgroundColor: multiSelected.length > 0 ? optionHoverBg : optionBaseBg,
        }}>Continue</button>
      )}
    </div>
  )

  const handleOption = (option: PhaseOption) => {
    const q = currentQuestion
    if (!q || q.type === 'multi') return
    setCollectedData(prev => ({ ...prev, [q.collectAs]: option.value }))
    const entry: HistoryEntry = {
      questionId: currentQuestionId, topic: q.topic, question: q.question,
      answer: option.label.replace(/\n/g, ' '), selectedValue: option.value, nextId: option.nextId,
    }
    setHistory(prev => [...prev, entry])
    if (option.nextId === null) { setIsComplete(true) } else { setCurrentQuestionId(option.nextId) }
  }

  const handleEditSelect = (option: PhaseOption) => {
    if (editingIndex === null || !editingQuestion || !editingEntry) return
    const oldEntry = history[editingIndex]
    const sameBranch = option.nextId === oldEntry.nextId
    const newEntry: HistoryEntry = {
      questionId: oldEntry.questionId, topic: oldEntry.topic, question: oldEntry.question,
      answer: option.label.replace(/\n/g, ' '), selectedValue: option.value, nextId: option.nextId,
    }
    if (sameBranch) {
      const updated = [...history]; updated[editingIndex] = newEntry
      setHistory(updated)
      setCollectedData(prev => ({ ...prev, [editingQuestion.collectAs]: option.value }))
      setEditingIndex(null)
    } else {
      const truncated = history.slice(0, editingIndex); truncated.push(newEntry)
      const newCollected: Record<string, string | string[]> = {}
      truncated.forEach(e => { const q = questionsMap[e.questionId]; if (q) newCollected[q.collectAs] = e.selectedValue })
      setCollectedData(newCollected); setHistory(truncated); setEditingIndex(null); setIsComplete(false)
      if (option.nextId === null) { setIsComplete(true) } else { setCurrentQuestionId(option.nextId) }
    }
  }

  const handleMultiToggle = (value: string) => {
    const activeQ = editingQuestion || currentQuestion
    if (!activeQ) return
    const max = activeQ.maxSelect || 2
    setMultiSelected(prev => {
      if (prev.includes(value)) return prev.filter(v => v !== value)
      if (prev.length >= max) return [...prev.slice(0, max - 1), value]
      return [...prev, value]
    })
  }

  const handleMultiConfirm = () => {
    const activeQ = editingQuestion || currentQuestion
    if (!activeQ || multiSelected.length === 0) return
    const selectedLabels = activeQ.options.filter(o => multiSelected.includes(o.value)).map(o => o.label.replace(/\n/g, ' ')).join(', ')
    const nextId = activeQ.options[0].nextId
    if (editingIndex !== null && editingEntry) {
      const updated = [...history]; updated[editingIndex] = { ...editingEntry, answer: selectedLabels, selectedValue: multiSelected, nextId }
      setHistory(updated); setCollectedData(prev => ({ ...prev, [activeQ.collectAs]: multiSelected })); setEditingIndex(null)
    } else {
      setCollectedData(prev => ({ ...prev, [activeQ.collectAs]: multiSelected }))
      const entry: HistoryEntry = { questionId: currentQuestionId, topic: activeQ.topic, question: activeQ.question, answer: selectedLabels, selectedValue: multiSelected, nextId }
      setHistory(prev => [...prev, entry])
      if (nextId === null) { setIsComplete(true) } else { setCurrentQuestionId(nextId) }
    }
  }

  return (
    <div className="start-chat" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50,
      display: 'flex', flexDirection: 'column', touchAction: 'none',
      background: isDayMode ? '#ffffff' : `linear-gradient(to bottom, #252525 0%, #252525 80px, ${themeBottom} 100%)`,
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, #252525 0%, #252525 80px, #3a3a3a 100%)',
        opacity: (hasFaded || isDayMode) ? 0 : 1, transition: isDayMode ? 'none' : 'opacity 5s ease',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ height: '67px', flexShrink: 0, position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '880px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'flex-end', padding: '0 48px', boxSizing: 'border-box' }}>
          <button
            onClick={onExit}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: textColor, opacity: 0.7,
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '13px', fontWeight: 400, transition: 'opacity 0.2s',
            }}
            onMouseEnter={canHover ? e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' } : undefined}
            onMouseLeave={canHover ? e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.7' } : undefined}
          >
            exit
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', flex: 1, minHeight: 0, zIndex: 1, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
          background: `linear-gradient(to bottom, ${isDayMode ? '#ffffff' : '#252525'} 0%, transparent 100%)`,
          zIndex: 10, pointerEvents: 'none',
        }} />
        <div ref={scrollRef} onScroll={handleScroll} style={{
          height: '100%', overflowY: 'auto', overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch', overscrollBehavior: 'none', touchAction: 'pan-y',
          maskImage: 'linear-gradient(to bottom, black 0%, black 95%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 95%, transparent 100%)',
        }}>
          <div className="start-chat-content" style={{ maxWidth: '880px', margin: '0 auto' }}>
            <div style={{ opacity: buildVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>

              {/* Intro */}
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'flex-start' }}>
                <div style={assistantStyle}>
                  <p style={{ opacity: 0.4, fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
                    {phaseLabel}
                  </p>
                  {introText.split('\n').map((line, i) => (
                    <span key={i}>{i > 0 && <br />}{line}</span>
                  ))}
                </div>
              </div>

              {/* History */}
              {history.map((entry, i) => {
                const isEditing = editingIndex === i
                return (
                  <div key={`${entry.questionId}-${i}`}>
                    <div style={topicStyle}>{entry.topic}</div>
                    <div style={{ marginBottom: isEditing ? '16px' : '12px', display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={assistantStyle}>{entry.question}</div>
                    </div>
                    {isEditing ? (
                      <div style={{ animation: 'fadeIn 300ms ease' }}>{renderOptions(editingQuestion!, handleEditSelect)}</div>
                    ) : (
                      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                        <div onClick={() => setEditingIndex(i)} style={{ ...userBubbleStyle, cursor: 'pointer', transition: 'background-color 0.2s, opacity 0.2s' }}
                          onMouseEnter={canHover ? e => { e.currentTarget.style.backgroundColor = isDayMode ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.13)'; e.currentTarget.style.opacity = '1' } : undefined}
                          onMouseLeave={canHover ? e => { e.currentTarget.style.backgroundColor = isDayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.opacity = '0.95' } : undefined}
                        >{entry.answer}</div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Current question */}
              {currentQuestion && editingIndex === null && (
                <div ref={currentRef}>
                  <div style={topicStyle}>{currentQuestion.topic}</div>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={assistantStyle}>{currentQuestion.question}</div>
                  </div>
                  {renderOptions(currentQuestion, handleOption)}
                </div>
              )}

              {/* Complete */}
              {isComplete && editingIndex === null && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '20vh', paddingBottom: '10vh', animation: 'fadeIn 300ms ease' }}>
                  <div style={{ color: textColor, fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', lineHeight: 1.8, opacity: 0.85, marginBottom: '24px' }}>
                    <p>Done</p>
                    <p>Phase {phaseNumber} complete</p>
                    <p style={{ opacity: 0.5 }}>Your answers have been saved.</p>
                  </div>
                  <button onClick={() => onComplete(collectedData)} style={{ ...optionBtnBase, textAlign: 'center', fontWeight: 500, width: 'auto', maxWidth: '200px' }}
                    onMouseEnter={canHover ? e => { e.currentTarget.style.backgroundColor = optionHoverBg; e.currentTarget.style.opacity = '1' } : undefined}
                    onMouseLeave={canHover ? e => { e.currentTarget.style.backgroundColor = optionBaseBg; e.currentTarget.style.opacity = '0.8' } : undefined}
                  >Back to dashboard</button>
                  <button
                    onClick={() => {
                      setHistory([])
                      setCollectedData({})
                      setCurrentQuestionId(startQuestionId)
                      setIsComplete(false)
                      setEditingIndex(null)
                      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: textColor, opacity: 0.35, fontSize: '13px',
                      fontFamily: 'var(--font-inter), sans-serif',
                      marginTop: '16px', textDecoration: 'underline',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={canHover ? e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.65' } : undefined}
                    onMouseLeave={canHover ? e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.35' } : undefined}
                  >
                    Redo this phase
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top — minimal, no bottom bar */}
      <button onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '36px', height: '36px', borderRadius: '50%', border: 'none',
        backgroundColor: isDayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
        color: textColor, cursor: 'pointer', opacity: isScrolledDown ? 0.5 : 0,
        pointerEvents: isScrolledDown ? 'auto' : 'none', transition: 'opacity 0.3s ease',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
      </button>

      <style>{`
        .start-chat-content{padding:85px 48px 40px}
        @media(max-width:767px){.start-chat-content{padding:85px 34px 40px}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>
    </div>
  )
}
