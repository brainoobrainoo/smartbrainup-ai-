'use client'

// app/(smartbrainup-ai)/start/page.tsx

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AssistantInputBar from '@/components/assistant/AssistantInputBar'
import BuildChatButton from '@/components/ui/BuildChatButton'
import type { AssistantInputBarHandle } from '@/components/assistant/AssistantInputBar'
import { createClient } from '@/lib/supabase/client'
import { startChatContent } from '@/content/smartbrainup-ai/start-chat'
import { useTheme } from '@/lib/ThemeContext'

type Message = {
  role: 'user' | 'assistant'
  content: string
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

  // ── POST-CHECKOUT: save Phase 1 to DB and start Phase 2 ──
  const performPostCheckoutSave = async (user: { id: string; email?: string; user_metadata?: { full_name?: string } }) => {
    try {
      const sb = createClient()
      let phase1Data: Record<string, unknown> = {}
      try {
        const saved = localStorage.getItem('phase1_results')
        if (saved) phase1Data = JSON.parse(saved)
      } catch {}
      const { data, error } = await sb.from('assessments').insert({
        user_id: user.id,
        user_email: user.email,
        user_name: user.user_metadata?.full_name || user.email,
        responses: { phase1: phase1Data, phase2: {} },
        phase2_complete: false,
      }).select('id').single()
      localStorage.removeItem('phase1_results')
      localStorage.removeItem('post_checkout_pending')
    } catch (e) { console.error('[PostCheckout] Save error:', e) }
    setIsLoggedIn(true)
    router.push('/client')
  }

  // ── HANDLE STRIPE RETURN ──
  useEffect(() => {
    const checkout = searchParams.get('checkout')
    if (checkout !== 'success') return
    window.history.replaceState({}, '', '/start')

    const init = async () => {
      // Restore Phase 1 state from localStorage
      try {
        const saved = localStorage.getItem('phase1_results')
        if (saved) {
          const parsed = JSON.parse(saved)
          setIsPricingVisible(false)
          setInputBarVisible(false)
          setBuildMode(true)
          setTimeout(() => {
            setBuildVisible(true)
            if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0
            window.scrollTo(0, 0)
          }, 100)
        }
      } catch {}

      // Check if already logged in
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (user) {
        // Already logged in — save Phase 1 and start Phase 2 immediately
        await performPostCheckoutSave(user)
      } else {
        // Not logged in — show login card
        localStorage.setItem('post_checkout_pending', 'true')
        router.push('/login')
      }
    }
    init()
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
  const [savedMessages, setSavedMessages] = useState<Message[]>([])



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



  useEffect(() => {
    setThemeBottom(NIGHT_THEMES[Math.floor(Math.random() * NIGHT_THEMES.length)])
  }, [])

  // ── CHECK AUTH ON MOUNT + LISTEN FOR LOGIN (magic link / OAuth) ──
  useEffect(() => {
    const sb = createClient()

    const handleUser = async (user: any) => {
      setIsLoggedIn(true)
      const { data } = await sb.from('user_profiles').select('credits').eq('id', user.id).single()
      if (data) setUserCredits(data.credits)

      const postCheckout = localStorage.getItem('post_checkout_pending')
      if (postCheckout === 'true') {
        try {
          const saved = localStorage.getItem('phase1_results')
          if (saved) {
            const parsed = JSON.parse(saved)
            setIsPricingVisible(false)
            setInputBarVisible(false)
            setBuildMode(true)
            setTimeout(() => {
              setBuildVisible(true)
              if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0
            }, 100)
          }
        } catch {}
        await performPostCheckoutSave(user)
      }
    }

    // Initial check
    sb.auth.getUser().then(({ data: { user } }: any) => {
      if (user) handleUser(user)
    })

    // Listen for SIGNED_IN — catches magic link and OAuth redirects
    const { data: { subscription } } = sb.auth.onAuthStateChange((event: string, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        handleUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
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

  const handleBuildClick = useCallback(() => {
    setSavedMessages([...messages])
    setBuildMode(true)
    setIsPricingVisible(true)
    setInputBarVisible(false)
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0
    setTimeout(() => {
      setBuildVisible(true)
      setTimeout(() => {
        if (pricingRef.current) smoothScrollToElement(pricingRef.current, 600)
      }, 200)
    }, 100)
  }, [messages, smoothScrollToElement])

  const handleBackToChat = useCallback(() => {
    setBuildVisible(false)
    setTimeout(() => {
      setBuildMode(false)
      setInputBarVisible(true)
      setMessages(savedMessages)
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0
    }, 300)
  }, [savedMessages])



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
      window.location.href = url
    } catch (err) {
      console.error('[Checkout] Failed:', err)
      setIsPricingLoading(null)
    }
  }, [])

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
              {(
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

              {/* ── PRICING ── */}
              {isPricingVisible && (
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
          {(
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
