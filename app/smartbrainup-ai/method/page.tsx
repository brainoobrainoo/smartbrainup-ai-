'use client'

// app/smartbrainup-ai/method/page.tsx

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { methodContent } from '@/content/smartbrainup-ai/method'
import Container from '@/components/layout/Container'

export default function MethodPage() {
  const { hero, core, interaction, determinism, process, execution, platforms, delivery, outcomes, cta } = methodContent

  const [showFirst, setShowFirst] = useState(false)
  const [showSecond, setShowSecond] = useState(false)
  const [showCore, setShowCore] = useState(false)

  useEffect(() => {
    const timerFirst = setTimeout(() => setShowFirst(true), 10)
    const timerSecond = setTimeout(() => setShowSecond(true), 500)
    const timerCore = setTimeout(() => setShowCore(true), 1000)

    return () => {
      clearTimeout(timerFirst)
      clearTimeout(timerSecond)
      clearTimeout(timerCore)
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

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero + Core Principle - DARK zone */}
      <div className="relative w-full overflow-hidden text-white" style={{ background: 'linear-gradient(to bottom, #252525 0%, #161616 100%)' }}>
        
        {/* Hero */}
        <section className="relative z-10 pt-20 md:pt-32 pb-24">
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
              
              <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] max-w-[560px] opacity-70">
                {hero.subtext.map((line, index) => (
                  <span key={index} className="block">{line}</span>
                ))}
              </p>
            </div>
          </Container>
        </section>

        {/* Core Principle */}
        <section className="relative pb-24 md:pb-32">
          <Container>
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{core.section}</p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5">
                <h2 
                  className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]"
                  style={{ 
                    opacity: showCore ? 1 : 0.03,
                    transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {core.title}
                </h2>
              </div>
              
              <div className="lg:col-span-6 lg:col-start-7">
                {renderBody(core.body, "opacity-60")}
              </div>
              
            </div>
          </Container>
        </section>

      </div>

      {/* Interaction Model */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{interaction.section}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {interaction.title}
              </h2>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              {renderBody(interaction.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* Determinism */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{determinism.section}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {Array.isArray(determinism.title) ? (
                  determinism.title.map((line, index) => (
                    <span key={index} className="block">{line}</span>
                  ))
                ) : (
                  determinism.title
                )}
              </h2>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              {renderBody(determinism.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* DARK ZONE: Process */}
      <div className="w-full text-white" style={{ background: 'linear-gradient(to bottom, #484848 0%, #2a2a2a 100%)' }}>
        
        <section className="py-16 md:py-32">
          <Container>
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{process.section}</p>
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-12">{process.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.steps.map((step, index) => (
                <div key={index} className="rounded-[4px] p-8" style={{ background: 'linear-gradient(to bottom, #383838 0%, #3a3a3a 100%)' }}>
                  <h3 className="text-[17px] md:text-[18px] font-normal leading-[1.3] mb-3">{step.label}</h3>
                  <p className="text-[15px] md:text-[16px] font-normal leading-[1.15] opacity-60">
                    {step.body.map((line, lineIndex) => (
                      <span key={lineIndex} className="block">{line}</span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

      </div>

      {/* Execution */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{execution.section}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {execution.title}
              </h2>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              {renderBody(execution.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* Platforms - card style */}
      <section className="relative py-16 md:py-32">
        <Container>
          <div className="bg-[#f7f7f7] rounded-[4px] p-6 pt-14 md:p-16 relative">
            
            <span className="absolute top-6 right-6 font-ui text-[10px] tracking-widest uppercase opacity-30">{platforms.section}</span>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              
              <div>
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
              
              <div>
                <div className="space-y-5">
                  {renderBody(platforms.body, "opacity-70")}
                  <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] opacity-70">
                    {platforms.list}
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </Container>
      </section>

      {/* Delivery */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{delivery.section}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {delivery.title}
              </h2>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="space-y-8">
                {delivery.items.map((item, index) => (
                  <div key={index}>
                    <h3 className="text-[17px] md:text-[18px] font-normal leading-[1.3] mb-3">{item.label}</h3>
                    <p className="text-[15px] md:text-[16px] font-normal leading-[1.15] opacity-60">
                      {item.body.map((line, lineIndex) => (
                        <span key={lineIndex} className="block">{line}</span>
                      ))}
                    </p>
                  </div>
                ))}
                <p className="text-[15px] md:text-[16px] font-normal leading-[1.15] opacity-40 pt-4">
                  {delivery.note.map((line, index) => (
                    <span key={index} className="block">{line}</span>
                  ))}
                </p>
              </div>
            </div>
            
          </div>
        </Container>
      </section>

      {/* Outcomes */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{outcomes.section}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {outcomes.title}
              </h2>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="space-y-3">
                {outcomes.items.map((item, index) => (
                  <p key={index} className="text-[16px] md:text-[18px] font-normal leading-[1.4] opacity-70">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            
          </div>
        </Container>
      </section>

      {/* CTA - gradient to footer */}
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
