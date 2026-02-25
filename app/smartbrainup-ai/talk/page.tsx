'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import AssistantInputBar from '@/components/assistant/AssistantInputBar'

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

  useEffect(() => {
    setThemeBottom(NIGHT_THEMES[Math.floor(Math.random() * NIGHT_THEMES.length)])
  }, [])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

  // Trigger background fade after mount
  useEffect(() => {
    const timer = setTimeout(() => setHasFaded(true), 100)
    return () => clearTimeout(timer)
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
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAtBottom])

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 100)
  }, [])

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)

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
          padding: '80px 24px 40px',
        }}>
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

      {/* Input bar — rises with keyboard on mobile */}
      <div style={{
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
        paddingBottom: keyboardOffset > 0 ? `${keyboardOffset}px` : 'env(safe-area-inset-bottom)',
        transition: 'padding-bottom 0.15s ease-out',
      }}>
        <AssistantInputBar
          onSend={handleSend}
          isLoading={isLoading}
          isDayMode={isDayMode}
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
