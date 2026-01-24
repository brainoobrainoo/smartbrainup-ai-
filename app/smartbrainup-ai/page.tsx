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

  // Typewriter effect
  const fullText = hero.headline.join('\n')
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const currentChar = fullText[currentIndex]
      
      // Delay variabile per effetto umano
      let delay = 45 + Math.random() * 35 // base: 45-80ms per lettera
      
      if (currentChar === ' ') {
        delay = 70 + Math.random() * 50 // spazi: 70-120ms
      } else if (currentChar === '\n') {
        delay = 700 + Math.random() * 400 // nuova riga: 700-1100ms
      }
      
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + currentChar)
        setCurrentIndex(prev => prev + 1)
      }, delay)
      
      return () => clearTimeout(timer)
    }
  }, [currentIndex, fullText])

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

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      {/* Gradient zone: Hero + CTA */}
      <div style={{ background: 'linear-gradient(to bottom, #252525 0%, #252525 80px, #5a5a5a 100%)' }} className="text-white min-h-[100dvh] flex flex-col">
        
        {/* Hero Section - occupa tutto lo spazio disponibile */}
        <section className="flex-1 flex flex-col justify-center pt-16 pb-[250px] md:pb-[350px]">
          <Container>
            <div className="flex flex-col items-center text-center">
              
              {/* Sfera logo */}
              <div className="mb-9">
                <Lottie 
                  animationData={sphereAnimation}
                  loop={true}
                  className="w-[65px] h-[65px] md:w-[95px] md:h-[95px]"
                />
              </div>
              
              {/* Headline con typewriter - altezza fissa per 3 righe */}
              <div className="h-[60px] md:h-[66px]">
                <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] opacity-70">
                  {displayedText.split('\n').map((line, index) => (
                    <span key={index} className="block">
                      {line}
                      {index === displayedText.split('\n').length - 1 && currentIndex < fullText.length && (
                        <span className="animate-pulse">|</span>
                      )}
                    </span>
                  ))}
                </p>
              </div>
              
            </div>
          </Container>
        </section>
        
        {/* CTA Section - in basso */}
        <section className="pb-12 md:pb-16">
          <Container>
            <div className="flex items-center gap-4 justify-end">
              <span className="font-ui text-[12px] font-medium tracking-wide uppercase-force opacity-40">{hero.cta.label}</span>
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

      {/* CTA - gradient to footer */}
      <section className="w-full text-white py-24 md:py-32" style={{ background: 'linear-gradient(to bottom, #2f2f2f 0%, #1a1a1a 100%)' }}>
        <Container>
          <div className="flex items-center gap-4 justify-end">
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
