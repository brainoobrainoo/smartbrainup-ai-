'use client'

// app/(smartbrainup-ai)/page.tsx

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { homeContent } from '@/content/smartbrainup-ai/home'

const DiagonalLines = dynamic(() => import('@/components/ui/DiagonalLines'), { ssr: false })

export default function HomePage() {
  const { hero, problem, solution, process, impact, licensing, security, cta } = homeContent

  const [showFirst, setShowFirst] = useState(false)
  const [showSecond, setShowSecond] = useState(false)
  const [showThird, setShowThird] = useState(false)

  useEffect(() => {
    // Prima riga: parte subito
    const timerFirst = setTimeout(() => setShowFirst(true), 10)
    // Seconda riga: parte dopo 0.5 secondi
    const timerSecond = setTimeout(() => setShowSecond(true), 500)
    // Terza riga: parte dopo 1 secondo
    const timerThird = setTimeout(() => setShowThird(true), 1000)

    return () => {
      clearTimeout(timerFirst)
      clearTimeout(timerSecond)
      clearTimeout(timerThird)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero - full width gradient */}
      <div className="relative w-full overflow-hidden" style={{ background: 'linear-gradient(to bottom, #cdcdcd 0%, #ffffff 100%)' }}>
        
        {/* Diagonal lines overlay - full width */}
        <DiagonalLines />
        
        <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8 pt-32 pb-40">
          
          <div className="relative">
            {/* Logo text */}
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-4">
              <span className="opacity-100 uppercase-force">{hero.badge.primary}</span>
              <span className="opacity-50 uppercase-force"> {hero.badge.secondary}</span>
            </p>
            
            <h1 className="text-[42px] md:text-[64px] font-normal leading-[1.0] tracking-[-0.02em] mb-8">
              <span 
                className="block"
                style={{ 
                  opacity: showFirst ? 1 : 0.05,
                  transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {hero.headline[0]}
              </span>
              <span 
                className="block"
                style={{ 
                  opacity: showSecond ? 1 : 0.02,
                  transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {hero.headline[1]}
              </span>
              <span 
                className="block"
                style={{ 
                  opacity: showThird ? 1 : 0,
                  transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {hero.headline[2]}
              </span>
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 items-start">
              <p className="text-[17px] md:text-[18px] font-normal leading-[1.4] max-w-[480px] opacity-70">
                {hero.description}
              </p>
              
              <div className="flex items-center gap-4 self-end md:self-auto">
                <span className="font-ui text-[12px] font-medium tracking-wide uppercase-force opacity-40">{hero.cta.label}</span>
                <Link href="/contact" className="relative font-ui text-[12px] font-medium tracking-wide uppercase px-6 py-4 rounded-[4px] overflow-hidden">
                  <span className="absolute inset-0 bg-white/60 rounded-[4px]"></span>
                  <span className="relative z-10 text-[#1a1a1a] uppercase-force">{hero.cta.button}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom indicator */}
          <div className="absolute bottom-12 left-6 md:left-8 flex items-center gap-4">
            <div className="w-8 h-[1px] bg-[#1a1a1a] opacity-30"></div>
            <span className="font-ui text-[11px] tracking-wide uppercase opacity-40">{hero.scroll}</span>
          </div>
        </section>
      </div>

      {/* Problem */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5">
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-4">{problem.section}</p>
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-8">
              {problem.headline}
            </h2>
            <div className="w-16 h-[1px] bg-[#1a1a1a] opacity-20"></div>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-6">
              {problem.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* Solution */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-32 border-t border-[#e8e8e8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5">
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-4">{solution.section}</p>
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-8">
              {solution.headline}
            </h2>
            <div className="w-16 h-[1px] bg-[#1a1a1a] opacity-20"></div>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-6">
              {solution.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* DARK ZONE: How it works + What changes */}
      <div className="w-full text-white" style={{ background: 'linear-gradient(to bottom, #303030 0%, #191919 100%)' }}>
        
        {/* How it works */}
        <section className="py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8">
            
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-4">{process.section}</p>
                <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">{process.headline}</h2>
              </div>
              <div className="hidden md:block w-24 h-[1px] bg-white opacity-20 mb-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.steps.map((step) => (
                <div key={step.number} className="bg-[#313131] rounded-[4px] p-8 relative">
                  <span className="absolute top-4 right-4 font-ui text-[13px] tracking-wide opacity-60">{step.number}</span>
                  <h3 className="text-[17px] md:text-[18px] font-normal leading-[1.3] mb-3 mt-8">{step.title}</h3>
                  <p className="text-[15px] md:text-[16px] font-normal leading-[1.5] opacity-60">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What changes */}
        <section className="pb-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              <div className="lg:col-span-5">
                <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-4">{impact.section}</p>
                <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-8">{impact.headline}</h2>
                <div className="w-16 h-[1px] bg-white opacity-20"></div>
              </div>
              
              <div className="lg:col-span-6 lg:col-start-7">
                <div className="space-y-6">
                  {impact.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <span className="font-ui text-[10px] tracking-wide opacity-40 pt-1">—</span>
                      <p className="text-[16px] md:text-[18px] font-normal leading-[1.4]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>

          </div>
        </section>

      </div>

      {/* Licensing - subtle card */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-32">
        
        <div className="bg-[#f7f7f7] rounded-[4px] p-12 md:p-16 relative">
          
          <span className="absolute top-6 right-6 font-ui text-[10px] tracking-widest uppercase opacity-30">{licensing.section}</span>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <div>
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-6">
                {licensing.headline[0]}<br />
                {licensing.headline[1]}
              </h2>
              <div className="w-16 h-[1px] bg-[#1a1a1a] opacity-20"></div>
            </div>
            
            <div className="space-y-6">
              {licensing.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-70">
                  {paragraph}
                </p>
              ))}
              <div className="pt-4">
                <span className="font-ui text-[11px] tracking-widest uppercase opacity-40">{licensing.note}</span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Protection - minimal */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-32 border-t border-[#e8e8e8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4">
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-4">{security.section}</p>
            <h2 className="text-[28px] md:text-[36px] font-normal leading-[1.1] tracking-[-0.01em]">{security.headline}</h2>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-6">
            <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-70">
              {security.description}
            </p>
          </div>
          
        </div>
      </section>

      {/* CTA - gradient to footer */}
      <section className="w-full text-white py-32" style={{ background: 'linear-gradient(to bottom, #2f2f2f 0%, #1a1a1a 100%)' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 items-start">
            
            <div>
              <h2 className="text-[36px] md:text-[52px] font-normal leading-[1.0] tracking-[-0.02em] mb-6">
                {cta.headline}
              </h2>
              <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60 max-w-[400px]">
                {cta.description}
              </p>
            </div>
            
            <div className="flex items-center gap-4 self-end md:self-auto">
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
