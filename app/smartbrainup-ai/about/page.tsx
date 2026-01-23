'use client'

// app/smartbrainup-ai/about/page.tsx

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { aboutContent } from '@/content/smartbrainup-ai/about'
import Container from '@/components/layout/Container'

export default function AboutPage() {
  const { hero, story, cta } = aboutContent

  const [showTitle, setShowTitle] = useState(false)

  useEffect(() => {
    const timerTitle = setTimeout(() => setShowTitle(true), 10)

    return () => {
      clearTimeout(timerTitle)
    }
  }, [])

  // Helper to render body with proper spacing (verse style)
  const renderBody = (lines: string[], opacity: string = "opacity-70") => {
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
        {blocks.map((block, blockIndex) => {
          // Check if block contains bold markers
          const isBold = block[0]?.startsWith('**')
          
          return (
            <p key={blockIndex} className={`text-[17px] md:text-[18px] ${isBold ? 'font-bold' : 'font-normal'} leading-[1.15] ${opacity}`}>
              {block.map((line, lineIndex) => (
                <span key={lineIndex} className="block">
                  {line.replace(/\*\*/g, '')}
                </span>
              ))}
            </p>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      
      {/* Tutto scuro - Hero + Card + CTA */}
      <div className="relative w-full overflow-hidden text-white" style={{ background: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 100%)' }}>
        
        {/* Hero */}
        <section className="relative z-10 pt-20 md:pt-32 pb-16 md:pb-24">
          <Container>
            <div className="relative">
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-4">
                <span className="opacity-100 uppercase-force">{hero.badge.primary}</span>
                <span className="opacity-50 uppercase-force"> {hero.badge.secondary}</span>
              </p>
              
              <h1 className="text-[42px] md:text-[64px] font-normal leading-[1.0] tracking-[-0.02em] mb-8">
                <span 
                  className="block"
                  style={{ 
                    opacity: showTitle ? 1 : 0.08,
                    transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {hero.title[0]}
                </span>
              </h1>
              
              <div className="max-w-[560px]">
                {renderBody(hero.body)}
              </div>
            </div>
          </Container>
        </section>

        {/* Story card - grigio scuro, testo bianco, due colonne desktop allineate in alto */}
        <section className="relative z-10 pb-16 md:pb-24">
          <Container>
            <div className="rounded-[4px] p-8 py-10 md:p-12 md:py-16" style={{ background: 'linear-gradient(to bottom, #3a3a3a 0%, #282828 100%)' }}>
              
              {/* Due colonne desktop allineate in alto, una mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                <div>
                  {renderBody(story.col1, "opacity-70")}
                </div>
                <div>
                  {renderBody(story.col2, "opacity-70")}
                </div>
              </div>
              
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="relative z-10 py-24 md:py-32">
          <Container>
            <div className="flex items-center gap-4 justify-end mr-[-27.5px] md:mr-[-37.5px]">
              <span className="font-ui text-[12px] font-medium tracking-wide uppercase-force opacity-40">{cta.label}</span>
              <Link 
                href="/contact" 
                className="relative flex items-center justify-center w-[55px] h-[55px] md:w-[75px] md:h-[75px] rounded-full overflow-hidden"
              >
                <span className="absolute inset-0 bg-[#3a3a3a] animate-pulse-soft rounded-full"></span>
                <span className="relative z-10 font-ui text-[11px] md:text-[12px] font-bold tracking-wide text-white uppercase-force">{cta.button}</span>
              </Link>
            </div>
          </Container>
        </section>

      </div>

    </div>
  )
}
