'use client'

// app/smartbrainup-ai/licensing/page.tsx

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { licensingContent } from '@/content/smartbrainup-ai/licensing'
import Container from '@/components/layout/Container'

export default function LicensingPage() {
  const { hero, pricing, access, subscription, subscriptionPlans, comparison, principles, cta } = licensingContent

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
      
      {/* Hero - DARK zone — UNTOUCHED */}
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

      {/* ============================================ */}
      {/* 01 — PRICING PLANS (Licensing - one time) */}
      {/* ============================================ */}
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

            {/* Enterprise card - right side */}
            <div className="lg:col-span-5 rounded-[4px] p-8 min-h-[280px] flex flex-col justify-center" style={{ background: 'linear-gradient(to bottom, #f7f7f7 0%, #efefef 100%)' }}>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-2">{pricing.enterprise.name}</p>
              <p className="text-[14px] font-normal opacity-60 mb-4">{pricing.enterprise.brains}</p>
              <p className="text-[28px] md:text-[32px] font-normal leading-[1.1] tracking-[-0.01em] mb-6">{pricing.enterprise.price}</p>
              {renderCardBody(pricing.enterprise.body)}
            </div>

          </div>
        </Container>
      </section>

      {/* ============================================ */}
      {/* 02 — ACCESS & ACTIVATION */}
      {/* ============================================ */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{access.section}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5">
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {access.title.map((line, index) => (
                  <span key={index} className="block">{line}</span>
                ))}
              </h2>
              <div className="mt-8">
                {renderBody(access.intro)}
              </div>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-6">{access.stepsLabel}</p>
              <div className="space-y-4">
                {access.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <span className="font-ui text-[11px] font-medium tracking-widest opacity-30 mt-[5px] shrink-0">{String(index + 1).padStart(2, '0')}</span>
                    <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] opacity-60">{step}</p>
                  </div>
                ))}
              </div>
              <p className="text-[14px] font-normal leading-[1.3] opacity-40 mt-8">{access.note}</p>
            </div>
            
          </div>
        </Container>
      </section>

      {/* ============================================ */}
      {/* 03 — SUBSCRIPTION & USAGE */}
      {/* ============================================ */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{subscription.section}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5">
              {renderBody(subscription.intro)}
              
              <div className="mt-6 space-y-2">
                {subscription.features.map((feature, index) => (
                  <p key={index} className="text-[17px] md:text-[18px] font-normal leading-[1.15] opacity-80">{feature}</p>
                ))}
                <p className="text-[14px] font-normal leading-[1.3] opacity-40 mt-2">{subscription.frameworks}</p>
              </div>
              
              <div className="mt-8">
                {renderBody(subscription.note, "opacity-40")}
              </div>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="rounded-[4px] p-8" style={{ background: 'linear-gradient(to bottom, #f7f7f7 0%, #efefef 100%)' }}>
                <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-6">{subscription.launch.label}</p>
                {renderCardBody(subscription.launch.body)}
                
                <div className="mt-6 space-y-3">
                  <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-40 mb-3">During this period</p>
                  {subscription.launch.during.map((item, index) => (
                    <p key={index} className="text-[15px] md:text-[16px] font-normal leading-[1.15] opacity-60">{item}</p>
                  ))}
                </div>
                
                <p className="text-[14px] font-normal leading-[1.3] opacity-40 mt-8">{subscription.launch.after}</p>
              </div>
            </div>
            
          </div>
        </Container>
      </section>

      {/* ============================================ */}
      {/* 04 — SUBSCRIPTION PLANS */}
      {/* ============================================ */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-12">{subscriptionPlans.section}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.plans.map((plan, index) => (
              <div key={index} className="relative rounded-[4px] p-8 min-h-[320px]" style={{ background: 'linear-gradient(to bottom, #f7f7f7 0%, #efefef 100%)' }}>
                
                {/* Badge */}
                {plan.badge && (
                  <span className="absolute top-6 right-6 font-ui text-[10px] font-medium tracking-wider uppercase px-3 py-1.5 rounded-[2px] bg-[#1a1a1a] text-white">
                    {plan.badge}
                  </span>
                )}
                
                <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-1">{plan.name}</p>
                {'subtitle' in plan && plan.subtitle && (
                  <p className="text-[13px] font-normal opacity-40 mb-4">{plan.subtitle}</p>
                )}
                {!('subtitle' in plan && plan.subtitle) && <div className="mb-4" />}
                
                {/* Prices */}
                <p className="text-[28px] md:text-[32px] font-normal leading-[1.1] tracking-[-0.01em]">
                  {plan.monthly}<span className="text-[15px] font-normal opacity-40"> / month</span>
                </p>
                <p className="text-[15px] font-normal opacity-40 mt-1 mb-8">
                  {plan.yearly} / year
                </p>
                
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <p key={fIndex} className="text-[15px] md:text-[16px] font-normal leading-[1.15] opacity-60">{feature}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================ */}
      {/* 05 — SECOND BRAIN vs GENERIC AI (Apple-style) */}
      {/* ============================================ */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-12">{comparison.section}</p>
          
          <div className="max-w-[720px]">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_100px_100px] md:grid-cols-[1fr_140px_140px] items-end pb-4 border-b border-black/10">
              <div />
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-40 text-center">{comparison.columns[0]}</p>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-100 text-center">{comparison.columns[1]}</p>
            </div>
            
            {/* Feature rows */}
            {comparison.features.map((feature, index) => (
              <div key={index} className="grid grid-cols-[1fr_100px_100px] md:grid-cols-[1fr_140px_140px] items-center py-5 border-b border-black/[0.06]">
                <p className="text-[15px] md:text-[16px] font-normal leading-[1.15] opacity-60">{feature.label}</p>
                <div className="flex justify-center">
                  {feature.generic ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="opacity-30">
                      <path d="M4 9L7.5 12.5L14 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span className="block w-[14px] h-[1px] bg-black/15" />
                  )}
                </div>
                <div className="flex justify-center">
                  {feature.secondBrain ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="opacity-80">
                      <path d="M4 9L7.5 12.5L14 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span className="block w-[14px] h-[1px] bg-black/15" />
                  )}
                </div>
              </div>
            ))}
            
            {/* Notes */}
            <div className="mt-8">
              {comparison.notes.map((note, index) => (
                <p key={index} className="text-[14px] font-normal leading-[1.3] opacity-40 mt-2">{note}</p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================ */}
      {/* 06 — STRUCTURAL PRINCIPLES */}
      {/* ============================================ */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{principles.section}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-5">
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {principles.title.map((line, index) => (
                  <span key={index} className="block">{line}</span>
                ))}
              </h2>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              {renderBody(principles.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* ============================================ */}
      {/* CTA */}
      {/* ============================================ */}
      <section className="w-full text-white py-24 md:py-32" style={{ background: 'linear-gradient(to bottom, #2f2f2f 0%, #1a1a1a 100%)' }}>
        <Container>
          <div className="flex items-center gap-4 justify-end">
            <span className="font-ui text-[12px] font-medium tracking-wide uppercase-force opacity-40">{cta.label}</span>
            <Link 
              href="/start" 
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
