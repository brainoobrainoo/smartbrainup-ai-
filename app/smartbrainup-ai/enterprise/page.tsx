'use client'

// app/smartbrainup-ai/enterprise/page.tsx

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { enterpriseContent } from '@/content/smartbrainup-ai/enterprise'

export default function EnterprisePage() {
  const { hero, subhero, capabilities, deployment, process, cta } = enterpriseContent

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
      
      {/* Hero + Subhero - DARK zone */}
      <div className="relative w-full overflow-hidden text-white" style={{ background: 'linear-gradient(to bottom, #252525 0%, #161616 100%)' }}>
        
        {/* Hero */}
        <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8 pt-20 md:pt-32 pb-24">
          
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
            
            <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] max-w-[560px] opacity-70">
              {hero.description}
            </p>
          </div>

        </section>

        {/* Subhero - PMF Dynamic */}
        <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 pb-24 md:pb-32">
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{subhero.section}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {subhero.headline}
              </h2>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
                {subhero.paragraph}
              </p>
            </div>
            
          </div>
        </section>

      </div>

      {/* Capabilities */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32">
        <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{capabilities.section}</p>
        <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-12">{capabilities.headline}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.items.map((item, index) => (
            <div key={index} className="bg-[#f7f7f7] rounded-[4px] p-8">
              <h3 className="text-[17px] md:text-[18px] font-normal leading-[1.3] mb-3">{item.name}</h3>
              <p className="text-[15px] md:text-[16px] font-normal leading-[1.5] opacity-60">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Deployment - What you get */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32 border-t border-[#e8e8e8]">
        <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{deployment.section}</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
              {deployment.headline}
            </h2>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-4">
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

      {/* Process - How it works */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32 border-t border-[#e8e8e8]">
        <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{process.section}</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
              {process.headline}
            </h2>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
              {process.paragraph}
            </p>
          </div>
          
        </div>
      </section>

      {/* CTA - gradient to footer */}
      <section className="w-full text-white py-16 md:py-32" style={{ background: 'linear-gradient(to bottom, #2f2f2f 0%, #1a1a1a 100%)' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            
            <div>
              <h2 className="text-[36px] md:text-[52px] font-normal leading-[1.0] tracking-[-0.02em] mb-6">
                {cta.headline}
              </h2>
              <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60 max-w-[400px]">
                {cta.description}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
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
