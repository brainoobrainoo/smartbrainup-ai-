'use client'

// app/smartbrainup-ai/method/page.tsx

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { methodContent } from '@/content/smartbrainup-ai/method'

export default function MethodPage() {
  const { hero, core, inversion, determinism, process, execution, platforms, delivery, outcomes, cta } = methodContent

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

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero + Core Principle - DARK zone */}
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

        {/* Core Principle */}
        <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 pb-24 md:pb-32">
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
                {core.headline}
              </h2>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
                {core.paragraph}
              </p>
            </div>
            
          </div>
        </section>

      </div>

      {/* Interaction Model */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32">
        <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{inversion.section}</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
              {inversion.headline}
            </h2>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
              {inversion.paragraph}
            </p>
          </div>
          
        </div>
      </section>

      {/* Determinism */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32 border-t border-[#e8e8e8]">
        <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{determinism.section}</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
              {determinism.headline}
            </h2>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
              {determinism.paragraph}
            </p>
          </div>
          
        </div>
      </section>

      {/* DARK ZONE: Process */}
      <div className="w-full text-white" style={{ background: 'linear-gradient(to bottom, #484848 0%, #2a2a2a 100%)' }}>
        
        <section className="py-16 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8">
            
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{process.section}</p>
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-12">{process.headline}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.steps.map((step, index) => (
                <div key={index} className="rounded-[4px] p-8" style={{ background: 'linear-gradient(to bottom, #383838 0%, #3a3a3a 100%)' }}>
                  <h3 className="text-[17px] md:text-[18px] font-normal leading-[1.3] mb-3">{step.title}</h3>
                  <p className="text-[15px] md:text-[16px] font-normal leading-[1.5] opacity-60">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

      </div>

      {/* Execution */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32">
        <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{execution.section}</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
              {execution.headline}
            </h2>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
              {execution.paragraph}
            </p>
          </div>
          
        </div>
      </section>

      {/* Platforms - card style */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32">
        
        <div className="bg-[#f7f7f7] rounded-[4px] p-6 pt-14 md:p-16 relative">
          
          <span className="absolute top-6 right-6 font-ui text-[10px] tracking-widest uppercase opacity-30">{platforms.section}</span>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            
            <div>
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {platforms.headline}
              </h2>
            </div>
            
            <div>
              <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-70">
                {platforms.paragraph}
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32 border-t border-[#e8e8e8]">
        <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{delivery.section}</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
              {delivery.headline}
            </h2>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-8">
              {delivery.items.map((item, index) => (
                <div key={index}>
                  <h3 className="text-[17px] md:text-[18px] font-normal leading-[1.3] mb-2">{item.name}</h3>
                  <p className="text-[15px] md:text-[16px] font-normal leading-[1.5] opacity-60">
                    {item.description}
                  </p>
                </div>
              ))}
              <p className="font-ui text-[11px] tracking-widest uppercase opacity-40 pt-4">
                {delivery.note}
              </p>
            </div>
          </div>
          
        </div>
      </section>

      {/* Outcomes */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32 border-t border-[#e8e8e8]">
        <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{outcomes.section}</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
              {outcomes.headline}
            </h2>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-4">
              {outcomes.items.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="font-ui text-[10px] tracking-wide opacity-40 pt-1">—</span>
                  <p className="text-[16px] md:text-[18px] font-normal leading-[1.4] opacity-70">{item}</p>
                </div>
              ))}
            </div>
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
