'use client'

import { useState, useRef, useCallback, useEffect, useLayoutEffect, useImperativeHandle, forwardRef, KeyboardEvent } from 'react'

// ── LAYOUT TOKENS — dimensions and spacing only ──
const L = {
  maxWidth: '880px',
  containerPadding: '0 16px',
  containerPaddingBottom: '12px',
  cloud: { borderRadius: '24px' },
  textarea: { padding: '14px 18px 4px', fontSize: '15px', lineHeight: '1.5', fontFamily: 'var(--font-inter), sans-serif', maxHeight: '200px' },
  iconsRow: { padding: '4px 8px 8px' },
  sendButton: { size: '34px', iconSize: 18 },
  plusButton: { padding: '6px', borderRadius: '8px', iconSize: 22 },
  disclaimer: { fontSize: '11px', marginTop: '10px' },
}

const C_NIGHT = {
  cloud: 'rgba(255,255,255,0.08)',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.4)',
  textSubtle: 'rgba(255,255,255,0.2)',
  sendActiveBg: '#ffffff',
  sendActiveColor: '#252525',
  sendInactiveBg: 'rgba(255,255,255,0.2)',
  sendInactiveColor: 'rgba(255,255,255,0.4)',
  disclaimer: 'rgba(255,255,255,0.2)',
}

const C_DAY = {
  cloud: 'rgba(0,0,0,0.06)',
  text: '#252525',
  textMuted: 'rgba(37,37,37,0.4)',
  textSubtle: 'rgba(37,37,37,0.2)',
  sendActiveBg: '#252525',
  sendActiveColor: '#ffffff',
  sendInactiveBg: 'rgba(37,37,37,0.12)',
  sendInactiveColor: 'rgba(37,37,37,0.3)',
  disclaimer: 'rgba(37,37,37,0.25)',
}

// ── Real audio visualizer — reads actual microphone data ──
function LiveAudioBars({ stream, barColor }: { stream: MediaStream | null, barColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const smoothRef = useRef<number[]>([])
  const colorRef = useRef<[number, number, number]>([255, 255, 255])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || !stream) return

    const dpr = window.devicePixelRatio || 1

    // Parse barColor prop
    const tempEl = document.createElement('div')
    tempEl.style.color = barColor
    document.body.appendChild(tempEl)
    const computed = getComputedStyle(tempEl).color
    document.body.removeChild(tempEl)
    const match = computed.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
    if (match) {
      colorRef.current = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
    }

    const resize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
    }
    resize()

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioCtxRef.current = audioCtx
    const source = audioCtx.createMediaStreamSource(stream)
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.7
    source.connect(analyser)
    analyserRef.current = analyser

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const NUM_BARS = 100
    if (smoothRef.current.length === 0) {
      smoothRef.current = new Array(NUM_BARS).fill(2)
    }

    const draw = () => {
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      const midY = h / 2

      analyser.getByteFrequencyData(dataArray)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const barWidth = 1.5
      const totalGaps = NUM_BARS - 1
      const barGap = (w - NUM_BARS * barWidth) / totalGaps

      const usableBins = Math.floor(bufferLength * 0.45)
      const halfBars = Math.floor(NUM_BARS / 2)

      const voiceData: number[] = []
      for (let i = 0; i < halfBars; i++) {
        const startBin = Math.floor(i * usableBins / halfBars)
        const endBin = Math.floor((i + 1) * usableBins / halfBars)
        let sum = 0
        const count = endBin - startBin || 1
        for (let j = startBin; j < endBin && j < bufferLength; j++) {
          sum += dataArray[j]
        }
        voiceData.push(sum / count / 255)
      }

      const fullData: number[] = []
      for (let i = halfBars - 1; i >= 0; i--) fullData.push(voiceData[i])
      for (let i = 0; i < halfBars; i++) fullData.push(voiceData[i])

      for (let i = 0; i < NUM_BARS; i++) {
        const raw = fullData[i] || 0
        const prev = smoothRef.current[i]
        const target = Math.max(raw, 0.012)
        smoothRef.current[i] = prev + (target - prev) * 0.35

        const val = smoothRef.current[i]
        const totalBarH = Math.max(2, val * (h - 4))
        const halfH = totalBarH / 2
        const x = i * (barWidth + barGap)

        const distFromCenter = Math.abs(i - NUM_BARS / 2) / (NUM_BARS / 2)
        const fadeAlpha = Math.pow(1 - distFromCenter, 1.5)
        const alpha = 0.6 * fadeAlpha

        const [r, g, b] = colorRef.current
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.beginPath()
        ctx.fillRect(x, midY - halfH, barWidth, totalBarH)
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
        audioCtxRef.current = null
      }
    }
  }, [stream, barColor])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '36px' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
}

