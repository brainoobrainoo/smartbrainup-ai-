'use client'

// app/smartbrainup-ai/licensing/page.tsx

import Link from 'next/link'
import { ReactNode, useState } from 'react'
import { licensingContent } from '@/content/smartbrainup-ai/licensing'
import Container from '@/components/layout/Container'
import { useTheme } from '@/lib/ThemeContext'

// Parse **bold** markers into JSX
function parseBold(text: string): ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
  )
}

export default function LicensingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const { pricing, access, subscription, subscriptionPlans, comparison, principles, cta } = licensingContent
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const handleCheckout = async (planKey: string) => {
    if (loadingPlan) return
    setLoadingPlan(planKey)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (e) {
      console.error('Checkout error:', e)
    } finally {
      setLoadingPlan(null)
    }
  }

  // unused hero fade states removed

  // Helper to render body with proper spacing — LARGER sizes
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
          <p key={blockIndex} className={`text-[19px] md:text-[21px] font-normal leading-[1.35] ${opacity}`}>
            {block.map((line, lineIndex) => (
              <span key={lineIndex} className="block">{parseBold(line)}</span>
            ))}
          </p>
        ))}
      </div>
    )
  }

  // Helper for card body
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
          <p key={blockIndex} className={`text-[17px] md:text-[19px] font-normal leading-[1.35] ${opacity}`}>
            {block.map((line, lineIndex) => (
              <span key={lineIndex} className="block">{parseBold(line)}</span>
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
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .animate-pulse-link {
          animation: pulse-link 4s ease-in-out infinite;
        }
      `}</style>

      {/* ============================================ */}
      {/* SECOND BRAIN PLANS — dark gradient, clean     */}
      {/* ============================================ */}
      <div className={isLight ? 'text-[#1a1a1a]' : 'text-white'} style={{ background: isLight ? '#ffffff' : 'linear-gradient(to bottom, #252525 0%, #5a5a5a 100%)' }}>
        <section className="relative pt-28 md:pt-36 pb-16 md:pb-32">
          <Container>

            <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-10 md:mb-14">
              <span className={`${isLight ? 'opacity-90' : 'opacity-100'} uppercase-force`}>AI-UP Second Brain™</span>
              <span className={`${isLight ? 'opacity-40' : 'opacity-40'} uppercase-force`}> License</span>
            </p>

            <div className="flex flex-col">

              {pricing.plans.map((plan, index) => (
                <div
                  key={index}
                  className={`group py-8 md:py-10 border-b ${isLight ? 'border-black/[0.08]' : 'border-white/[0.06]'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">

                    <div className="flex-1">
                      <p className="text-[21px] md:text-[27px] font-normal leading-[1.2] opacity-90">{plan.brains}</p>
                      <div className="mt-2">
                        {plan.body.filter((l: string) => l !== '').map((line: string, li: number) => (
                          <p key={li} className={`text-[15px] md:text-[18px] font-normal leading-[1.4] ${isLight ? 'opacity-50' : 'opacity-40'}`}>{parseBold(line)}</p>
                        ))}
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="flex md:hidden flex-col">
                      <p className="text-[12px] font-normal opacity-30 mb-1">one-time</p>
                      <div className="flex items-center justify-between">
                        <p className="text-[28px] font-normal leading-[1.1] tracking-[-0.01em]">{plan.price}</p>
                        <button
                          onClick={() => handleCheckout((plan as any).key)}
                          disabled={loadingPlan === (plan as any).key}
                          className={`px-5 py-2.5 rounded-full
                                     border ${isLight ? 'border-black/15 bg-black/[0.05] hover:bg-black/[0.10]' : 'border-white/25 bg-white/[0.08] hover:bg-white/[0.15]'}
                                     text-[12px] font-medium tracking-wide uppercase
                                     opacity-80 hover:opacity-100
                                     transition-all duration-300`}
                        >
                          {loadingPlan === (plan as any).key ? '...' : 'Select'}
                        </button>
                      </div>
                    </div>
                    {/* Desktop */}
                    <div className="hidden md:flex flex-col items-end flex-shrink-0">
                      <p className="text-[13px] font-normal opacity-30 mb-1">one-time</p>
                      <p className="text-[42px] font-normal leading-[1.1] tracking-[-0.01em]">{plan.price}</p>
                      <button
                        onClick={() => handleCheckout((plan as any).key)}
                        disabled={loadingPlan === (plan as any).key}
                        className={`mt-4 px-7 py-3 rounded-full
                                   border ${isLight ? 'border-black/15 bg-black/[0.05] hover:bg-black/[0.10]' : 'border-white/25 bg-white/[0.08] hover:bg-white/[0.15]'}
                                   text-[13px] font-medium tracking-wide uppercase
                                   opacity-80 hover:opacity-100
                                   transition-all duration-300`}
                      >
                        {loadingPlan === (plan as any).key ? '...' : 'Select'}
                      </button>
                    </div>

                  </div>
                </div>
              ))}

              {/* Enterprise row */}
              <div className={`group py-8 md:py-10 border-b ${isLight ? 'border-black/[0.08]' : 'border-white/[0.06]'}`}>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">

                  <div className="flex-1">
                    <p className="text-[21px] md:text-[27px] font-normal leading-[1.2] opacity-90">{pricing.enterprise.brains}</p>
                    <div className="mt-2">
                      {pricing.enterprise.body.filter((l: string) => l !== '').map((line: string, li: number) => (
                        <p key={li} className={`text-[15px] md:text-[18px] font-normal leading-[1.4] ${isLight ? 'opacity-50' : 'opacity-40'}`}>{parseBold(line)}</p>
                      ))}
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="flex md:hidden flex-col">
                    <div className="flex items-center justify-between">
                      <p className="text-[28px] font-normal leading-[1.1] tracking-[-0.01em]">{pricing.enterprise.price}</p>
                      <Link
                        href="/contact"
                        className={`px-5 py-2.5 rounded-full
                                   border ${isLight ? 'border-black/15 bg-black/[0.05] hover:bg-black/[0.10]' : 'border-white/25 bg-white/[0.08] hover:bg-white/[0.15]'}
                                   text-[12px] font-medium tracking-wide uppercase
                                   opacity-80 hover:opacity-100
                                   transition-all duration-300`}
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                  {/* Desktop */}
                  <div className="hidden md:flex flex-col items-end flex-shrink-0">
                    <p className="text-[42px] font-normal leading-[1.1] tracking-[-0.01em]">{pricing.enterprise.price}</p>
                    <Link
                      href="/contact"
                      className={`mt-4 px-7 py-3 rounded-full
                                 border ${isLight ? 'border-black/15 bg-black/[0.05] hover:bg-black/[0.10]' : 'border-white/25 bg-white/[0.08] hover:bg-white/[0.15]'}
                                 text-[13px] font-medium tracking-wide uppercase
                                 opacity-80 hover:opacity-100
                                 transition-all duration-300`}
                    >
                      Contact
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          </Container>
        </section>
      </div>

      {/* ============================================ */}
      {/* 02 — ACCESS & ACTIVATION */}
      {/* ============================================ */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[13px] font-medium tracking-widest uppercase opacity-50 mb-8">{access.section}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5">
              <h2 className="text-[36px] md:text-[50px] font-normal leading-[1.05] tracking-[-0.01em]">
                {access.title.map((line, index) => (
                  <span key={index} className="block">{line}</span>
                ))}
              </h2>
              <div className="mt-8">
                {renderBody(access.intro)}
              </div>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="font-ui text-[13px] font-medium tracking-widest uppercase opacity-50 mb-6">{access.stepsLabel}</p>
              <div className="space-y-5">
                {access.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-5">
                    <span className="font-ui text-[14px] font-medium tracking-widest opacity-25 mt-[4px] shrink-0">{String(index + 1).padStart(2, '0')}</span>
                    <p className="text-[19px] md:text-[21px] font-normal leading-[1.35] opacity-60">{step}</p>
                  </div>
                ))}
              </div>
              <p className="text-[16px] font-normal leading-[1.4] opacity-40 mt-10">{access.note}</p>
            </div>
            
          </div>
        </Container>
      </section>

      {/* ============================================ */}
      {/* 03 — SUBSCRIPTION & USAGE */}
      {/* ============================================ */}
      <section className="relative py-16 md:py-32">
        <Container>
          <p className="font-ui text-[13px] font-medium tracking-widest uppercase opacity-50 mb-8">{subscription.section}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5">
              {renderBody(subscription.intro)}
              
              <div className="mt-6 space-y-3">
                {subscription.features.map((feature, index) => (
                  <p key={index} className="text-[19px] md:text-[21px] font-normal leading-[1.35] opacity-80">{parseBold(feature)}</p>
                ))}
                <p className="text-[16px] font-normal leading-[1.4] opacity-40 mt-3">{subscription.frameworks}</p>
              </div>
              
              <div className="mt-10">
                {renderBody(subscription.note, "opacity-40")}
              </div>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="rounded-[4px] p-8 md:p-10" style={{ background: 'linear-gradient(to bottom, #f7f7f7 0%, #efefef 100%)' }}>
                <p className="font-ui text-[13px] font-medium tracking-widest uppercase opacity-50 mb-6">{subscription.launch.label}</p>
                {renderCardBody(subscription.launch.body)}
                
                <div className="mt-8 space-y-3">
                  <p className="font-ui text-[12px] font-medium tracking-widest uppercase opacity-40 mb-4">During this period</p>
                  {subscription.launch.during.map((item, index) => (
                    <p key={index} className="text-[17px] md:text-[19px] font-normal leading-[1.35] opacity-60">{parseBold(item)}</p>
                  ))}
                </div>
                
                <p className="text-[16px] font-normal leading-[1.4] opacity-40 mt-10">{subscription.launch.after}</p>
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
          <p className="font-ui text-[13px] font-medium tracking-widest uppercase opacity-50 mb-12">{subscriptionPlans.section}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.plans.map((plan, index) => (
              <div key={index} className="relative rounded-[4px] p-8 md:p-10 min-h-[360px]" style={{ background: 'linear-gradient(to bottom, #f7f7f7 0%, #efefef 100%)' }}>
                
                <p className="font-ui text-[14px] font-medium tracking-widest uppercase opacity-50 mb-1">{plan.name}</p>
                {'subtitle' in plan && plan.subtitle && (
                  <p className="text-[15px] font-normal opacity-40 mb-5">{plan.subtitle}</p>
                )}
                {!('subtitle' in plan && plan.subtitle) && <div className="mb-5" />}
                
                {/* Prices */}
                <p className="text-[34px] md:text-[42px] font-normal leading-[1.1] tracking-[-0.01em]">
                  {plan.monthly}<span className="text-[17px] font-normal opacity-40"> / month</span>
                </p>
                <p className="text-[17px] font-normal opacity-40 mt-1 mb-8">
                  {plan.yearly} / year
                </p>
                
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <p key={fIndex} className="text-[17px] md:text-[19px] font-normal leading-[1.35] opacity-60">{parseBold(feature)}</p>
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
          <p className="font-ui text-[13px] font-medium tracking-widest uppercase opacity-50 mb-12">{comparison.section}</p>
          
          <div className="max-w-[780px]">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_160px_160px] items-end pb-5 border-b border-black/10">
              <div />
              <p className="font-ui text-[13px] font-medium tracking-widest uppercase opacity-40 text-center">{comparison.columns[0]}</p>
              <p className="font-ui text-[13px] font-medium tracking-widest uppercase opacity-100 text-center">{comparison.columns[1]}</p>
            </div>
            
            {/* Feature rows */}
            {comparison.features.map((feature, index) => (
              <div key={index} className="grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_160px_160px] items-center py-6 border-b border-black/[0.06]">
                <p className="text-[17px] md:text-[19px] font-normal leading-[1.35] opacity-60">{feature.label}</p>
                <div className="flex justify-center">
                  {feature.generic ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="opacity-30">
                      <path d="M4.5 10L8.5 14L15.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span className="block w-[16px] h-[1.5px] bg-black/15" />
                  )}
                </div>
                <div className="flex justify-center">
                  {feature.secondBrain ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="opacity-80">
                      <path d="M4.5 10L8.5 14L15.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span className="block w-[16px] h-[1.5px] bg-black/15" />
                  )}
                </div>
              </div>
            ))}
            
            {/* Notes */}
            <div className="mt-10">
              {comparison.notes.map((note, index) => (
                <p key={index} className="text-[16px] font-normal leading-[1.4] opacity-40 mt-2">{parseBold(note)}</p>
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
          <p className="font-ui text-[13px] font-medium tracking-widest uppercase opacity-50 mb-8">{principles.section}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-5">
              <h2 className="text-[36px] md:text-[50px] font-normal leading-[1.05] tracking-[-0.01em]">
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
