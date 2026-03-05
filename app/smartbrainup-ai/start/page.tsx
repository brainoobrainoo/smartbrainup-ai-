'use client'

// app/(smartbrainup-ai)/start/page.tsx

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AssistantInputBar from '@/components/assistant/AssistantInputBar'
import BuildChatButton from '@/components/ui/BuildChatButton'
import type { AssistantInputBarHandle } from '@/components/assistant/AssistantInputBar'
import { createClient } from '@/lib/supabase/client'
import { startChatContent } from '@/content/smartbrainup-ai/start-chat'
import { 
  questionsMap,
  startQuestionId,
  AdaptiveOption,
  CollectedData 
} from '@/content/smartbrainup-ai/start'
import {
  phase2QuestionsMap,
  phase2StartQuestionId,
  Phase2CollectedData,
} from '@/content/smartbrainup-ai/phase2'
import { useTheme } from '@/lib/ThemeContext'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type BuildHistoryEntry = {
  questionId: string
  topic: string
  question: string
  answer: string
  selectedValue: string | string[]
  nextId: string | null
  phase: 1 | 2
}

// ── Night themes — bottom gradient colors (top always #252525) ──
const NIGHT_THEMES = [
  '#656c73', '#60706d', '#5f7064', '#736f60', '#807b68', '#776457', '#8c7d7b',
]

