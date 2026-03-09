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
  const borderColor = variant === 'light' ? '#ffffff' : '#1a1a1a'

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

  const outerBg = variant === 'light'
    ? (isMobile 
      ? 'radial-gradient(circle, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 70%)'
      : 'radial-gradient(circle, rgba(255,255,255,0.36) 15%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0) 60%)')
    : (isMobile
      ? 'radial-gradient(circle, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.01) 50%, rgba(0,0,0,0) 70%)'
      : 'radial-gradient(circle, rgba(0,0,0,0.09) 15%, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0) 60%)')

  const middleBg = variant === 'light'
    ? (isMobile
      ? 'radial-gradient(circle, rgba(255,255,255,0.42) 15%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0) 75%)'
      : 'radial-gradient(circle, rgba(255,255,255,0.72) 15%, rgba(255,255,255,0.21) 45%, rgba(255,255,255,0) 75%)')
    : (isMobile
      ? 'radial-gradient(circle, rgba(0,0,0,0.12) 15%, rgba(0,0,0,0.03) 45%, rgba(0,0,0,0) 75%)'
      : 'radial-gradient(circle, rgba(0,0,0,0.20) 15%, rgba(0,0,0,0.06) 45%, rgba(0,0,0,0) 75%)')

  return (
    <a
      href={onClick ? undefined : chatUrl}
      onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined}
      style={{
        position: 'relative',
        zIndex: 1,
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
          border: `0.5px solid ${borderColor}`,
          transform: 'translate(-50%, -50%)',
          opacity: isMobile ? 0.56 : 0.64,
          pointerEvents: 'none',
        }}
      />

      {/* GO — clean SVG, centered, same stroke style as START */}
      <svg
        width={isMobile ? 20 : 24}
        height={isMobile ? 9 : 11}
        viewBox="0 0 22 11"
        fill="none"
        stroke={strokeColor}
        strokeWidth={variant === 'dark' ? '0.55' : '0.38'}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 4,
          opacity: variant === 'dark' ? 0.75 : 0.72,
        }}
      >
        {/* G */}
        <path d="M 10,3 C 9,1.5 7.5,1 5.5,1 C 3,1 1,2.5 1,5.5 C 1,8.5 3,10 5.5,10 C 8,10 10,8.5 10,6.5 L 10,5.5 L 6,5.5" />
        {/* O */}
        <path d="M 21,5.5 C 21,2.8 18.8,1 16,1 C 13.2,1 11,2.8 11,5.5 C 11,8.2 13.2,10 16,10 C 18.8,10 21,8.2 21,5.5 Z" />
      </svg>


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
        {/* Tiny concentric circle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            backgroundColor: strokeColor,
            transform: 'translate(-50%, -50%)',
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
            {/* Innermost solid circle */}
            <div
              style={{
                width: `${lightInnerSize}px`,
                height: `${lightInnerSize}px`,
                borderRadius: '50%',
                backgroundColor: strokeColor,
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </a>
  )
}
