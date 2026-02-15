'use client'

import { useState, useEffect } from 'react'

interface FloatingChatButtonProps {
  chatUrl?: string
  show?: boolean
}

export default function FloatingChatButton({ 
  chatUrl = '/chat',
  show = true,
}: FloatingChatButtonProps) {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [breathing, setBreathing] = useState(false)

  useEffect(() => {
    setMounted(true)

    const styleId = 'float-wobble-keyframes'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        @keyframes floatWobble {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          20% { transform: translate(2.4px, -4.8px) rotate(0.6deg); }
          40% { transform: translate(-1.2px, -2.4px) rotate(-0.36deg); }
          60% { transform: translate(1.8px, -6px) rotate(0.48deg); }
          80% { transform: translate(-0.6px, -1.2px) rotate(-0.24deg); }
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
    // Start breathing after fade-in completes (0.3s delay + 2s fade)
    const breathTimer = setTimeout(() => setBreathing(true), 2500)
    return () => { clearTimeout(timer); clearTimeout(breathTimer) }
  }, [show])

  if (!show || !mounted) return null

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const outerSize = isMobile ? 108 : 144
  const middleSize = isMobile ? 29 : 40
  const coreSize = isMobile ? 14 : 18
  const innerSize = isMobile ? 7 : 9

  const outerBg = isMobile 
    ? 'radial-gradient(circle, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 70%)'
    : 'radial-gradient(circle, rgba(255,255,255,0.36) 15%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0) 60%)'

  const middleBg = isMobile
    ? 'radial-gradient(circle, rgba(255,255,255,0.42) 15%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0) 75%)'
    : 'radial-gradient(circle, rgba(255,255,255,0.72) 15%, rgba(255,255,255,0.21) 45%, rgba(255,255,255,0) 75%)'

  return (
    <a
      href={chatUrl}
      style={{
        position: 'fixed',
        bottom: isMobile ? 'calc(15% + 190px)' : 'calc(18% + 270px)',
        right: isMobile ? 'calc(8% + 30px)' : 'calc(10% + 520px)',
        zIndex: 999,
        width: `${outerSize}px`,
        height: `${outerSize}px`,
        borderRadius: '50%',
        background: outerBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        border: 'none',
        boxShadow: 'none',
        opacity: visible ? 1 : 0,
        transition: breathing ? 'none' : 'opacity 2s ease-in',
        animation: visible 
          ? breathing 
            ? 'floatWobble 6s ease-in-out infinite, breathe 3s ease-in-out infinite'
            : 'floatWobble 6s ease-in-out infinite'
          : 'none',
        cursor: 'pointer',
      }}
      aria-label="Open Second Brain Chat"
    >
      {/* Middle feathered circle */}
      <div
        style={{
          width: `${middleSize}px`,
          height: `${middleSize}px`,
          borderRadius: '50%',
          background: middleBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Core circle - 80% opacity */}
        <div
          style={{
            width: `${coreSize}px`,
            height: `${coreSize}px`,
            borderRadius: '50%',
            backgroundColor: isMobile ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.64)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Innermost solid white circle */}
          <div
            style={{
              width: `${innerSize}px`,
              height: `${innerSize}px`,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </a>
  )
}