export default function StartPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasFaded, setHasFaded] = useState(false)
  const [themeBottom, setThemeBottom] = useState(NIGHT_THEMES[0])
  const [isDayMode, setIsDayMode] = useState(false)
  const { theme, toggleTheme } = useTheme()

  // Sync isDayMode with ThemeContext
  useEffect(() => {
    setIsDayMode(theme === 'light')
  }, [theme])
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [welcomeVisible, setWelcomeVisible] = useState(false)
  const inputBarRef = useRef<AssistantInputBarHandle>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // ── HANDLE STRIPE RETURN ──
  useEffect(() => {
    const checkout = searchParams.get('checkout')
    if (checkout === 'success') {
      // Clean URL
      window.history.replaceState({}, '', '/start')
      // Re-check credits — webhook may have already updated them
      const recheck = async () => {
        const sb = createClient()
        const { data: { user } } = await sb.auth.getUser()
        if (user) {
          setIsLoggedIn(true)
          const { data } = await sb.from('user_profiles').select('credits').eq('id', user.id).single()
          if (data && data.credits > 0) {
            setUserCredits(data.credits)
            // If Phase 1 was already complete, go to Phase 2
            setIsAssessmentComplete(true)
            setIsPricingVisible(false)
            setIsPhase2Active(true)
            setCurrentQuestionId(phase2StartQuestionId)
          }
        }
      }
      recheck()
    }
  }, [searchParams])

  // ── HOVER: only on devices with real pointer (no sticky touch hover) ──
  const [canHover, setCanHover] = useState(false)
  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover)').matches)
  }, [])

  // ── BUILD MODE STATE ──
  const [buildMode, setBuildMode] = useState(false)
  const [buildVisible, setBuildVisible] = useState(false)
  const [inputBarVisible, setInputBarVisible] = useState(true)
  const [currentQuestionId, setCurrentQuestionId] = useState(startQuestionId)
  const [collectedData, setCollectedData] = useState<CollectedData>({})
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false)
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  const [buildChatHistory, setBuildChatHistory] = useState<BuildHistoryEntry[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [savedMessages, setSavedMessages] = useState<Message[]>([])

  // ── PHASE 2 STATE ──
  const [isPhase2Active, setIsPhase2Active] = useState(false)
  const [isPhase2Complete, setIsPhase2Complete] = useState(false)
  const [phase2CollectedData, setPhase2CollectedData] = useState<Phase2CollectedData>({})

  // ── FREE CHAT + FINAL STATE ──
  const [isFreeChatActive, setIsFreeChatActive] = useState(false)
  const [isFinalComplete, setIsFinalComplete] = useState(false)

  // ── PRICING INLINE STATE ──
  const [isPricingVisible, setIsPricingVisible] = useState(false)
  const [isPricingLoading, setIsPricingLoading] = useState<string | null>(null)

  // Reset loading state quando l'utente torna dalla pagina Stripe
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setIsPricingLoading(null)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const question = buildMode && !isAssessmentComplete && !isPhase2Active && editingIndex === null ? questionsMap[currentQuestionId] : null
  const phase2Question = buildMode && isPhase2Active && !isPhase2Complete && editingIndex === null ? phase2QuestionsMap[currentQuestionId] : null
  const editingEntry = editingIndex !== null ? buildChatHistory[editingIndex] : null
  const editingQuestion = editingEntry
    ? (editingEntry.phase === 2 ? phase2QuestionsMap : questionsMap)[editingEntry.questionId]
    : null

  useEffect(() => {
    setThemeBottom(NIGHT_THEMES[Math.floor(Math.random() * NIGHT_THEMES.length)])
  }, [])

  // ── CHECK AUTH ON MOUNT ──
  useEffect(() => {
    const checkAuth = async () => {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (user) {
        setIsLoggedIn(true)
        const { data } = await sb.from('user_profiles').select('credits').eq('id', user.id).single()
        if (data) setUserCredits(data.credits)
      }
    }
    checkAuth()
  }, [])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setHasFaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setWelcomeVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0
  }, [])

  // ── LOCK BODY SCROLL + prevent iOS Safari rubber-band ──
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    const preventTouch = (e: TouchEvent) => {
      if (scrollContainerRef.current?.contains(e.target as Node)) return
      e.preventDefault()
    }
    document.addEventListener('touchmove', preventTouch, { passive: false })
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.removeEventListener('touchmove', preventTouch)
    }
  }, [])

  // ── DYNAMIC HEADER STYLES ──
  useEffect(() => {
    const id = 'start-chat-header-styles'
    let el = document.getElementById(id) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = id
      document.head.appendChild(el)
    }
    const fg = isDayMode ? '#252525' : '#ffffff'
    const bg = isDayMode ? '#ffffff' : '#252525'
    const border = isDayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
    el.textContent = [
      `body:has(.start-chat) header{background:transparent!important;backdrop-filter:none!important}`,
      `body:has(.start-chat) header *,body:has(.start-chat) header button,body:has(.start-chat) header a{color:${fg}!important}`,
      `body:has(.start-chat) header a[href="/client"]{background-color:${fg}!important;color:${bg}!important}`,
      `body:has(.start-chat) header button span{background-color:${fg}!important}`,
      `body:has(.start-chat) header nav{background:${bg}!important;border-color:${border}!important}`,
    ].join('')
    return () => { el?.remove() }
  }, [isDayMode])

  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      const el = scrollContainerRef.current
      if (el) {
        if (isLoading) { el.scrollTop = el.scrollHeight }
        else { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }
      }
    }
  }, [messages, isAtBottom, isLoading])

  // ── BUILD MODE: smooth scroll to a target element ──
  const currentQuestionRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)

  const smoothScrollToElement = useCallback((target: HTMLElement | null, duration: number = 1000) => {
    const container = scrollContainerRef.current
    if (!container || !target) return
    const containerRect = container.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    // Position target near top of container viewport
    const offset = containerRect.height * 0.08
    const start = container.scrollTop
    const end = start + (targetRect.top - containerRect.top) - offset
    const distance = end - start
    if (Math.abs(distance) < 5) return
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3)
      container.scrollTop = start + distance * ease
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    if (!buildMode) return
    if (isPhase2Complete) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' })
      }, 400)
    } else if (isAssessmentComplete && !isPhase2Active) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' })
      }, 400)
    } else {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          smoothScrollToElement(currentQuestionRef.current, 1000)
        })
      })
    }
  }, [buildChatHistory.length, buildMode, isAssessmentComplete, isPhase2Active, isPhase2Complete, smoothScrollToElement])

  // ── BUILD MODE: save to localStorage on Phase 1 complete ──
  useEffect(() => {
    if (!isAssessmentComplete) return
    try { localStorage.setItem('phase1_results', JSON.stringify(collectedData)) }
    catch (e) { console.error('Failed to save phase1:', e) }
  }, [isAssessmentComplete])

  // ── BUILD MODE: save to localStorage on Phase 2 complete ──
  useEffect(() => {
    if (!isPhase2Complete) return
    try { localStorage.setItem('phase2_results', JSON.stringify(phase2CollectedData)) }
    catch (e) { console.error('Failed to save phase2:', e) }
  }, [isPhase2Complete])

  // ── AUTO-TRANSITION: Phase 2 complete → free chat ──
  useEffect(() => {
    if (!isPhase2Complete || isFreeChatActive) return
    const timer = setTimeout(() => {
      // Exit build mode
      setBuildVisible(false)
      setTimeout(() => {
        setBuildMode(false)
        setIsFreeChatActive(true)
        setInputBarVisible(true)
        // Inject the transition messages
        setMessages([
          { role: 'assistant', content: startChatContent.phase2Complete + '\n' + startChatContent.phase2CompleteDetail + '\n' + startChatContent.phase2CompleteSub },
          { role: 'assistant', content: startChatContent.freeChatPrompt },
        ])
        // Scroll to bottom after messages render
        setTimeout(() => {
          scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' })
        }, 200)
      }, 300)
    }, 1500)
    return () => clearTimeout(timer)
  }, [isPhase2Complete, isFreeChatActive])

  // ── BUILD MODE: restore multi-select state ──
  useEffect(() => {
    if (!buildMode) return
    const activeQ = editingQuestion || phase2Question || question
    if (!activeQ) return
    if (activeQ.type === 'multi') {
      const dataSource = isPhase2Active ? phase2CollectedData : collectedData
      const existing = dataSource[activeQ.collectAs]
      setMultiSelected(existing && Array.isArray(existing) ? existing : [])
    } else {
      setMultiSelected([])
    }
  }, [currentQuestionId, buildMode, editingIndex, isPhase2Active])

  const [isScrolledDown, setIsScrolledDown] = useState(false)

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 100)
    setIsScrolledDown(el.scrollTop > 200)
  }, [])

  const handleChipClick = useCallback((q: string) => {
    inputBarRef.current?.setInputText(q)
  }, [])

  const scrollToTop = useCallback(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return
    const userMessage: Message = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)
    setIsAtBottom(true)
    setTimeout(() => { scrollContainerRef.current && (scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight) }, 50)

    try {
      const res = await fetch('/api/public-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      })
      if (!res.ok) throw new Error('Request failed')
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream')
      const decoder = new TextDecoder()
      let assistantContent = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantContent += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantContent }
          return updated
        })
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  // ═══════════════════════════════════════════
  // BUILD MODE HANDLERS
  // ═══════════════════════════════════════════

  const handleBuildClick = useCallback(async () => {
    if (isFreeChatActive && !isFinalComplete) {
      // Final Build — user finished explaining their project
      setIsFinalComplete(true)
      setInputBarVisible(false)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: startChatContent.finalComplete },
      ])

      // Collect free chat text
      const freeChatMessages = messages.filter(m => m.role === 'user').map(m => m.content)
      const projectDescription = freeChatMessages.join('\n\n')

      // Save to localStorage (temporary)
      try {
        localStorage.setItem('freeChat_results', JSON.stringify(freeChatMessages))
      } catch (e) { console.error('Failed to save freeChat locally:', e) }

      // Write Phase 1 + Phase 2 + free chat to Supabase
      try {
        const sb = createClient()
        const { data: { user } } = await sb.auth.getUser()

        const allResponses = {
          phase1: collectedData,
          phase2: phase2CollectedData,
        }

        const payload: Record<string, unknown> = {
          responses: allResponses,
          phase2_complete: true,
          project_description: projectDescription,
        }

        if (user) {
          payload.user_id = user.id
          payload.user_email = user.email
          payload.user_name = user.user_metadata?.full_name || user.email
        }

        const { error } = await sb.from('assessments').insert(payload)
        if (error) console.error('[Build] Supabase insert error:', error.message)
        else {
          // Clear localStorage after successful Supabase write
          localStorage.removeItem('phase1_results')
          localStorage.removeItem('phase2_results')
          localStorage.removeItem('freeChat_results')
        }
      } catch (e) { console.error('[Build] Failed to write to Supabase:', e) }

      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' })
      }, 200)
      return
    }
    setSavedMessages([...messages])
    setBuildMode(true)
    setInputBarVisible(false)
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0
    setTimeout(() => setBuildVisible(true), 100)
  }, [messages, isFreeChatActive, isFinalComplete, collectedData, phase2CollectedData])

  const handleBackToChat = useCallback(() => {
    setBuildVisible(false)
    setTimeout(() => {
      setBuildMode(false)
      setInputBarVisible(true)
      setMessages(savedMessages)
      setEditingIndex(null)
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0
    }, 300)
  }, [savedMessages])

  // ── NEW ANSWER (current question at the end of the path) ──
  const handleAssessmentOption = useCallback((option: AdaptiveOption) => {
    const activeQ = isPhase2Active ? phase2Question : question
    if (!activeQ || activeQ.type === 'multi') return

    if (isPhase2Active) {
      setPhase2CollectedData(prev => ({ ...prev, [activeQ.collectAs]: option.value }))
    } else {
      setCollectedData(prev => ({ ...prev, [activeQ.collectAs]: option.value }))
    }

    const entry: BuildHistoryEntry = {
      questionId: currentQuestionId,
      topic: activeQ.topic,
      question: activeQ.question,
      answer: option.label.replace(/\n/g, ' '),
      selectedValue: option.value,
      nextId: option.nextId,
      phase: isPhase2Active ? 2 : 1,
    }
    setBuildChatHistory(prev => [...prev, entry])

    if (option.nextId === null) {
      if (isPhase2Active) {
        setIsPhase2Complete(true)
      } else {
        setIsAssessmentComplete(true)
      }
    } else {
      setCurrentQuestionId(option.nextId)
    }
  }, [question, phase2Question, collectedData, phase2CollectedData, currentQuestionId, isPhase2Active])

  // ── EDIT: tap an existing answer ──
  const handleEditAnswer = useCallback((index: number) => {
    const entry = buildChatHistory[index]
    if (!entry) return
    // Only allow editing answers from the current active phase
    const currentPhaseNum = isPhase2Active ? 2 : 1
    if (entry.phase !== currentPhaseNum) return

    if (isPhase2Active && isPhase2Complete && index === buildChatHistory.length - 1) {
      setIsPhase2Complete(false)
    } else if (!isPhase2Active && isAssessmentComplete && index === buildChatHistory.length - 1) {
      setIsAssessmentComplete(false)
    }
    setEditingIndex(index)
  }, [isAssessmentComplete, isPhase2Active, isPhase2Complete, buildChatHistory.length])

  // ── EDIT: pick a new option for an existing answer ──
  const handleEditSelect = useCallback((option: AdaptiveOption) => {
    if (editingIndex === null || !editingQuestion || !editingEntry) return

    const isPhase2Entry = editingEntry.phase === 2
    const oldEntry = buildChatHistory[editingIndex]
    const sameBranch = option.nextId === oldEntry.nextId

    const newEntry: BuildHistoryEntry = {
      questionId: oldEntry.questionId,
      topic: oldEntry.topic,
      question: oldEntry.question,
      answer: option.label.replace(/\n/g, ' '),
      selectedValue: option.value,
      nextId: option.nextId,
      phase: oldEntry.phase,
    }

    if (sameBranch) {
      // Same branch — just update this answer, keep everything after
      const updatedHistory = [...buildChatHistory]
      updatedHistory[editingIndex] = newEntry
      setBuildChatHistory(updatedHistory)

      // Update correct collected data
      if (isPhase2Entry) {
        setPhase2CollectedData(prev => ({ ...prev, [editingQuestion.collectAs]: option.value }))
      } else {
        setCollectedData(prev => ({ ...prev, [editingQuestion.collectAs]: option.value }))
      }

      setEditingIndex(null)
    } else {
      // Different branch — truncate everything after this point (within the same phase)
      const truncatedHistory = buildChatHistory.slice(0, editingIndex)
      truncatedHistory.push(newEntry)

      // Keep entries from the OTHER phase that came after (shouldn't happen, but safety)
      // Actually: if editing Phase 1 while Phase 2 exists, truncate Phase 2 too
      // If editing Phase 2, only truncate Phase 2 entries after this point
      
      // Rebuild collected data for the affected phase
      if (isPhase2Entry) {
        const newPhase2Collected: Phase2CollectedData = {}
        truncatedHistory.filter(e => e.phase === 2).forEach(entry => {
          const q = phase2QuestionsMap[entry.questionId]
          if (q) newPhase2Collected[q.collectAs] = entry.selectedValue as string
        })
        setPhase2CollectedData(newPhase2Collected)
        setIsPhase2Complete(false)
      } else {
        // Editing Phase 1 — truncate everything including Phase 2
        const newCollected: CollectedData = {}
        truncatedHistory.filter(e => e.phase === 1).forEach(entry => {
          const q = questionsMap[entry.questionId]
          if (q) newCollected[q.collectAs] = entry.selectedValue
        })
        setCollectedData(newCollected)
        // If Phase 2 was active, reset it
        if (isPhase2Active) {
          setIsPhase2Active(false)
          setIsPhase2Complete(false)
          setPhase2CollectedData({})
        }
        setIsAssessmentComplete(false)
      }

      setBuildChatHistory(truncatedHistory)
      setEditingIndex(null)

      if (option.nextId === null) {
        if (isPhase2Entry) { setIsPhase2Complete(true) }
        else { setIsAssessmentComplete(true) }
      } else {
        setCurrentQuestionId(option.nextId)
      }
    }
  }, [editingIndex, editingQuestion, editingEntry, buildChatHistory, isPhase2Active])

  // ── MULTI-SELECT HANDLERS ──
  const handleMultiToggle = useCallback((value: string) => {
    const activeQ = editingQuestion || question
    if (!activeQ) return
    const max = activeQ.maxSelect || 2
    setMultiSelected(prev => {
      if (prev.includes(value)) return prev.filter(v => v !== value)
      if (prev.length >= max) return [...prev.slice(0, max - 1), value]
      return [...prev, value]
    })
  }, [question, editingQuestion])

  const handleMultiConfirm = useCallback(() => {
    const activeQ = editingQuestion || phase2Question || question
    if (!activeQ || multiSelected.length === 0) return

    const selectedLabels = activeQ.options
      .filter(o => multiSelected.includes(o.value))
      .map(o => o.label.replace(/\n/g, ' '))
      .join(', ')

    const nextId = activeQ.options[0].nextId
    const entryPhase: 1 | 2 = isPhase2Active ? 2 : 1

    if (editingIndex !== null) {
      // Editing existing multi answer
      const oldEntry = buildChatHistory[editingIndex]
      const sameBranch = nextId === oldEntry.nextId
      const isPhase2Entry = oldEntry.phase === 2

      const newEntry: BuildHistoryEntry = {
        questionId: oldEntry.questionId,
        topic: oldEntry.topic,
        question: oldEntry.question,
        answer: selectedLabels,
        selectedValue: multiSelected,
        nextId,
        phase: oldEntry.phase,
      }

      if (sameBranch) {
        const updatedHistory = [...buildChatHistory]
        updatedHistory[editingIndex] = newEntry
        setBuildChatHistory(updatedHistory)
        if (isPhase2Entry) {
          setPhase2CollectedData(prev => ({ ...prev, [activeQ.collectAs]: multiSelected }))
        } else {
          setCollectedData(prev => ({ ...prev, [activeQ.collectAs]: multiSelected }))
        }
        setEditingIndex(null)
      } else {
        const truncatedHistory = buildChatHistory.slice(0, editingIndex)
        truncatedHistory.push(newEntry)
        if (isPhase2Entry) {
          const newPhase2Collected: Phase2CollectedData = {}
          truncatedHistory.filter(e => e.phase === 2).forEach(entry => {
            const q = phase2QuestionsMap[entry.questionId]
            if (q) newPhase2Collected[q.collectAs] = entry.selectedValue as string
          })
          setPhase2CollectedData(newPhase2Collected)
          setIsPhase2Complete(false)
        } else {
          const newCollected: CollectedData = {}
          truncatedHistory.filter(e => e.phase === 1).forEach(entry => {
            const q = questionsMap[entry.questionId]
            if (q) newCollected[q.collectAs] = entry.selectedValue
          })
          setCollectedData(newCollected)
          if (isPhase2Active) {
            setIsPhase2Active(false)
            setIsPhase2Complete(false)
            setPhase2CollectedData({})
          }
          setIsAssessmentComplete(false)
        }
        setBuildChatHistory(truncatedHistory)
        setEditingIndex(null)
        if (nextId === null) {
          if (isPhase2Entry) { setIsPhase2Complete(true) }
          else { setIsAssessmentComplete(true) }
        } else { setCurrentQuestionId(nextId) }
      }
    } else {
      // New multi answer
      if (isPhase2Active) {
        setPhase2CollectedData(prev => ({ ...prev, [activeQ.collectAs]: multiSelected }))
      } else {
        setCollectedData(prev => ({ ...prev, [activeQ.collectAs]: multiSelected }))
      }

      const entry: BuildHistoryEntry = {
        questionId: currentQuestionId,
        topic: activeQ.topic,
        question: activeQ.question,
        answer: selectedLabels,
        selectedValue: multiSelected,
        nextId,
        phase: entryPhase,
      }
      setBuildChatHistory(prev => [...prev, entry])

      if (nextId === null) {
        if (isPhase2Active) { setIsPhase2Complete(true) }
        else { setIsAssessmentComplete(true) }
      } else { setCurrentQuestionId(nextId) }
    }
  }, [question, phase2Question, editingQuestion, multiSelected, collectedData, phase2CollectedData, currentQuestionId, editingIndex, buildChatHistory, isPhase2Active])

  const handleContinue = useCallback(() => {
    if (isLoggedIn && userCredits !== null && userCredits > 0) {
      // Has credits → start Phase 2 directly
      setIsPhase2Active(true)
      setCurrentQuestionId(phase2StartQuestionId)
    } else {
      // No credits → show pricing inline + scroll to it
      setIsPricingVisible(true)
      setTimeout(() => {
        if (pricingRef.current) {
          smoothScrollToElement(pricingRef.current, 600)
        } else {
          scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' })
        }
      }, 100)
    }
  }, [isLoggedIn, userCredits, smoothScrollToElement])

  // ── STRIPE CHECKOUT ──
  const handleSelectPlan = useCallback(async (planKey: string) => {
    setIsPricingLoading(planKey)
    try {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      const email = user?.email || null

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey, email }),
      })
      const { url, error } = await res.json()
      if (error || !url) throw new Error(error || 'No URL')
      // Save phase1 data again right before redirect — guarantees localStorage is set
      try { localStorage.setItem('phase1_results', JSON.stringify(collectedData)) } catch {}
      window.location.href = url
    } catch (err) {
      console.error('[Checkout] Failed:', err)
      setIsPricingLoading(null)
    }
  }, [])

  // ── Helper: render label with mobile line breaks ──
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

  // ── Render options for a question ──
  const renderOptions = (q: typeof question | typeof phase2Question, onSelect: (o: AdaptiveOption) => void) => {
    if (!q) return null
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
        {q.options.map((option, idx) => (
          q.type === 'multi' ? (
            <button
              key={idx}
              onClick={() => handleMultiToggle(option.value)}
              style={{
                ...optionBtnBase,
                backgroundColor: multiSelected.includes(option.value) ? optionSelectedBg : optionBaseBg,
                boxShadow: multiSelected.includes(option.value)
                  ? (isDayMode ? 'inset 0 0 0 1px rgba(0,0,0,0.15)' : 'inset 0 0 0 1px rgba(255,255,255,0.15)')
                  : 'none',
              }}
              onMouseEnter={canHover ? (e) => { if (!multiSelected.includes(option.value)) e.currentTarget.style.backgroundColor = optionHoverBg } : undefined}
              onMouseLeave={canHover ? (e) => { e.currentTarget.style.backgroundColor = multiSelected.includes(option.value) ? optionSelectedBg : optionBaseBg } : undefined}
            >
              {renderLabel(option.label)}
            </button>
          ) : (
            <button
              key={idx}
              onClick={() => onSelect(option)}
              style={optionBtnBase}
              onMouseEnter={canHover ? (e) => { e.currentTarget.style.backgroundColor = optionHoverBg; e.currentTarget.style.opacity = '1' } : undefined}
              onMouseLeave={canHover ? (e) => { e.currentTarget.style.backgroundColor = optionBaseBg; e.currentTarget.style.opacity = '0.8' } : undefined}
            >
              {renderLabel(option.label)}
            </button>
          )
        ))}
        {q.type === 'multi' && (
          <button
            onClick={handleMultiConfirm}
            disabled={multiSelected.length === 0}
            style={{
              ...optionBtnBase,
              textAlign: 'center',
              fontWeight: 500,
              marginTop: '4px',
              opacity: multiSelected.length > 0 ? 0.8 : 0.3,
              cursor: multiSelected.length > 0 ? 'pointer' : 'not-allowed',
              backgroundColor: multiSelected.length > 0 ? optionHoverBg : optionBaseBg,
            }}
          >
            Continue
          </button>
        )}
      </div>
    )
  }

  // ── Shared styles ──
  const textColor = isDayMode ? '#252525' : '#ffffff'
  const assistantStyle: React.CSSProperties = {
    maxWidth: '85%',
    padding: '12px 0',
    color: textColor,
    fontFamily: 'var(--font-inter), sans-serif',
    fontSize: '15px',
    lineHeight: 1.6,
    opacity: 0.85,
  }
  const userBubbleStyle: React.CSSProperties = {
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: '18px 18px 4px 18px',
    backgroundColor: isDayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
    color: textColor,
    fontFamily: 'var(--font-inter), sans-serif',
    fontSize: '15px',
    lineHeight: 1.6,
    opacity: 0.95,
  }
  const optionBtnBase: React.CSSProperties = {
    width: '100%',
    padding: '14px 20px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: isDayMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
    color: textColor,
    fontFamily: 'var(--font-inter), sans-serif',
    fontSize: '15px',
    lineHeight: 1.5,
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s, opacity 0.2s',
    opacity: 0.8,
  }
  const optionHoverBg = isDayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'
  const optionBaseBg = isDayMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)'
  const optionSelectedBg = isDayMode ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.14)'
  const topicLabelStyle: React.CSSProperties = {
    marginBottom: '6px',
    fontFamily: 'var(--font-inter), sans-serif',
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: textColor,
    opacity: 0.3,
  }

  return (
    <div className="start-chat" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      touchAction: 'none',
      background: isDayMode
        ? '#ffffff'
        : `linear-gradient(to bottom, #252525 0%, #252525 80px, ${themeBottom} 100%)`,
    }}>

      {/* Dark overlay — fades out over 5s */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, #252525 0%, #252525 80px, #3a3a3a 100%)',
        opacity: (hasFaded || isDayMode) ? 0 : 1,
        transition: isDayMode ? 'none' : 'opacity 5s ease',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Header spacer */}
      <div style={{ height: '67px', flexShrink: 0, position: 'relative', zIndex: 1 }} />

      {/* Messages area */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0, zIndex: 1, overflow: 'hidden' }}>
        {/* Fade top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
          background: `linear-gradient(to bottom, ${isDayMode ? '#ffffff' : '#252525'} 0%, transparent 100%)`,
          zIndex: 10, pointerEvents: 'none',
        }} />

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{
            height: '100%',
            overflowY: 'auto', overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'none',
            touchAction: 'pan-y',
            maskImage: 'linear-gradient(to bottom, black 0%, black 95%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 95%, transparent 100%)',
          }}
        >
        <div className="start-chat-content" style={{ maxWidth: '880px', margin: '0 auto' }}>

          {/* ═══════════════════════════════════════════ */}
          {/* CHAT MODE                                   */}
          {/* ═══════════════════════════════════════════ */}
          {!buildMode && (
            <>
              {!isFreeChatActive && (
              <div style={{
                marginBottom: '24px',
                opacity: welcomeVisible ? 1 : 0,
                transition: 'opacity 2s ease',
              }}>
                <div style={{
                  maxWidth: '85%', padding: '12px 0',
                  color: textColor, fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '15px', lineHeight: 1.6, opacity: 0.85,
                }}>
                  <p>{startChatContent.welcomeLine1}</p>
                  <p>{startChatContent.welcomeLine2}</p>
                  <p style={{ marginBottom: '16px' }}>{startChatContent.welcomeLine3}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', marginLeft: '-14px' }}>
                    {startChatContent.quickQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleChipClick(q)}
                        disabled={isLoading}
                        style={{
                          padding: '7px 14px', borderRadius: '20px', border: 'none',
                          backgroundColor: isDayMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
                          color: textColor, fontFamily: 'var(--font-inter), sans-serif',
                          fontSize: '13px', lineHeight: 1.4,
                          cursor: isLoading ? 'default' : 'pointer',
                          opacity: isLoading ? 0.3 : 0.72,
                          transition: 'opacity 0.2s, background-color 0.2s', whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={canHover ? (e) => { if (!isLoading) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.backgroundColor = isDayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)' }} : undefined}
                        onMouseLeave={canHover ? (e) => { e.currentTarget.style.opacity = isLoading ? '0.3' : '0.72'; e.currentTarget.style.backgroundColor = isDayMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)' } : undefined}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <p>{startChatContent.welcomeLine4}</p>
                </div>
              </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} style={{
                  marginBottom: '24px', display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: msg.role === 'user' ? '12px 16px' : '12px 0',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '0',
                    backgroundColor: msg.role === 'user'
                      ? (isDayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)')
                      : 'transparent',
                    color: textColor, fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '15px', lineHeight: 1.6,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    opacity: msg.role === 'user' ? 0.95 : 0.85,
                  }}>
                    {msg.content}
                    {msg.role === 'assistant' && isLoading && i === messages.length - 1 && !msg.content && (
                      <span style={{ opacity: 0.3 }}>...</span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* BUILD MODE                                  */}
          {/* ═══════════════════════════════════════════ */}
          {buildMode && (
            <div style={{ opacity: buildVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>

              {/* ── INTRO ── */}
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'flex-start' }}>
                <div style={assistantStyle}>
                  {startChatContent.buildIntro.split('\n').map((line, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── HISTORY: answered pairs ── */}
              {buildChatHistory.map((pair, i) => {
                const isEditing = editingIndex === i
                const currentPhaseNum = isPhase2Active ? 2 : 1
                const canEditThis = pair.phase === currentPhaseNum

                // Insert Phase 1 complete marker + Phase 2 intro before first Phase 2 entry
                const isFirstPhase2 = pair.phase === 2 && (i === 0 || buildChatHistory[i - 1].phase === 1)

                return (
                  <div key={`${pair.questionId}-${i}`}>
                    {isFirstPhase2 && (
                      <>
                        {/* Phase 1 complete marker */}
                        <div style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          textAlign: 'center', padding: '40px 0 48px',
                        }}>
                          <div style={{
                            color: textColor, fontFamily: 'var(--font-inter), sans-serif',
                            fontSize: '15px', lineHeight: 1.8, opacity: 0.85,
                          }}>
                            <p>{startChatContent.buildComplete}</p>
                            <p>{startChatContent.buildCompleteDetail}</p>
                            <p style={{ opacity: 0.5 }}>{startChatContent.buildCompleteSub}</p>
                          </div>
                        </div>
                        {/* Phase 2 intro */}
                        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'flex-start' }}>
                          <div style={assistantStyle}>
                            {startChatContent.phase2Intro.split('\n').map((line, li) => (
                              <span key={li}>
                                {li > 0 && <br />}
                                {line}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Topic label */}
                    <div style={topicLabelStyle}>{pair.topic}</div>

                    {/* Question */}
                    <div style={{ marginBottom: isEditing ? '16px' : '12px', display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={assistantStyle}>{pair.question}</div>
                    </div>

                    {isEditing ? (
                      /* ── EDITING: show options ── */
                      <div style={{
                        animation: 'fadeIn 300ms ease',
                      }}>
                        {renderOptions(editingQuestion, handleEditSelect)}
                      </div>
                    ) : (
                      /* ── ANSWERED: clickable bubble ── */
                      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                        <div
                          onClick={canEditThis ? () => handleEditAnswer(i) : undefined}
                          style={{
                            ...userBubbleStyle,
                            cursor: canEditThis ? 'pointer' : 'default',
                            transition: 'background-color 0.2s, opacity 0.2s',
                          }}
                          onMouseEnter={canHover && canEditThis ? (e) => {
                            e.currentTarget.style.backgroundColor = isDayMode ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.13)'
                            e.currentTarget.style.opacity = '1'
                          } : undefined}
                          onMouseLeave={canHover && canEditThis ? (e) => {
                            e.currentTarget.style.backgroundColor = isDayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'
                            e.currentTarget.style.opacity = '0.95'
                          } : undefined}
                        >
                          {pair.answer}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* ── CURRENT QUESTION Phase 1 (end of path, not editing) ── */}
              {!isAssessmentComplete && !isPhase2Active && question && editingIndex === null && (
                <div ref={currentQuestionRef}>
                  <div style={topicLabelStyle}>{question.topic}</div>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={assistantStyle}>{question.question}</div>
                  </div>
                  {renderOptions(question, handleAssessmentOption)}
                </div>
              )}

              {/* ── PHASE 1 COMPLETION (only if Phase 2 not yet started) ── */}
              {isAssessmentComplete && !isPhase2Active && editingIndex === null && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  paddingTop: '20vh',
                  paddingBottom: '10vh',
                }}>
                  <div style={{
                    color: textColor,
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '15px',
                    lineHeight: 1.8,
                    opacity: 0.85,
                  }}>
                    <p>Done</p>
                    <p>Phase 1 complete</p>
                    <p style={{ opacity: 0.5 }}>{isLoggedIn && userCredits !== null && userCredits > 0
                      ? startChatContent.buildCompleteSub
                      : startChatContent.buildActivateSub
                    }</p>
                  </div>
                  <button
                    onClick={handleContinue}
                    style={{
                      ...optionBtnBase,
                      textAlign: 'center',
                      fontWeight: 500,
                      width: 'auto',
                      maxWidth: '200px',
                      marginTop: '24px',
                    }}
                    onMouseEnter={canHover ? (e) => { e.currentTarget.style.backgroundColor = optionHoverBg; e.currentTarget.style.opacity = '1' } : undefined}
                    onMouseLeave={canHover ? (e) => { e.currentTarget.style.backgroundColor = optionBaseBg; e.currentTarget.style.opacity = '0.8' } : undefined}
                  >
                    {isLoggedIn && userCredits !== null && userCredits > 0
                      ? startChatContent.buildContinue
                      : startChatContent.buildActivate
                    }
                  </button>
                </div>
              )}

              {/* ── PRICING INLINE (after Phase 1, no credits) ── */}
              {isAssessmentComplete && !isPhase2Active && isPricingVisible && editingIndex === null && (
                <div ref={pricingRef} style={{ animation: 'fadeIn 400ms ease', marginTop: '16px', marginBottom: '32px' }}>
                  <div style={{ ...assistantStyle, marginBottom: '24px', opacity: 0.85 }}>
                    One method. One commitment.
                  </div>
                  {[
                    { key: 'single',       label: '1 Second Brain',   price: '€1,997' },
                    { key: 'team',         label: '3 Second Brains',  price: '€4,997' },
                    { key: 'department',   label: '5 Second Brains',  price: '€7,997' },
                    { key: 'organization', label: '10 Second Brains', price: '€14,997' },
                  ].map(plan => (
                    <button
                      key={plan.key}
                      onClick={() => handleSelectPlan(plan.key)}
                      disabled={isPricingLoading !== null}
                      style={{
                        ...optionBtnBase,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                        opacity: isPricingLoading && isPricingLoading !== plan.key ? 0.3 : 0.8,
                        cursor: isPricingLoading !== null ? 'default' : 'pointer',
                      }}
                      onMouseEnter={canHover && !isPricingLoading ? (e) => { e.currentTarget.style.backgroundColor = optionHoverBg; e.currentTarget.style.opacity = '1' } : undefined}
                      onMouseLeave={canHover && !isPricingLoading ? (e) => { e.currentTarget.style.backgroundColor = optionBaseBg; e.currentTarget.style.opacity = '0.8' } : undefined}
                    >
                      <span>{plan.label}</span>
                      <span style={{ opacity: 0.6, fontSize: '13px' }}>
                        {isPricingLoading === plan.key ? '...' : plan.price}
                      </span>
                    </button>
                  ))}
                  <div style={{
                    marginTop: '16px',
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '12px',
                    color: textColor,
                    opacity: 0.35,
                    textAlign: 'center' as const,
                  }}>
                    One-time access — execution across five AI platforms
                  </div>
                </div>
              )}

              {/* ── PHASE 2 INTRO (when Phase 2 just started, no entries yet) ── */}
              {isPhase2Active && !buildChatHistory.some(e => e.phase === 2) && editingIndex === null && (
                <>
                  {/* Phase 1 complete marker */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    textAlign: 'center', padding: '40px 0 48px',
                  }}>
                    <div style={{
                      color: textColor, fontFamily: 'var(--font-inter), sans-serif',
                      fontSize: '15px', lineHeight: 1.8, opacity: 0.85,
                    }}>
                      <p>{startChatContent.buildComplete}</p>
                      <p>{startChatContent.buildCompleteDetail}</p>
                      <p style={{ opacity: 0.5 }}>{startChatContent.buildCompleteSub}</p>
                    </div>
                  </div>
                  {/* Phase 2 intro */}
                  <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={assistantStyle}>
                      {startChatContent.phase2Intro.split('\n').map((line, li) => (
                        <span key={li}>
                          {li > 0 && <br />}
                          {line}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── CURRENT QUESTION Phase 2 (end of path, not editing) ── */}
              {isPhase2Active && !isPhase2Complete && phase2Question && editingIndex === null && (
                <div ref={currentQuestionRef}>
                  <div style={topicLabelStyle}>{phase2Question.topic}</div>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={assistantStyle}>{phase2Question.question}</div>
                  </div>
                  {renderOptions(phase2Question, handleAssessmentOption)}
                </div>
              )}

              {/* ── PHASE 2 COMPLETION — brief transition before auto-switch to chat ── */}
              {isPhase2Complete && editingIndex === null && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  paddingTop: '20vh',
                  paddingBottom: '10vh',
                  animation: 'fadeIn 300ms ease',
                }}>
                  <div style={{
                    color: textColor,
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '15px',
                    lineHeight: 1.8,
                    opacity: 0.85,
                  }}>
                    <p>{startChatContent.phase2Complete}</p>
                    <p>{startChatContent.phase2CompleteDetail}</p>
                  </div>
                </div>
              )}

            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* BOTTOM BAR                                  */}
      {/* ═══════════════════════════════════════════ */}
      <div style={{
        flexShrink: 0, position: 'relative', zIndex: 1,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>

        {/* ── BUILD/CHAT TOGGLE + SCROLL-TO-TOP ── */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          paddingBottom: '12px', paddingTop: '8px',
          position: 'relative', minHeight: '81px', zIndex: 2,
        }}>
          {/* Outer ring */}
          {!isFinalComplete && (
            <div style={{ marginTop: '3px' }}>
              <BuildChatButton
                isBuildMode={buildMode}
                isDayMode={isDayMode}
                onClick={buildMode ? handleBackToChat : handleBuildClick}
              />
            </div>
          )}

          {/* Scroll to top */}
          <button
            onClick={scrollToTop}
            style={{
              position: 'absolute', right: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', borderRadius: '50%', border: 'none',
              backgroundColor: isDayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
              color: textColor, cursor: 'pointer',
              opacity: isScrolledDown ? 0.5 : 0,
              pointerEvents: isScrolledDown ? 'auto' : 'none',
              transition: 'opacity 0.3s ease',
            }}
            aria-label="Scroll to top"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>

        {/* ── INPUT BAR — fades out 3s in build mode ── */}
        <div style={{
          opacity: inputBarVisible ? 1 : 0,
          maxHeight: inputBarVisible ? '200px' : '0px',
          overflow: 'hidden',
          transition: 'opacity 3s ease, max-height 3s ease',
          pointerEvents: inputBarVisible ? 'auto' : 'none',
        }}>
          <AssistantInputBar
            ref={inputBarRef}
            onSend={handleSend}
            isLoading={isLoading}
            isDayMode={isDayMode}
            placeholder={startChatContent.placeholder}
            disclaimer={startChatContent.disclaimer}
            onToggleTheme={() => {
              if (isDayMode) {
                setThemeBottom(NIGHT_THEMES[Math.floor(Math.random() * NIGHT_THEMES.length)])
                setHasFaded(false)
                setTimeout(() => setHasFaded(true), 100)
              }
              setIsDayMode(!isDayMode)
              toggleTheme()
            }}
          />
        </div>

      </div>

      {/* Styles */}
      <style>{`
        .start-chat-content{padding:85px 48px 40px}
        @media(max-width:767px){.start-chat-content{padding:85px 34px 40px}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>
    </div>
  )
}
