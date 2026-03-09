'use client'

import { useState, useEffect } from 'react'

interface FloatingChatButtonProps {
  chatUrl?: string
  show?: boolean
  onClick?: () => void
  variant?: 'light' | 'dark'
}

export default function FloatingChatButton({ 
  chatUrl = '/chat',
  show = true,
  onClick,
  variant = 'light',
}: FloatingChatButtonProps) {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [breathing, setBreathing] = useState(false)

  const strokeColor = variant === 'light' ? '#ffffff' : '#1a1a1a'
  const rgbaBase = variant === 'light' ? '255,255,255' : '0,0,0'

  useEffect(() => {
    setMounted(true)

    const styleId = 'float-wobble-keyframes'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        @keyframes floatWobble {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(18px, -5px) rotate(2.5deg); }
          50% { transform: translate(6px, -1px) rotate(0.5deg); }
          75% { transform: translate(22px, -7px) rotate(3deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        @keyframes breathe {
          0% { opacity: 0.85; }
          50% { opacity: 0.65; }
          100% { opacity: 0.85; }
        }
      `
      document.head.appendChild(style)
    }

    if (!show) return
    const timer = setTimeout(() => setVisible(true), 300)
    const breathTimer = setTimeout(() => setBreathing(true), 2500)
    return () => { clearTimeout(timer); clearTimeout(breathTimer) }
  }, [show])

  if (!show || !mounted) return null

  return (
    <a
      href={onClick ? undefined : chatUrl}
      onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '58px',
        height: '58px',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        border: `0.5px solid rgba(${rgbaBase},0.5)`,
        cursor: 'pointer',
        textDecoration: 'none',
        opacity: visible ? 0.7 : 0,
        transition: breathing ? 'none' : 'opacity 2s ease-in',
        animation: visible
          ? breathing
            ? 'floatWobble 12s ease-in-out infinite, breathe 3s ease-in-out infinite'
            : 'floatWobble 12s ease-in-out infinite'
          : 'none',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
      aria-label="Open Second Brain Chat"
    >
      <svg
        width="28"
        height="11"
        viewBox="0 0 28 11"
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: 'block' }}
      >
        {/* G */}
        <path d="M 12,3 C 11,1.5 9,1 6.5,1 C 3,1 0.5,2.8 0.5,5.5 C 0.5,8.2 3,10 6.5,10 C 9.5,10 12,8.5 12,6.5 L 12,5.5 L 6.5,5.5" />
        {/* O */}
        <path d="M 27.5,5.5 C 27.5,2.8 25.3,1 22,1 C 18.7,1 16.5,2.8 16.5,5.5 C 16.5,8.2 18.7,10 22,10 C 25.3,10 27.5,8.2 27.5,5.5 Z" />
      </svg>
    </a>
  )
}