// ── COMPONENT ──

export interface AssistantInputBarHandle {
  setInputText: (text: string) => void
}

interface AssistantInputBarProps {
  onSend: (message: string) => void
  isLoading: boolean
  isDayMode?: boolean
  onToggleTheme?: () => void
  placeholder?: string
  disclaimer?: string
  // Optional: called after transcription with blob + transcript (used by Phase3Chat)
  onAudioAsset?: (blob: Blob, transcript: string) => void
}

const AssistantInputBar = forwardRef<AssistantInputBarHandle, AssistantInputBarProps>(({ onSend, isLoading, isDayMode = false, onToggleTheme, placeholder = 'Ask your question...', disclaimer = 'AI-UP Second Brain\u2122', onAudioAsset }, ref) => {
  const C = isDayMode ? C_DAY : C_NIGHT
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // ── EXPOSE setInputText TO PARENT ──
  useImperativeHandle(ref, () => ({
    setInputText: (text: string) => {
      setInput(text)
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }))

  // ── TEXTAREA AUTO-RESIZE ──
  useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = '0'
    el.style.height = Math.min(el.scrollHeight, parseInt(L.textarea.maxHeight)) + 'px'
  }, [input])

  // ── RECORDING ──

  const startRecording = useCallback(async () => {
    if (isLoading || isTranscribing) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setActiveStream(stream)
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Mic access denied:', error)
    }
  }, [isLoading, isTranscribing])

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.ondataavailable = null
      mediaRecorderRef.current.stop()
    }
    if (activeStream) activeStream.getTracks().forEach(t => t.stop())
    setActiveStream(null)
    setIsRecording(false)
    chunksRef.current = []
  }, [activeStream])

  const confirmRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) return

    mediaRecorderRef.current.ondataavailable = async (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)

      if (activeStream) activeStream.getTracks().forEach(t => t.stop())
      setActiveStream(null)

      setIsTranscribing(true)
      try {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const formData = new FormData()
        formData.append('file', blob, 'recording.webm')
        const res = await fetch('/api/transcribe', { method: 'POST', body: formData })
        if (res.ok) {
          const data = await res.json()
          if (data.text) {
            const transcript = data.text.trim()
            setInput(prev => {
              const sep = prev.trim() ? ' ' : ''
              return prev + sep + transcript
            })
            setTimeout(() => textareaRef.current?.focus(), 50)
            if (onAudioAsset) {
              onAudioAsset(blob, transcript)
            }
          }
        }
      } catch (error) {
        console.error('Transcription failed:', error)
      } finally {
        setIsTranscribing(false)
      }
    }

    mediaRecorderRef.current.stop()
    setIsRecording(false)
  }, [activeStream])

  // ── SEND ──

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setInput('')
  }, [input, isLoading, onSend])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const hasContent = !!input.trim()

  const iconBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px', borderRadius: '8px', background: 'none', border: 'none',
    cursor: active ? 'pointer' : 'not-allowed',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: active ? 1 : 0.4,
    transition: `color 0.2s, opacity 0.2s, transform 0.15s`,
  })

  return (
    <div className="assistant-input-wrap" style={{ padding: L.containerPadding, paddingBottom: L.containerPaddingBottom, position: 'relative' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 767px) {
          .assistant-input-inner { padding: 0 !important; }
          .assistant-input-wrap { padding-bottom: 7px !important; }
          .assistant-input-wrap .assistant-disclaimer { margin-top: 6px !important; }
        }
      `}</style>

      <div className="assistant-input-inner" style={{ maxWidth: L.maxWidth, margin: '0 auto', padding: '0 30px' }}>
        <div style={{
          backgroundColor: C.cloud,
          borderRadius: L.cloud.borderRadius,
          transition: 'none',
        }}>

          {/* Transcribing indicator */}
          {isTranscribing && (
            <div style={{ padding: '12px 16px 0 16px', display: 'flex', alignItems: 'center', gap: '8px', color: C.textMuted, fontSize: '13px', transition: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              Transcribing...
            </div>
          )}

          {/* Recording visualizer or textarea */}
          {isRecording ? (
            <div style={{ padding: L.textarea.padding }}>
              <LiveAudioBars stream={activeStream} barColor={C.text} />
            </div>
          ) : (
            <div style={{ padding: L.textarea.padding }}>
              <textarea
                ref={textareaRef}
                onFocus={() => setTimeout(() => textareaRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' }), 300)}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                disabled={isLoading || isTranscribing}
                style={{
                  width: '100%', backgroundColor: 'transparent', fontSize: L.textarea.fontSize,
                  lineHeight: L.textarea.lineHeight, color: C.text, outline: 'none',
                  border: 'none', resize: 'none', maxHeight: L.textarea.maxHeight,
                  padding: 0, fontFamily: L.textarea.fontFamily,
                  transition: 'none',
                }}
              />
            </div>
          )}

          {/* Icons row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: L.iconsRow.padding }}>
            {isRecording ? (
              <>
                {/* Cancel */}
                <button onClick={cancelRecording} style={{ ...iconBtnStyle(true), color: C.textMuted }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.transform = 'scale(1.12)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.transform = 'scale(1)' }}
                  aria-label="Cancel recording">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* Confirm */}
                <button onClick={confirmRecording} style={{
                  width: L.sendButton.size, height: L.sendButton.size, borderRadius: '50%', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: C.sendActiveBg, color: C.sendActiveColor,
                  transition: 'none',
                }} aria-label="Confirm and transcribe">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* Sun/Moon toggle */}
                <button
                  onClick={onToggleTheme}
                  disabled={isLoading || isTranscribing}
                  style={{
                    padding: L.plusButton.padding, borderRadius: L.plusButton.borderRadius,
                    background: 'none', border: 'none',
                    cursor: isLoading || isTranscribing ? 'not-allowed' : 'pointer',
                    color: C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: isLoading || isTranscribing ? 0.4 : 1,
                    transition: 'color 0.2s, opacity 0.2s, transform 0.15s',
                  }}
                  aria-label={isDayMode ? 'Night mode' : 'Day mode'}>
                  {isDayMode ? (
                    <svg width={L.plusButton.iconSize} height={L.plusButton.iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  ) : (
                    <svg width={L.plusButton.iconSize} height={L.plusButton.iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"/>
                      <line x1="12" y1="1" x2="12" y2="3"/>
                      <line x1="12" y1="21" x2="12" y2="23"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                      <line x1="1" y1="12" x2="3" y2="12"/>
                      <line x1="21" y1="12" x2="23" y2="12"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                  )}
                </button>

                {/* Right side: mic + send */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Mic */}
                  <button onClick={startRecording} disabled={isLoading || isTranscribing}
                    style={{ ...iconBtnStyle(!isLoading && !isTranscribing), color: C.textMuted, transition: 'color 0.2s, opacity 0.2s, transform 0.15s' }}
                    aria-label="Voice input">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="2" width="6" height="12" rx="3" />
                      <path d="M19 10v1a7 7 0 01-14 0v-1" />
                      <line x1="12" y1="18" x2="12" y2="22" />
                      <line x1="8" y1="22" x2="16" y2="22" />
                    </svg>
                  </button>

                  {/* Send */}
                  <button onClick={handleSend} disabled={!hasContent || isLoading}
                    style={{
                      width: L.sendButton.size, height: L.sendButton.size, borderRadius: '50%', border: 'none',
                      cursor: hasContent && !isLoading ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: hasContent && !isLoading ? C.sendActiveBg : C.sendInactiveBg,
                      color: hasContent && !isLoading ? C.sendActiveColor : C.sendInactiveColor,
                      transition: 'none',
                    }}
                    aria-label="Send">
                    <svg width={L.sendButton.iconSize} height={L.sendButton.iconSize} viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94l18.04-8.01a.75.75 0 000-1.36L3.478 2.405z" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="assistant-disclaimer" style={{
          textAlign: 'center', fontSize: L.disclaimer.fontSize,
          color: C.disclaimer, marginTop: L.disclaimer.marginTop,
          transition: 'none',
        }}>
          {disclaimer}
        </p>
      </div>
    </div>
  )
})

AssistantInputBar.displayName = 'AssistantInputBar'
export default AssistantInputBar
