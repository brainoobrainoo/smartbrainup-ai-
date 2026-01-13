'use client'

import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'

export default function AIUPLogo() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/animations/AI-UP_logo01.json'
    })
    
    return () => animation.destroy()
  }, [])
  
  // 153x46 - 10% = 138x41
  return <div ref={containerRef} className="w-[138px] h-[41px]" />
}
