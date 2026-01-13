'use client'

// app/(smartbrainup-ai)/licensing/page.tsx

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { licensingContent } from '@/content/smartbrainup-ai/licensing'

export default function LicensingPage() {
  const { hero, pricing, cta } = licensingContent

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

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero + Pricing - Unified section */}
      <div className="relative w-full overflow-hidden" style={{ background: 'linear-gradient(to bottom, #f5f5f5 0%, #ffffff 100%)' }}>
        
        <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8 pt-32 pb-24">
          
          {/* Hero content */}
          <div className="relative mb-16">
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-4">
              <span className="opacity-70 uppercase-force">{hero.badge.prefix}</span>
              <span className="opacity-40 uppercase-force"> {hero.badge.name}</span>
              <span className="opacity-40 uppercase-force"> {hero.badge.secondary}</span>
            </p>
            
            <h1 className="text-[42px] md:text-[64px] font-normal leading-[1.0] tracking-[-0.02em] mb-8">
              <span 
                className="block"
                style={{ 
                  opacity: showFirst ? 1 : 0.08,
                  transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {hero.headline[0]}
              </span>
              <span 
                className="block"
                style={{ 
                  opacity: showSecond ? 1 : 0.03,
                  transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {hero.headline[1]}
              </span>
            </h1>
            
            <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] max-w-[560px] opacity-60">
              {hero.principle}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* 4 Standard Plans - 2x2 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pricing.plans.map((plan, index) => (
                <div 
                  key={index} 
                  className="rounded-[4px] p-8 flex flex-col"
                  style={{ background: 'linear-gradient(to bottom, #eeeeee 0%, #f3f3f3 100%)' }}
                >
                  <p className="font-ui text-[10px] tracking-widest uppercase opacity-40 mb-1">{plan.name}</p>
                  <p className="text-[15px] font-normal opacity-70 mb-6">{plan.brains}</p>
                  
                  <p className="text-[36px] md:text-[42px] font-normal leading-[1.0] tracking-[-0.02em] mb-4">
                    {plan.price}
                  </p>
                  
                  <p className="text-[14px] md:text-[15px] font-normal leading-[1.5] opacity-50 mt-auto">
                    {plan.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Enterprise Card - 50% */}
            <div 
              className="rounded-[4px] p-10 md:p-12 flex flex-col"
              style={{ background: 'linear-gradient(to bottom, #eeeeee 0%, #f3f3f3 100%)' }}
            >
              <p className="font-ui text-[10px] tracking-widest uppercase opacity-40 mb-1">{pricing.enterprise.name}</p>
              <p className="text-[17px] font-normal opacity-70 mb-8">{pricing.enterprise.brains}</p>
              
              <p className="text-[48px] md:text-[64px] font-normal leading-[1.0] tracking-[-0.02em] mb-6">
                {pricing.enterprise.price}
              </p>
              
              <p className="text-[16px] md:text-[18px] font-normal leading-[1.5] opacity-50 mb-8 max-w-[380px]">
                {pricing.enterprise.description}
              </p>

              <Link href="/contact" className="font-ui text-[12px] font-medium tracking-wide uppercase opacity-60 hover:opacity-100 transition-opacity mt-auto">
                contact →
              </Link>
            </div>

          </div>

          {/* Note */}
          <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-70 mt-12 max-w-[560px]">
            {pricing.note}
          </p>

        </section>

      </div>

      {/* CTA - gradient to footer */}
      <section className="w-full text-white py-24" style={{ background: 'linear-gradient(to bottom, #2f2f2f 0%, #1a1a1a 100%)' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.0] tracking-[-0.02em]">
              {cta.headline}
            </h2>
            
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
