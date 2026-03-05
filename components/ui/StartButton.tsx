'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface StartButtonProps {
  href?: string
  show?: boolean
  onClick?: () => void
  variant?: 'light' | 'dark'
}

export default function StartButton({ 
  href = '/start',
  show = true,
  onClick,
  variant = 'light',
}: StartButtonProps) {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [breathing, setBreathing] = useState(false)
  const [glowing, setGlowing] = useState(false)

  // Colors based on variant
  const strokeColor = variant === 'light' ? '#ffffff' : '#1a1a1a'
  const circleColor = variant === 'light' ? '#ffffff' : '#1a1a1a'
  const rgbaBase = variant === 'light' ? '255,255,255' : '0,0,0'

  useEffect(() => {
    setMounted(true)

    const styleId = 'start-btn-keyframes'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        @keyframes startInitialRotate {
          0% { transform: rotate(35deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes startFloatWobble {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(18px, -5px) rotate(2.5deg); }
          50% { transform: translate(6px, -1px) rotate(0.5deg); }
          75% { transform: translate(22px, -7px) rotate(3deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        @keyframes startLightDrift {
          0% { transform: translate(0px, 0px); }
          14% { transform: translate(-8px, 6px); }
          32% { transform: translate(14px, -7px); }
          48% { transform: translate(-5px, 10px); }
          63% { transform: translate(12px, -4px); }
          79% { transform: translate(-10px, -6px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes startBreathe {
          0% { opacity: 0.85; }
          50% { opacity: 0.65; }
          100% { opacity: 0.85; }
        }
        @keyframes letterBreathe {
          0% { opacity: 0.45; }
          17% { opacity: 0.95; }
          83% { opacity: 0.95; }
          100% { opacity: 0.45; }
        }
        @keyframes letterGlow {
          0% { opacity: 0; }
          0.3% { opacity: 0.61; }
          0.8% { opacity: 0; }
          5% { opacity: 0.54; }
          5.8% { opacity: 0; }
          12% { opacity: 0.58; }
          55% { opacity: 0.40; }
          100% { opacity: 0.40; }
        }
        @keyframes circleBreathe {
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

  // Light group
  const lightOuterSize = isMobile ? 113 : 82
  const lightMiddleSize = isMobile ? 30 : 23

  // Lens
  const lensSize = isMobile ? 142 : 179

  // Inner circle — concentric to START, 15% bigger than lens
  const innerCircleSize = isMobile ? 187 : 237

  // Light group backgrounds — +10%
  const outerBg = isMobile 
    ? `radial-gradient(circle, rgba(${rgbaBase},0.050) 25%, rgba(${rgbaBase},0.014) 50%, rgba(${rgbaBase},0) 70%)`
    : `radial-gradient(circle, rgba(${rgbaBase},0.099) 15%, rgba(${rgbaBase},0.022) 40%, rgba(${rgbaBase},0) 60%)`

  const middleBg = isMobile
    ? `radial-gradient(circle, rgba(${rgbaBase},0.116) 15%, rgba(${rgbaBase},0.033) 45%, rgba(${rgbaBase},0) 75%)`
    : `radial-gradient(circle, rgba(${rgbaBase},0.199) 15%, rgba(${rgbaBase},0.058) 45%, rgba(${rgbaBase},0) 75%)`

  // SVG text size
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
        ? 'startFloatWobble 12s ease-in-out infinite, startBreathe 3s ease-in-out infinite'
        : 'startFloatWobble 12s ease-in-out infinite'
      : 'none',
    cursor: 'pointer',
  }

  const innerContent = (
    <>
      {/* Rotation wrapper — starts vertical, settles to horizontal */}
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
          animation: 'startInitialRotate 6.5s ease-out forwards',
        }}
      >
      {/* Inner circle — concentric to START, fixed semi-transparent */}
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
          animation: breathing ? 'circleBreathe 12s ease-in-out infinite' : 'none',
          pointerEvents: 'none',
        }}
      />

      {/* START GLOW — blurred copy, appears at peak */}
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
          animation: glowing && variant === 'light' ? 'letterGlow 12s linear forwards' : 'none',
          opacity: 0,
        }}
      >
        <path d="M 7,2.5 C 6,1 4,1 2.5,1.8 C 1,2.6 1,4 2.5,4.8 C 4,5.6 6,5.8 6.5,7 C 7,8.2 6,9.5 4.5,9.8 C 3,10.1 1.5,9.5 1,8.5" />
        <line x1="10" y1="1" x2="16" y2="1" />
        <line x1="13" y1="1" x2="13" y2="10" />
        <line x1="19" y1="10" x2="22.5" y2="1" />
        <line x1="22.5" y1="1" x2="26" y2="10" />
        <line x1="20.2" y1="8" x2="24.8" y2="8" />
        <line x1="29" y1="1" x2="29" y2="10" />
        <path d="M 29,1 L 32,1 C 34,1 34.5,2 34.5,3.2 C 34.5,4.4 34,5.2 32,5.2 L 29,5.2" />
        <line x1="32" y1="5.2" x2="35" y2="10" />
        <line x1="38" y1="1" x2="44" y2="1" />
        <line x1="41" y1="1" x2="41" y2="10" />
      </svg>

      {/* START — sharp original */}
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox="0 0 45 11"
        fill="none"
        stroke={strokeColor}
        strokeWidth={variant === 'dark' ? "0.35" : "0.223"}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 3,
          animation: breathing && variant === 'light' ? 'letterBreathe 12s ease-in-out infinite' : 'none',
          opacity: variant === 'dark' ? 1 : (breathing ? undefined : 0.45),
        }}
      >
        {/* S */}
        <path d="M 7,2.5 C 6,1 4,1 2.5,1.8 C 1,2.6 1,4 2.5,4.8 C 4,5.6 6,5.8 6.5,7 C 7,8.2 6,9.5 4.5,9.8 C 3,10.1 1.5,9.5 1,8.5" />

        {/* T */}
        <line x1="10" y1="1" x2="16" y2="1" />
        <line x1="13" y1="1" x2="13" y2="10" />

        {/* A — crossbar low */}
        <line x1="19" y1="10" x2="22.5" y2="1" />
        <line x1="22.5" y1="1" x2="26" y2="10" />
        <line x1="20.2" y1="8" x2="24.8" y2="8" />

        {/* R — tight bowl */}
        <line x1="29" y1="1" x2="29" y2="10" />
        <path d="M 29,1 L 32,1 C 34,1 34.5,2 34.5,3.2 C 34.5,4.4 34,5.2 32,5.2 L 29,5.2" />
        <line x1="32" y1="5.2" x2="35" y2="10" />

        {/* T */}
        <line x1="38" y1="1" x2="44" y2="1" />
        <line x1="41" y1="1" x2="41" y2="10" />
      </svg>

      {/* === LIGHT GROUP — opacity 0, preserved === */}
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
          animation: visible ? 'startLightDrift 11s ease-in-out infinite' : 'none',
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

  // onClick = custom action (e.g. FloatingChatButton), use <a>
  // no onClick = navigation, use Next.js <Link> (no reload, no flash)
  if (onClick) {
    return (
      <a
        href={undefined}
        onClick={(e) => { e.preventDefault(); onClick(); }}
        style={wrapperStyle}
        aria-label="Start"
      >
        {innerContent}
      </a>
    )
  }

  return (
    <Link
      href={href}
      style={wrapperStyle}
      aria-label="Start"
    >
      {innerContent}
    </Link>
  )
}
