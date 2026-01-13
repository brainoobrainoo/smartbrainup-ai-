'use client'

// app/(smartbrainup-ai)/method/page.tsx

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { methodContent } from '@/content/smartbrainup-ai/method'

export default function MethodPage() {
  const { hero, core, inversion, determinism, components, platforms, results, cta } = methodContent

  const [showFirst, setShowFirst] = useState(false)
  const [showSecond, setShowSecond] = useState(false)
  const [showCore, setShowCore] = useState(false)

  useEffect(() => {
    // Prima frase hero: parte subito
    const timerFirst = setTimeout(() => setShowFirst(true), 10)
    // Seconda frase hero: parte dopo 0.5 secondi
    const timerSecond = setTimeout(() => setShowSecond(true), 500)
    // Titolo sezione Core: parte dopo 1 secondo
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
        <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8 pt-32 pb-24">
          
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
            
            <p className="text-[17px] md:text-[18px] font-normal leading-[1.4] max-w-[560px] opacity-70">
              {hero.description}
            </p>
          </div>

        </section>

        {/* Core Principle */}
        <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5">
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-4">{core.section}</p>
              <h2 
                className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-8"
                style={{ 
                  opacity: showCore ? 1 : 0.03,
                  transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {core.headline}
              </h2>
              <div className="w-16 h-[1px] bg-white opacity-20"></div>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="space-y-6">
                {core.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
          </div>
        </section>

      </div>

      {/* Interaction Model */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5">
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-4">{inversion.section}</p>
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-8">
              {inversion.headline}
            </h2>
            <div className="w-16 h-[1px] bg-[#1a1a1a] opacity-20"></div>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-6">
              {inversion.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* Determinism */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-32 border-t border-[#e8e8e8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5">
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-4">{determinism.section}</p>
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-8">
              {determinism.headline}
            </h2>
            <div className="w-16 h-[1px] bg-[#1a1a1a] opacity-20"></div>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-6">
              {determinism.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* DARK ZONE: Delivery only */}
      <div className="w-full text-white" style={{ background: 'linear-gradient(to bottom, #303030 0%, #191919 100%)' }}>
        
        {/* Delivery - Components */}
        <section className="py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8">
            
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-4">{components.section}</p>
                <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">{components.headline}</h2>
              </div>
              <div className="hidden md:block w-24 h-[1px] bg-white opacity-20 mb-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {components.items.map((item, index) => (
                <div key={index} className="bg-[#313131] rounded-[4px] p-8">
                  <h3 className="text-[17px] md:text-[18px] font-normal leading-[1.3] mb-3">{item.name}</h3>
                  <p className="text-[15px] md:text-[16px] font-normal leading-[1.5] opacity-60">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <p className="font-ui text-[11px] tracking-widest uppercase opacity-40">
              {components.note}
            </p>

          </div>
        </section>

      </div>

      {/* Outcomes - light card */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-32">
        
        <div className="bg-[#f7f7f7] rounded-[4px] p-12 md:p-16 relative">
          
          <span className="absolute top-6 right-6 font-ui text-[10px] tracking-widest uppercase opacity-30">{results.section}</span>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <div>
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-6">
                {results.headline}
              </h2>
              <div className="w-16 h-[1px] bg-[#1a1a1a] opacity-20"></div>
            </div>
            
            <div className="space-y-6">
              {results.items.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="font-ui text-[10px] tracking-wide opacity-40 pt-1">—</span>
                  <p className="text-[16px] md:text-[18px] font-normal leading-[1.4] opacity-70">{item}</p>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </section>

      {/* Platforms - normal section */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-32 border-t border-[#e8e8e8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5">
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-4">{platforms.section}</p>
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em] mb-8">
              {platforms.headline}
            </h2>
            <div className="w-16 h-[1px] bg-[#1a1a1a] opacity-20"></div>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-6">
              {platforms.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
                  {paragraph}
                </p>
              ))}
            </div>
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
