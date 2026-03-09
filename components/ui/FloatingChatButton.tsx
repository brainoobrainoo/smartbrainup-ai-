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
  const [glowing, setGlowing] = useState(false)

  const strokeColor = variant === 'light' ? '#ffffff' : '#1a1a1a'
  const circleColor = variant === 'light' ? '#ffffff' : '#1a1a1a'
  const rgbaBase = variant === 'light' ? '255,255,255' : '0,0,0'

  useEffect(() => {
    setMounted(true)

    const styleId = 'go-btn-keyframes'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        @keyframes goInitialRotate {
          0% { transform: rotate(35deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes goFloatWobble {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(18px, -5px) rotate(2.5deg); }
          50% { transform: translate(6px, -1px) rotate(0.5deg); }
          75% { transform: translate(22px, -7px) rotate(3deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        @keyframes goLightDrift {
          0% { transform: translate(0px, 0px); }
          14% { transform: translate(-8px, 6px); }
          32% { transform: translate(14px, -7px); }
          48% { transform: translate(-5px, 10px); }
          63% { transform: translate(12px, -4px); }
          79% { transform: translate(-10px, -6px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes goBreathe {
          0% { opacity: 0.85; }
          50% { opacity: 0.65; }
          100% { opacity: 0.85; }
        }
        @keyframes goLetterBreathe {
          0% { opacity: 0.45; }
          17% { opacity: 0.95; }
          83% { opacity: 0.95; }
          100% { opacity: 0.45; }
        }
        @keyframes goLetterGlow {
          0% { opacity: 0; }
          0.3% { opacity: 0.61; }
          0.8% { opacity: 0; }
          5% { opacity: 0.54; }
          5.8% { opacity: 0; }
          12% { opacity: 0.58; }
          55% { opacity: 0.40; }
          100% { opacity: 0.40; }
        }
        @keyframes goCircleBreathe {
          0% { opacity: 0.20; }
          17% { opacity: 0.40; }
          83% { opacity: 0.40; }
          100% { opacity: 0.20; }
        }
      `
      document.head.appendChild(style)
    }

    if (!show) return
    const timer = setTimeout(() => setVisible(true), 300)
    const breathTimer = setTimeout(() => setBreathing(true), 2500)
    const glowTimer = setTimeout(() => setGlowing(true), 7833)
    return () => { clearTimeout(timer); clearTimeout(breathTimer); clearTimeout(glowTimer) }
  }, [show])

  if (!show || !mounted) return null

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const outerSize = isMobile ? 103 : 115

  // Light group — same as StartButton
  const lightOuterSize = isMobile ? 113 : 82
  const lightMiddleSize = isMobile ? 30 : 23

  // Lens — same as StartButton
  const lensSize = isMobile ? 142 : 179

  // Inner orbit circle — same as StartButton
  const innerCircleSize = isMobile ? 187 : 237

  const outerBg = isMobile 
    ? `radial-gradient(circle, rgba(${rgbaBase},0.050) 25%, rgba(${rgbaBase},0.014) 50%, rgba(${rgbaBase},0) 70%)`
    : `radial-gradient(circle, rgba(${rgbaBase},0.099) 15%, rgba(${rgbaBase},0.022) 40%, rgba(${rgbaBase},0) 60%)`

  const middleBg = isMobile
    ? `radial-gradient(circle, rgba(${rgbaBase},0.116) 15%, rgba(${rgbaBase},0.033) 45%, rgba(${rgbaBase},0) 75%)`
    : `radial-gradient(circle, rgba(${rgbaBase},0.199) 15%, rgba(${rgbaBase},0.058) 45%, rgba(${rgbaBase},0) 75%)`

  // SVG GO — same size as START svg
  const svgWidth = isMobile ? 83 : 108
  const svgHeight = isMobile ? 24 : 31

  const wrapperStyle: React.CSSProperties = {
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
        ? 'goFloatWobble 12s ease-in-out infinite, goBreathe 3s ease-in-out infinite'
        : 'goFloatWobble 12s ease-in-out infinite'
      : 'none',
    cursor: 'pointer',
  }

  const innerContent = (
    <>
      {/* Rotation wrapper — same as StartButton */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
          animation: 'goInitialRotate 6.5s ease-out forwards',
        }}
      >
        {/* Orbit circle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${innerCircleSize}px`,
            height: `${innerCircleSize}px`,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: `0.5px solid ${circleColor}`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.20,
            animation: breathing ? 'goCircleBreathe 12s ease-in-out infinite' : 'none',
            pointerEvents: 'none',
          }}
        />

        {/* GO GLOW — blurred copy */}
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox="0 0 45 11"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 2,
            filter: 'blur(3px)',
            animation: glowing && variant === 'light' ? 'goLetterGlow 12s linear forwards' : 'none',
            opacity: 0,
          }}
        >
          {/* G */}
          <path d="M 19,4 C 18,2 16,1 12.5,1 C 8.5,1 4,2.5 3,5.5 C 2,8.2 4.5,10 9,10 C 12.5,10 17,9 19,7 L 19,5.5 L 12.5,5.5" />
          {/* O */}
          <path d="M 34,1 C 38.5,1 42,2.8 42,5.5 C 42,8.2 38.5,10 34,10 C 29.5,10 26,8.2 26,5.5 C 26,2.8 29.5,1 34,1 Z" />
        </svg>

        {/* GO — sharp */}
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox="0 0 45 11"
          fill="none"
          stroke={strokeColor}
          strokeWidth={variant === 'dark' ? '0.35' : '0.223'}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 3,
            animation: breathing && variant === 'light' ? 'goLetterBreathe 12s ease-in-out infinite' : 'none',
            opacity: variant === 'dark' ? 1 : (breathing ? undefined : 0.45),
          }}
        >
          {/* G */}
          <path d="M 19,4 C 18,2 16,1 12.5,1 C 8.5,1 4,2.5 3,5.5 C 2,8.2 4.5,10 9,10 C 12.5,10 17,9 19,7 L 19,5.5 L 12.5,5.5" />
          {/* O */}
          <path d="M 34,1 C 38.5,1 42,2.8 42,5.5 C 42,8.2 38.5,10 34,10 C 29.5,10 26,8.2 26,5.5 C 26,2.8 29.5,1 34,1 Z" />
        </svg>

        {/* Light group */}
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
            animation: visible ? 'goLightDrift 11s ease-in-out infinite' : 'none',
            pointerEvents: 'none',
            marginTop: '40px',
            marginLeft: '30px',
          }}
        >
          <div
            style={{
              width: `${lightMiddleSize}px`,
              height: `${lightMiddleSize}px`,
              borderRadius: '50%',
              background: middleBg,
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </>
  )

  return (
    <a
      href={onClick ? undefined : chatUrl}
      onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined}
      style={wrapperStyle}
      aria-label="Open Second Brain Chat"
    >
      {innerContent}
    </a>
  )
}
