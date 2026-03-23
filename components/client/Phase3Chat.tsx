'use client'

// components/client/Phase3Chat.tsx
// Exact same style as /start chat mode — uses real AssistantInputBar.

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '@/lib/ThemeContext'
import AssistantInputBar from '@/components/assistant/AssistantInputBar'
import type { AssistantInputBarHandle } from '@/components/assistant/AssistantInputBar'
import { phase3Content } from '@/content/smartbrainup-ai/phases/phase3'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Phase3ChatProps {
  initialText?: string
  assessmentId: string
  onComplete: (text: string) => void
  onExit: () => void
}

const NIGHT_THEMES = [
  '#656c73', '#60706d', '#5f7064', '#736f60', '#807b68', '#776457', '#8c7d7b',
]

export default function Phase3Chat({ initialText = '', assessmentId, onComplete, onExit }: Phase3ChatProps) {
  const { theme, toggleTheme } = useTheme()
  const [isDayMode, setIsDayMode] = useState(false)
  useEffect(() => { setIsDayMode(theme === 'light') }, [theme])

  const [themeBottom, setThemeBottom] = useState(NIGHT_THEMES[0])
  const [hasFaded, setHasFaded] = useState(false)
  const [welcomeVisible, setWelcomeVisible] = useState(false)
  const [canHover, setCanHover] = useState(false)
  const [isScrolledDown, setIsScrolledDown] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [droppedFiles, setDroppedFiles] = useState<File[] | undefined>(undefined)
  const [isDraggingPage, setIsDraggingPage] = useState(false)
  const dragCounterRef = useRef(0)

  // messages — starts with the intro assistant message
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: phase3Content.intro.message },
  ])
  // accumulate all user text
  const allUserText = messages.filter(m => m.role === 'user').map(m => m.content).join('\n\n')
  const hasUserText = allUserText.trim().length > 0

  const inputBarRef = useRef<AssistantInputBarHandle>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setThemeBottom(NIGHT_THEMES[Math.floor(Math.random() * NIGHT_THEMES.length)])
    setTimeout(() => setHasFaded(true), 100)
    setTimeout(() => setWelcomeVisible(true), 200)
    setCanHover(window.matchMedia('(hover: hover)').matches)
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    const preventTouch = (e: TouchEvent) => {
      if (scrollRef.current?.contains(e.target as Node)) return
      e.preventDefault()
    }
    document.addEventListener('touchmove', preventTouch, { passive: false })
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.removeEventListener('touchmove', preventTouch)
    }
  }, [])

  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      const el = scrollRef.current
      if (el) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAtBottom])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 100)
    setIsScrolledDown(el.scrollTop > 200)
  }, [])

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: text.trim() }])
  }, [])

  const handleAudioAsset = useCallback(async (blob: Blob, transcript: string) => {
    if (!assessmentId) return
    try {
      const formData = new FormData()
      formData.append('file', blob, 'recording.webm')
      formData.append('assessment_id', assessmentId)
      formData.append('file_type', 'audio')
      await fetch('/api/phase3/upload', { method: 'POST', body: formData })
    } catch (e) {
      console.error('[Phase3] Audio upload error:', e)
    }
  }, [assessmentId])

  const handleFileAsset = useCallback(async (file: File) => {
    if (!assessmentId) return
    try {
      const formData = new FormData()
      formData.append('file', file, file.name)
      formData.append('assessment_id', assessmentId)
      formData.append('file_type', file.type.startsWith('image/') ? 'image' : file.type.startsWith('audio/') ? 'audio' : 'document')
      await fetch('/api/phase3/upload', { method: 'POST', body: formData })
    } catch (e) {
      console.error('[Phase3] File upload error:', e)
    }
  }, [assessmentId])

  const handlePageDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    dragCounterRef.current++
    if (e.dataTransfer.types.includes('Files')) setIsDraggingPage(true)
  }, [])

  const handlePageDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) setIsDraggingPage(false)
  }, [])

  const handlePageDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
  }, [])

  const handlePageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    dragCounterRef.current = 0
    setIsDraggingPage(false)
    if (e.dataTransfer.files?.length) {
      setDroppedFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleExternalFilesProcessed = useCallback(() => {
    setDroppedFiles(undefined)
  }, [])

  useEffect(() => {
    const reset = () => { setIsDraggingPage(false); dragCounterRef.current = 0 }
    window.addEventListener('dragend', reset)
    window.addEventListener('drop', reset)
    return () => { window.removeEventListener('dragend', reset); window.removeEventListener('drop', reset) }
  }, [])

  const handleSave = () => {
    if (!hasUserText || isSaved) return
    setIsSaved(true)
    onComplete(allUserText)
  }

  const textColor = isDayMode ? '#252525' : '#ffffff'

  return (
    <div className="start-chat" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50,
      display: 'flex', flexDirection: 'column', touchAction: 'none',
      background: isDayMode ? '#ffffff' : `linear-gradient(to bottom, #252525 0%, #252525 80px, ${themeBottom} 100%)`,
    }}
      onDragEnter={handlePageDragEnter}
      onDragLeave={handlePageDragLeave}
      onDragOver={handlePageDragOver}
      onDrop={handlePageDrop}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, #252525 0%, #252525 80px, #3a3a3a 100%)',
        opacity: (hasFaded || isDayMode) ? 0 : 1, transition: isDayMode ? 'none' : 'opacity 5s ease',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Drag overlay — identical to secondbrain-chat */}
      {isDraggingPage && (
        <div
          onClick={() => { setIsDraggingPage(false); dragCounterRef.current = 0 }}
          style={{
            position: 'absolute', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', cursor: 'pointer',
          }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
            padding: '48px 64px', borderRadius: '24px',
            border: '2px dashed rgba(255,255,255,0.5)',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '17px', fontWeight: 500, fontFamily: 'var(--font-inter), sans-serif' }}>
              Drop files here
            </span>
          </div>
        </div>
      )}

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

      {/* Messages area */}
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

            <div style={{ opacity: welcomeVisible ? 1 : 0, transition: 'opacity 2s ease' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: '24px', display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: msg.role === 'user' ? '12px 16px' : '12px 0',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '0',
                    backgroundColor: msg.role === 'user' ? (isDayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)') : 'transparent',
                    color: textColor, fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '15px', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    opacity: msg.role === 'user' ? 0.95 : 0.85,
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Save button — appears after first user message */}
              {hasUserText && !isSaved && (
                <div style={{ marginBottom: '32px' }}>
                  <div style={{
                    maxWidth: '85%', padding: '12px 0',
                    color: textColor, fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '15px', lineHeight: 1.6, opacity: 0.85,
                  }}>
                    You can add more or edit your message above, then click Done when ready.
                  </div>
                </div>
              )}

              {hasUserText && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px', marginBottom: '32px' }}>
                  <button
                    onClick={handleSave}
                    disabled={isSaved}
                    style={{
                      padding: '14px 32px', borderRadius: '14px', border: 'none',
                      backgroundColor: isDayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.10)',
                      color: textColor, fontFamily: 'var(--font-inter), sans-serif',
                      fontSize: '15px', cursor: isSaved ? 'default' : 'pointer',
                      opacity: isSaved ? 0.5 : 0.8, transition: 'opacity 0.2s, background-color 0.2s',
                    }}
                    onMouseEnter={canHover && !isSaved ? e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.backgroundColor = isDayMode ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)' } : undefined}
                    onMouseLeave={canHover && !isSaved ? e => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.backgroundColor = isDayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.10)' } : undefined}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ flexShrink: 0, position: 'relative', zIndex: 1, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '12px', paddingTop: '8px', position: 'relative', minHeight: '20px', zIndex: 2 }}>
          <button onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} style={{
            position: 'absolute', right: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
            backgroundColor: isDayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
            color: textColor, cursor: 'pointer', opacity: isScrolledDown ? 0.5 : 0,
            pointerEvents: isScrolledDown ? 'auto' : 'none', transition: 'opacity 0.3s ease',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
          </button>
        </div>

        {/* AssistantInputBar — identical to /start */}
        <AssistantInputBar
          ref={inputBarRef}
          onSend={handleSend}
          isLoading={false}
          isDayMode={isDayMode}
          placeholder={phase3Content.placeholder}
          disclaimer={phase3Content.disclaimer}
          onAudioAsset={handleAudioAsset}
          onFileAsset={handleFileAsset}
          externalFiles={droppedFiles}
          onExternalFilesProcessed={handleExternalFilesProcessed}
          onToggleTheme={() => {
            if (isDayMode) setThemeBottom(NIGHT_THEMES[Math.floor(Math.random() * NIGHT_THEMES.length)])
            toggleTheme()
          }}
        />
      </div>

      <style>{`
        .start-chat-content{padding:85px 48px 40px}
        @media(max-width:767px){.start-chat-content{padding:85px 34px 40px}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>
    </div>
  )
}
