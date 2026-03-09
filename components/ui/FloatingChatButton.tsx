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
        @keyframes lightDrift {
          0% { transform: translate(0px, 0px); }
          14% { transform: translate(-7px, 5px); }
          32% { transform: translate(12px, -6px); }
          48% { transform: translate(-4px, 8px); }
          63% { transform: translate(10px, -3px); }
          79% { transform: translate(-8px, -5px); }
          100% { transform: translate(0px, 0px); }
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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const colorAlpha = variant === 'light' ? '255,255,255' : '0,0,0'
  const solidColor = variant === 'light' ? '#ffffff' : '#1a1a1a'

  const outerSize = isMobile ? 103 : 115
  const middleSize = isMobile ? 28 : 32
  const coreSize = isMobile ? 13 : 14
  const innerSize = isMobile ? 7 : 7

  // Light group — shrunk 20%
  const lightOuterSize = isMobile ? 82 : 59
  const lightMiddleSize = isMobile ? 22 : 17
  const lightCoreSize = isMobile ? 8 : 8
  const lightInnerSize = isMobile ? 4 : 4

  // Lens sizes
  const lensSize = isMobile ? 40 : 50

  const outerBg = isMobile 
    ? `radial-gradient(circle, rgba(${colorAlpha},0.18) 25%, rgba(${colorAlpha},0.05) 50%, rgba(${colorAlpha},0) 70%)`
    : `radial-gradient(circle, rgba(${colorAlpha},0.36) 15%, rgba(${colorAlpha},0.08) 40%, rgba(${colorAlpha},0) 60%)`

  const middleBg = isMobile
    ? `radial-gradient(circle, rgba(${colorAlpha},0.42) 15%, rgba(${colorAlpha},0.12) 45%, rgba(${colorAlpha},0) 75%)`
    : `radial-gradient(circle, rgba(${colorAlpha},0.72) 15%, rgba(${colorAlpha},0.21) 45%, rgba(${colorAlpha},0) 75%)`

  return (
    <a
      href={onClick ? undefined : chatUrl}
      onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined}
      style={{
        position: 'relative',
        width: `${outerSize}px`,
        height: `${outerSize}px`,
        borderRadius: '50%',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        border: 'none',
        boxShadow: 'none',
        overflow: 'visible',
        opacity: visible ? 1 : 0,
        transition: breathing ? 'none' : 'opacity 2s ease-in',
        animation: visible 
          ? breathing 
            ? 'floatWobble 12s ease-in-out infinite, breathe 3s ease-in-out infinite'
            : 'floatWobble 12s ease-in-out infinite'
          : 'none',
        cursor: 'pointer',
      }}
      aria-label="Open Second Brain Chat"
    >
      {/* Lens */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${lensSize}px`,
          height: `${lensSize}px`,
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: `0.5px solid ${solidColor}`,
          transform: 'translate(-50%, -50%)',
          opacity: isMobile ? 0.56 : 0.64,
          pointerEvents: 'none',
        }}
      />


      {/* === LIGHT GROUP — more displaced drift === */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${lightOuterSize}px`,
          height: `${lightOuterSize}px`,
          borderRadius: '50%',
          background: outerBg,
          animation: visible ? 'lightDrift 11s ease-in-out infinite' : 'none',
          pointerEvents: 'none',
        }}
      >
        {/* Tiny concentric circle — 3px, solid white */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            backgroundColor: solidColor,
            zIndex: 2,
          }}
        />
        {/* Middle feathered circle */}
        <div
          style={{
            width: `${lightMiddleSize}px`,
            height: `${lightMiddleSize}px`,
            borderRadius: '50%',
            background: middleBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Core circle */}
          <div
            style={{
              width: `${lightCoreSize}px`,
              height: `${lightCoreSize}px`,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.20)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            {/* Innermost solid white circle */}
            <div
              style={{
                width: `${lightInnerSize}px`,
                height: `${lightInnerSize}px`,
                borderRadius: '50%',
                backgroundColor: solidColor,
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </a>
  )
}
