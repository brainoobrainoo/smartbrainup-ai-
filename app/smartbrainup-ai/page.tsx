'use client'

// app/smartbrainup-ai/page.tsx

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { homeContent } from '@/content/smartbrainup-ai/home'
import Container from '@/components/layout/Container'
import Lottie from 'lottie-react'
import sphereAnimation from '../../public/animations/SFERA_LOGO_B.json'

export default function HomePage() {
  const { hero, problem, solution, impact, platforms, cta } = homeContent
  const { loopMessages } = hero

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showLine1, setShowLine1] = useState(false)
  const [showLine2, setShowLine2] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    setIsFadingOut(false)
    
    // Fade-in line 1 (3s)
    const timer1 = setTimeout(() => setShowLine1(true), 100)
    
    // Quando line 1 è al 100% (dopo 3s), fade-in line 2 (3s)
    const timer2 = setTimeout(() => setShowLine2(true), 3100)
    
    // Entrambe al 100% a 6.1s, restano 1s, poi fade-out a 7.1s
    const timer3 = setTimeout(() => {
      setIsFadingOut(true)
      setShowLine1(false)
      setShowLine2(false)
    }, 7100)
    
    // Dopo fade-out (4s), subito prossimo messaggio a 11.1s
    const timer4 = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % loopMessages.length)
    }, 11100)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [currentIndex, loopMessages.length])

  // Helper to render body with proper spacing
  const renderBody = (lines: string[], opacity: string = "opacity-60") => {
    const blocks: string[][] = []
    let currentBlock: string[] = []
    
    lines.forEach((line) => {
      if (line === "") {
        if (currentBlock.length > 0) {
          blocks.push(currentBlock)
          currentBlock = []
        }
      } else {
        currentBlock.push(line)
      }
    })
    if (currentBlock.length > 0) {
      blocks.push(currentBlock)
    }

    return (
      <div className="space-y-5">
        {blocks.map((block, blockIndex) => (
          <p key={blockIndex} className={`text-[17px] md:text-[18px] font-normal leading-[1.15] ${opacity}`}>
            {block.map((line, lineIndex) => (
              <span key={lineIndex} className="block">{line}</span>
            ))}
          </p>
        ))}
      </div>
    )
  }

  const transitionDuration = isFadingOut ? '4s' : '3s'

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      {/* Gradient zone: Hero + CTA */}
      <div style={{ background: 'linear-gradient(to bottom, #ebebeb 0%, #ffffff calc(100% - 200px), #ffffff 100%)' }}>
        
        {/* Hero Section */}
        <section className="relative pt-20 md:pt-32 pb-16 md:pb-24">
          <Container>
            <div className="relative">
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-8">
                <span className="opacity-100 uppercase-force">{hero.badge.primary}</span>
                <span className="opacity-50 uppercase-force"> {hero.badge.secondary}</span>
              </p>
              
              {/* Sfera logo - centro allineato alla linea sinistra */}
              <div className="mb-8 ml-[-27.5px] md:ml-[-37.5px]">
                <Lottie 
                  animationData={sphereAnimation}
                  loop={true}
                  className="w-[55px] h-[55px] md:w-[75px] md:h-[75px]"
                />
              </div>
              
              {/* Loop messaggi animato */}
              <p className="text-[17px] md:text-[18px] font-bold leading-[1.15] max-w-[480px] mb-8">
                <span 
                  className="block"
                  style={{ 
                    opacity: showLine1 ? 0.7 : 0,
                    transition: `opacity ${transitionDuration} cubic-bezier(0.4, 0, 0.2, 1)`
                  }}
                >
                  {loopMessages[currentIndex].line1}
                </span>
                <span 
                  className="block"
                  style={{ 
                    opacity: showLine2 ? 0.7 : 0,
                    transition: `opacity ${transitionDuration} cubic-bezier(0.4, 0, 0.2, 1)`
                  }}
                >
                  {loopMessages[currentIndex].line2}
                </span>
              </p>
              
              {/* Headline statico */}
              <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] max-w-[480px] opacity-70 mb-8">
                {hero.headline.map((line, index) => (
                  <span key={index} className="block">{line}</span>
                ))}
              </p>
              
              {/* Subtext statico */}
              <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] max-w-[480px] opacity-70">
                {hero.subtext.map((line, index) => (
                  <span key={index} className="block">{line}</span>
                ))}
              </p>
            </div>
          </Container>
        </section>
        
        {/* CTA Section - centrato nello spazio tra hero e problem */}
        <section className="relative py-16 md:py-24">
          <Container>
            <div className="flex items-center gap-4 justify-end mr-[-27.5px] md:mr-[-37.5px]">
              <span className="font-ui text-[12px] font-medium tracking-wide uppercase-force opacity-40">{hero.cta.label}</span>
              <Link 
                href="/contact" 
                className="relative flex items-center justify-center w-[55px] h-[55px] md:w-[75px] md:h-[75px] rounded-full bg-[#f5f5f5]"
              >
                <span className="font-ui text-[11px] md:text-[12px] font-bold tracking-wide text-[#1a1a1a] uppercase-force">TRY</span>
              </Link>
            </div>
          </Container>
        </section>

      </div>
      {/* End gradient zone */}

      {/* Problem */}
      <section className="relative py-16 md:py-32 bg-white">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{problem.section}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {Array.isArray(problem.title) ? (
                  problem.title.map((line, index) => (
                    <span key={index} className="block">{line}</span>
                  ))
                ) : (
                  problem.title
                )}
              </h2>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              {renderBody(problem.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* Solution - white background */}
      <section className="relative py-16 md:py-32 bg-white">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{solution.section}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {Array.isArray(solution.title) ? (
                  solution.title.map((line, index) => (
                    <span key={index} className="block">{line}</span>
                  ))
                ) : (
                  solution.title
                )}
              </h2>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              {renderBody(solution.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* Impact - card style */}
      <section className="relative py-16 md:py-32">
        <Container>
          <div className="bg-[#f7f7f7] rounded-[4px] p-6 pt-14 md:p-16 relative">
            
            <span className="absolute top-6 right-6 font-ui text-[10px] tracking-widest uppercase opacity-30">{impact.section}</span>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              
              <div>
                <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">{impact.title}</h2>
              </div>
              
              <div>
                <div className="space-y-3">
                  {impact.items.map((item, index) => (
                    <p key={index} className="text-[16px] md:text-[18px] font-normal leading-[1.4] opacity-70">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        </Container>
      </section>

      {/* DARK ZONE: Platforms */}
      <div className="w-full text-white" style={{ background: 'linear-gradient(to bottom, #484848 0%, #2f2f2f 100%)' }}>
        <section className="py-16 md:py-32">
          <Container>
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{platforms.section}</p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5">
                <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                  {Array.isArray(platforms.title) ? (
                    platforms.title.map((line, index) => (
                      <span key={index} className="block">{line}</span>
                    ))
                  ) : (
                    platforms.title
                  )}
                </h2>
              </div>
              
              <div className="lg:col-span-6 lg:col-start-7">
                <div className="space-y-5">
                  {/* First paragraph block */}
                  <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] opacity-70">
                    {platforms.body.map((line, index) => (
                      <span key={index} className="block">{line}</span>
                    ))}
                  </p>
                  {/* Platform list - separate block */}
                  <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] opacity-70">
                    {platforms.list}
                  </p>
                </div>
              </div>
              
            </div>
          </Container>
        </section>
      </div>

      {/* CTA - gradient to footer - cerchio scuro con animazione, centrato nello spazio */}
      <section className="w-full text-white py-24 md:py-32" style={{ background: 'linear-gradient(to bottom, #2f2f2f 0%, #1a1a1a 100%)' }}>
        <Container>
          <div className="flex items-center gap-4 justify-end mr-[-27.5px] md:mr-[-37.5px]">
            <span className="font-ui text-[12px] font-medium tracking-wide uppercase-force opacity-40">{cta.label}</span>
            <Link 
              href="/contact" 
              className="relative flex items-center justify-center w-[55px] h-[55px] md:w-[75px] md:h-[75px] rounded-full overflow-hidden"
            >
              <span className="absolute inset-0 bg-[#3a3a3a] animate-pulse-soft rounded-full"></span>
              <span className="relative z-10 font-ui text-[11px] md:text-[12px] font-bold tracking-wide text-white uppercase-force">TRY</span>
            </Link>
          </div>
        </Container>
      </section>

    </div>
  )
}
