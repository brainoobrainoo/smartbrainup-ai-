'use client'

import { ReactNode, useState, useEffect } from 'react'

interface ScrollingCreditsProps {
  children: ReactNode
  duration?: number
  className?: string
}

export default function ScrollingCredits({ 
  children, 
  duration = 54,
  className = '' 
}: ScrollingCreditsProps) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    // Force animation restart on mount
    setAnimationKey(Date.now())
  }, [])

  return (
    <div className={`relative bg-white rounded-[4px] overflow-hidden ${className}`}>
      
      {/* Scrolling content */}
      <div 
        key={animationKey}
        className="animate-scroll-credits"
        style={{ animationDuration: duration + 's' }}
      >
        {children}
        <div className="h-[40px]" />
        {children}
        <div className="h-[40px]" />
      </div>

      {/* Top overlay - dense fog, stops before center */}
      <div 
        className="absolute top-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: 'calc(50% - 10px)',
          background: 'linear-gradient(to bottom, white 0%, white 25%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.8) 55%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.2) 85%, transparent 100%)'
        }}
      />
      
      {/* Bottom overlay - dense fog, stops before center */}
      <div 
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: 'calc(50% - 10px)',
          background: 'linear-gradient(to top, white 0%, white 25%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.8) 55%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.2) 85%, transparent 100%)'
        }}
      />

      <style jsx>{`
        @keyframes scroll-credits {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .animate-scroll-credits {
          animation-name: scroll-credits;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  )
}
