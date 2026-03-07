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
  const { pricing, access, cta } = licensingContent
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
                    <span className="font-ui text-[17px] font-semibold tracking-widest opacity-70 mt-[3px] shrink-0">{String(index + 1).padStart(2, '0')}</span>
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
