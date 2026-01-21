'use client'

// app/smartbrainup-ai/enterprise/page.tsx

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { enterpriseContent } from '@/content/smartbrainup-ai/enterprise'

export default function EnterprisePage() {
  const { hero, capabilities, deployment, process, cta } = enterpriseContent

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

  // Helper to render body with proper spacing (verse style)
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
        
        <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8 pt-20 md:pt-32 pb-24 md:pb-40">
          
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

        </section>

      </div>

      {/* Capabilities */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32">
        <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-12">{capabilities.section}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.items.map((item, index) => (
            <div key={index} className="rounded-[4px] p-8 flex flex-col min-h-[280px]" style={{ background: 'linear-gradient(to bottom, #f7f7f7 0%, #ececec 100%)' }}>
              <h3 className="text-[17px] md:text-[18px] font-normal leading-[1.3] mb-4">{item.label}</h3>
              <div className="flex-1">
                {renderCardBody(item.body)}
              </div>
              <a 
                href={item.link.href}
                className="mt-6 text-[15px] md:text-[16px] font-normal animate-pulse-link hover:opacity-100 transition-opacity"
              >
                {item.link.text}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32">
        <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{deployment.section}</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
              {deployment.title}
            </h2>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-5">
              {deployment.items.map((item, index) => (
                <p key={index} className="text-[17px] md:text-[18px] font-normal leading-[1.15] opacity-60">
                  {item}
                </p>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* How it works */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32">
        <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{process.section}</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
              {process.title}
            </h2>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            {renderBody(process.body)}
          </div>
          
        </div>
      </section>

      {/* CTA - gradient to footer */}
      <section className="w-full text-white py-12 md:py-24" style={{ background: 'linear-gradient(to bottom, #2f2f2f 0%, #1a1a1a 100%)' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            
            <div>
              <h2 className="text-[36px] md:text-[52px] font-normal leading-[1.0] tracking-[-0.02em] mb-6">
                {cta.title}
              </h2>
              <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] opacity-60 max-w-[400px]">
                {cta.description}
              </p>
            </div>
            
            <div className="flex items-center gap-4 justify-end">
              <span className="font-ui text-[12px] font-medium tracking-wide uppercase-force opacity-40">{cta.label}</span>
              <Link href="/contact" className="relative font-ui text-[12px] font-medium tracking-wide uppercase px-6 py-4 rounded-[4px] overflow-hidden">
                <span className="absolute inset-0 bg-[#3a3a3a] animate-pulse-soft rounded-[4px]"></span>
                <span className="relative z-10 text-white uppercase-force">{cta.button}</span>
              </Link>
            </div>
            
          </div>
          
        </div>
      </section>

    </div>
  )
}
