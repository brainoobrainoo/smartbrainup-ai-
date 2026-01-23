'use client'

import { ReactNode, useState, useEffect, Children } from 'react'

interface ZoomCreditsProps {
  children: ReactNode[]
  blockDuration?: number
  className?: string
}

export default function ZoomCredits({ 
  children, 
  blockDuration = 5,
  className = '' 
}: ZoomCreditsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  const blocks = Children.toArray(children)
  const totalBlocks = blocks.length

  // Wait for mount before showing anything
  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setMounted(true)
    }, 100)
    return () => clearTimeout(mountTimer)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalBlocks)
      setAnimationKey((prev) => prev + 1)
    }, blockDuration * 1000)

    return () => clearInterval(interval)
  }, [totalBlocks, blockDuration, mounted])

  if (!mounted) return <div className={`absolute inset-0 w-full h-full bg-white overflow-hidden z-0 ${className}`} />

  return (
    <div className={`absolute inset-0 w-full h-full bg-white overflow-hidden z-0 ${className}`}>
      
      <div 
        key={animationKey}
        className="absolute inset-0 flex items-center justify-center zoom-through"
        style={{ 
          animationDuration: `${blockDuration}s`,
        }}
      >
        <div className="text-center whitespace-nowrap" style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}>
          {blocks[currentIndex]}
        </div>
      </div>

      <style jsx>{`
        @keyframes zoom-through {
          /* FASE 1: Zoom lento con decelerazione */
          0% {
            transform: scale3d(0.08, 0.08, 1);
            opacity: 1;
            animation-timing-function: ease-out;
          }
          /* Fine fase 1 / Inizio fase 2: testo a dimensione di lettura */
          65% {
            transform: scale3d(0.18, 0.18, 1);
            opacity: 1;
            animation-timing-function: cubic-bezier(0.55, 0, 1, 1);
          }
          /* FASE 2: Accelerazione esponenziale + fade simultaneo */
          100% {
            transform: scale3d(3, 3, 1);
            opacity: 0;
          }
        }
        .zoom-through {
          animation-name: zoom-through;
          animation-fill-mode: forwards;
          will-change: transform, opacity;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: geometricPrecision;
        }
      `}</style>
    </div>
  )
}
