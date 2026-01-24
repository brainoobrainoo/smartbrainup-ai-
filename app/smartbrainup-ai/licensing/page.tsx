'use client'

// app/smartbrainup-ai/licensing/page.tsx

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { licensingContent } from '@/content/smartbrainup-ai/licensing'
import Container from '@/components/layout/Container'

export default function LicensingPage() {
  const { hero, pricing, principles, cta } = licensingContent

  const [showFirst, setShowFirst] = useState(false)
  const [showSecond, setShowSecond] = useState(false)

  useEffect(() => {
    const timerFirst = setTimeout(() => setShowFirst(true), 10)
    const timerSecond = setTimeout(() => setShowSecond(true), 500)

    return () => {
      clearTimeout(timerFirst)
      clearTimeout(timerSecond)
    }
  }, [])

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

  // Helper for card body (smaller text)
  const renderCardBody = (lines: string[], opacity: string = "opacity-60") => {
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
      <div className="space-y-4">
        {blocks.map((block, blockIndex) => (
          <p key={blockIndex} className={`text-[15px] md:text-[16px] font-normal leading-[1.15] ${opacity}`}>
            {block.map((line, lineIndex) => (
              <span key={lineIndex} className="block">{line}</span>
            ))}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Animation styles */}
      <style jsx>{`
        @keyframes pulse-link {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulse-link {
          animation: pulse-link 4s ease-in-out infinite;
        }
      `}</style>
      
      {/* Hero - DARK zone */}
      <div className="relative w-full overflow-hidden text-white" style={{ background: 'linear-gradient(to bottom, #252525 0%, #161616 100%)' }}>
        
        <section className="relative z-10 pt-20 md:pt-32 pb-24 md:pb-40">
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
                    opacity: showFirst ? 1 : 0.08,
                    transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {hero.title[0]}
                </span>
                <span 
                  className="block"
                  style={{ 
                    opacity: showSecond ? 1 : 0.03,
                    transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {hero.title[1]}
                </span>
              </h1>
              
              <div className="max-w-[560px]">
                {renderBody(hero.body, "opacity-70")}
              </div>
            </div>
          </Container>
        </section>

      </div>

      {/* Pricing Plans */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-12">{pricing.section}</p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 4 cards in 2x2 grid - left side */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              {pricing.plans.map((plan, index) => (
                <div key={index} className="rounded-[4px] p-8 min-h-[280px]" style={{ background: 'linear-gradient(to bottom, #f7f7f7 0%, #efefef 100%)' }}>
                  <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-2">{plan.name}</p>
                  <p className="text-[14px] font-normal opacity-60 mb-4">{plan.brains}</p>
                  <p className="text-[28px] md:text-[32px] font-normal leading-[1.1] tracking-[-0.01em] mb-6">{plan.price}</p>
                  {renderCardBody(plan.body)}
                </div>
              ))}
            </div>

            {/* Enterprise card - right side, same color as others */}
            <div className="lg:col-span-5 rounded-[4px] p-8 min-h-[280px] flex flex-col justify-center" style={{ background: 'linear-gradient(to bottom, #f7f7f7 0%, #efefef 100%)' }}>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-2">{pricing.enterprise.name}</p>
              <p className="text-[14px] font-normal opacity-60 mb-4">{pricing.enterprise.brains}</p>
              <p className="text-[28px] md:text-[32px] font-normal leading-[1.1] tracking-[-0.01em] mb-6">{pricing.enterprise.price}</p>
              {renderCardBody(pricing.enterprise.body)}
            </div>

          </div>
        </Container>
      </section>

      {/* Licensing Principles */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{principles.section}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {principles.title.map((line, index) => (
                  <span key={index} className="block">{line}</span>
                ))}
              </h2>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              {renderBody(principles.body)}
              
              <a 
                href={principles.link.href}
                className="mt-8 block text-[15px] md:text-[16px] font-normal leading-[1.15] animate-pulse-link hover:opacity-100 transition-opacity"
              >
                <span className="block">{principles.link.text}</span>
                <span className="block">{principles.link.url}</span>
              </a>
            </div>
            
          </div>
        </Container>
      </section>

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
