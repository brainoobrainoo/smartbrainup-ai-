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

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero + Capabilities - Unified section */}
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

          {/* Capabilities Cards - PMF grande a sinistra, 3 a destra */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* PMF Dynamic™ - 50% */}
            <div 
              className="rounded-[4px] p-8 flex flex-col"
              style={{ 
                background: 'linear-gradient(to bottom, #eeeeee 0%, #f3f3f3 100%)',
                outline: '1px solid #d0d0d0',
                outlineOffset: '-8px'
              }}
            >
              <p className="text-[20px] md:text-[24px] font-normal leading-[1.2] mb-4">{capabilities.items[0].name}</p>
              <p className="text-[16px] md:text-[17px] font-normal leading-[1.5] opacity-50">
                {capabilities.items[0].description}
              </p>
            </div>

            {/* Other 3 features - stacked */}
            <div className="grid grid-cols-1 gap-5">
              {capabilities.items.slice(1).map((item, index) => (
                <div 
                  key={index} 
                  className="rounded-[4px] p-6 flex flex-col"
                  style={{ background: 'linear-gradient(to bottom, #eeeeee 0%, #f3f3f3 100%)' }}
                >
                  <p className="text-[16px] md:text-[17px] font-normal leading-[1.3] mb-2">{item.name}</p>
                  <p className="text-[14px] md:text-[15px] font-normal leading-[1.5] opacity-50">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </section>

      </div>

      {/* What you get */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5">
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-8">
              {deployment.headline}
            </h2>
            <div className="w-16 h-[1px] bg-[#1a1a1a] opacity-20"></div>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-6">
              {deployment.items.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="font-ui text-[10px] tracking-wide opacity-40 pt-1">—</span>
                  <p className="text-[16px] md:text-[18px] font-normal leading-[1.4] opacity-70">{item}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* How it works */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-32 border-t border-[#e8e8e8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5">
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-8">
              {process.headline}
            </h2>
            <div className="w-16 h-[1px] bg-[#1a1a1a] opacity-20"></div>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-6">
              {process.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* CTA - gradient to footer */}
      <section className="w-full text-white py-24" style={{ background: 'linear-gradient(to bottom, #2f2f2f 0%, #1a1a1a 100%)' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            
            <div>
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.0] tracking-[-0.02em] mb-4">
                {cta.headline}
              </h2>
              <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
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
