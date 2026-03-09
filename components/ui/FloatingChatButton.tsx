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
      {/*
        GO — hand-drawn, same style as BUILD/CHAT
        viewBox "0 0 20 11" — proporzioni identiche alle altre lettere
        G occupa 0-9, O occupa 11-20
      */}
      <svg
        width="20"
        height="11"
        viewBox="0 0 20 11"
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: 'block' }}
      >
        {/* G — come la C di CHAT ma con barra centrale */}
        <path d="M 8.5,3 C 7.5,1.2 5.5,0.8 3.5,1.5 C 1.5,2.5 0.5,4 0.5,5.5 C 0.5,7 1.5,8.5 3.5,9.5 C 5.5,10.5 7.5,10 8.5,8.5 L 8.5,6 L 5.5,6" />
        {/* O — ovale chiuso */}
        <path d="M 10.5,5.5 C 10.5,2.8 12,1 14.5,1 C 17,1 19,2.8 19,5.5 C 19,8.2 17,10 14.5,10 C 12,10 10.5,8.2 10.5,5.5 Z" />
      </svg>
    </a>
  )
}
