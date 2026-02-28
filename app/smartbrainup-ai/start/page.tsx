'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AssistantInputBar from '@/components/assistant/AssistantInputBar'
import type { AssistantInputBarHandle } from '@/components/assistant/AssistantInputBar'
import { createClient } from '@/lib/supabase/client'
import { startChatContent } from '@/content/smartbrainup-ai/start-chat'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

// ── Night themes — bottom gradient colors (top always #252525) ──
const NIGHT_THEMES = [
  '#656c73', // oceano
  '#60706d', // verde acqua
  '#5f7064', // verde prato
  '#736f60', // giallo sabbia
  '#807b68', // giallo girasole
  '#776457', // arancio
  '#8c7d7b', // rosa porcellino
]

export default function StartPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasFaded, setHasFaded] = useState(false)
  const [keyboardOffset, setKeyboardOffset] = useState(0)
  const [themeBottom, setThemeBottom] = useState(NIGHT_THEMES[0])
  const [isDayMode, setIsDayMode] = useState(false)
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [welcomeVisible, setWelcomeVisible] = useState(false)
  const inputBarRef = useRef<AssistantInputBarHandle>(null)
  const router = useRouter()

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

  // Trigger background fade after mount
  useEffect(() => {
    const timer = setTimeout(() => setHasFaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Welcome fade-in
  useEffect(() => {
    const timer = setTimeout(() => setWelcomeVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  // ── SCROLL TO TOP ON MOUNT ──
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [])

  // Mobile keyboard detection via visualViewport
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    const onResize = () => {
      const offset = window.innerHeight - vv.height
      setKeyboardOffset(offset > 50 ? offset : 0)
    }

    vv.addEventListener('resize', onResize)
    return () => vv.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAtBottom])

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 100)
  }, [])

  // ── CHIP CLICK — fills input bar via ref, does NOT send ──
  const handleChipClick = useCallback((question: string) => {
    inputBarRef.current?.setInputText(question)
  }, [])

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)
    setIsAtBottom(true)
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)

    try {
      const res = await fetch('/api/public-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
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

  return (
    <div className="start-chat" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      background: isDayMode
        ? '#ffffff'
        : `linear-gradient(to bottom, #252525 0%, #252525 80px, ${themeBottom} 100%)`,
    }}>

      {/* Dark overlay — fades out over 5s, hidden in day mode */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, #252525 0%, #252525 80px, #3a3a3a 100%)',
        opacity: (hasFaded || isDayMode) ? 0 : 1,
        transition: isDayMode ? 'none' : 'opacity 5s ease',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Header spacer */}
      <div style={{ height: '67px', flexShrink: 0, position: 'relative', zIndex: 1 }} />

      {/* Messages area */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0, zIndex: 1, overflow: 'hidden' }}>
        {/* Fade top */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: `linear-gradient(to bottom, ${isDayMode ? '#ffffff' : '#252525'} 0%, transparent 100%)`,
          zIndex: 10,
          pointerEvents: 'none',
        }} />

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
          }}
        >
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '85px 24px 40px',
        }}>

          {/* ── WELCOME BLOCK — fade in 2s ── */}
          <div style={{
            marginBottom: '24px',
            opacity: welcomeVisible ? 1 : 0,
            transition: 'opacity 2s ease',
          }}>
            <div style={{
              maxWidth: '85%',
              padding: '12px 0',
              color: isDayMode ? '#252525' : '#ffffff',
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '15px',
              lineHeight: 1.6,
              opacity: 0.85,
            }}>
              {/* Welcome. */}
              <p>{startChatContent.welcomeLine1}</p>
              {/* Ask me anything about the method. */}
              <p style={{ marginBottom: '16px' }}>{startChatContent.welcomeLine2}</p>

              {/* Quick question chips — text aligned with paragraph, bubbles spill left */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '16px',
                marginLeft: '-14px',
              }}>
                {startChatContent.quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChipClick(q)}
                    disabled={isLoading}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: isDayMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
                      color: isDayMode ? '#252525' : '#ffffff',
                      fontFamily: 'var(--font-inter), sans-serif',
                      fontSize: '13px',
                      lineHeight: 1.4,
                      cursor: isLoading ? 'default' : 'pointer',
                      opacity: isLoading ? 0.3 : 0.72,
                      transition: 'opacity 0.2s, background-color 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.opacity = '0.9'
                        e.currentTarget.style.backgroundColor = isDayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = isLoading ? '0.3' : '0.72'
                      e.currentTarget.style.backgroundColor = isDayMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Or ask anything you want. */}
              <p>{startChatContent.welcomeLine3}</p>
              {/* When you've seen enough, tap Build. */}
              <p>{startChatContent.welcomeLine4}</p>
            </div>
          </div>

          {/* ── CHAT MESSAGES ── */}
          {messages.map((msg, i) => (
            <div key={i} style={{
              marginBottom: '24px',
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '85%',
                padding: msg.role === 'user' ? '12px 16px' : '12px 0',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '0',
                backgroundColor: msg.role === 'user'
                  ? (isDayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)')
                  : 'transparent',
                color: isDayMode ? '#252525' : '#ffffff',
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '15px',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                opacity: msg.role === 'user' ? 0.95 : 0.85,
              }}>
                {msg.content}
                {msg.role === 'assistant' && isLoading && i === messages.length - 1 && !msg.content && (
                  <span style={{ opacity: 0.3 }}>...</span>
                )}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>
      </div>

      {/* Build button + Input bar — rises with keyboard on mobile */}
      <div style={{
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
        paddingBottom: keyboardOffset > 0 ? `${keyboardOffset}px` : 'env(safe-area-inset-bottom)',
        transition: 'padding-bottom 0.15s ease-out',
      }}>

        {/* ── BUILD BUTTON — centered above the cloud ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '12px',
          paddingTop: '8px',
        }}>
          {/* Outer concentric ring */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '65px',
            height: '65px',
            borderRadius: '50%',
            border: isDayMode ? '1px solid rgba(0,0,0,0.17)' : '1px solid rgba(255,255,255,0.17)',
          }}>
            <Link href="/build" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              backgroundColor: isDayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
              border: isDayMode ? '1px solid rgba(0,0,0,0.5)' : '1px solid rgba(255,255,255,0.5)',
              color: isDayMode ? '#252525' : '#ffffff',
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s, opacity 0.2s',
              opacity: 0.6,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.backgroundColor = isDayMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.14)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.6'
              e.currentTarget.style.backgroundColor = isDayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'
            }}>
              {startChatContent.buildButton}
            </Link>
          </div>
        </div>

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
          }}
        />
      </div>

      {/* Scoped styles — header + burger + mobile menu */}
      <style>{`
        body:has(.start-chat) header {
          background: transparent !important;
          backdrop-filter: none !important;
        }
        body:has(.start-chat) header *,
        body:has(.start-chat) header button,
        body:has(.start-chat) header a {
          color: ${isDayMode ? '#252525' : '#ffffff'} !important;
        }
        body:has(.start-chat) header a[href="/client"] {
          background-color: ${isDayMode ? '#252525' : '#ffffff'} !important;
          color: ${isDayMode ? '#ffffff' : '#252525'} !important;
        }
        body:has(.start-chat) header button span {
          background-color: ${isDayMode ? '#252525' : '#ffffff'} !important;
        }
        body:has(.start-chat) header nav {
          background: ${isDayMode ? '#ffffff' : '#252525'} !important;
          border-color: ${isDayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'} !important;
        }
      `}</style>
    </div>
  )
}
