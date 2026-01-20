'use client'

// app/smartbrainup-ai/page.tsx

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { homeContent } from '@/content/smartbrainup-ai/home'
import HeroCredits from '@/components/sections/HeroCredits'

// const DiagonalLines = dynamic(() => import('@/components/ui/DiagonalLines'), { ssr: false })

export default function HomePage() {
  const { hero, problem, solution, impact, platforms, cta } = homeContent

  const [showFirst, setShowFirst] = useState(false)
  const [showSecond, setShowSecond] = useState(false)
  const [showThird, setShowThird] = useState(false)

  useEffect(() => {
    const timerFirst = setTimeout(() => setShowFirst(true), 10)
    const timerSecond = setTimeout(() => setShowSecond(true), 500)
    const timerThird = setTimeout(() => setShowThird(true), 1000)

    return () => {
      clearTimeout(timerFirst)
      clearTimeout(timerSecond)
      clearTimeout(timerThird)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero + Problem - gradient zone */}
      <div className="relative w-full" style={{ background: 'linear-gradient(to bottom, #e8e8e8 0%, #ffffff 100%)' }}>
        
        {/* <DiagonalLines /> */}
        
        {/* Hero */}
        <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8 pt-20 md:pt-32 pb-24 md:pb-40">
          
          <div className="relative">
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
                  opacity: showSecond ? 1 : 0.03,
                  transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {hero.headline[1]}
              </span>
              <span 
                className="block"
                style={{ 
                  opacity: showThird ? 1 : 0.01,
                  transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {hero.headline[2]}
              </span>
            </h1>
            
            <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] max-w-[480px] opacity-70 mb-12">
              {hero.description}
            </p>

            {/* Scrolling Credits Card */}
            <HeroCredits />

            {/* CTA moved below card */}
            <div className="flex items-center gap-4 mt-12 justify-end">
              <span className="font-ui text-[12px] font-medium tracking-wide uppercase-force opacity-40">{hero.cta.label}</span>
              <Link href="/contact" className="relative font-ui text-[12px] font-medium tracking-wide uppercase px-6 py-4 rounded-[4px] overflow-hidden">
                <span className="absolute inset-0 bg-white/60 rounded-[4px]"></span>
                <span className="relative z-10 text-[#1a1a1a] uppercase-force">{hero.cta.button}</span>
              </Link>
            </div>
          </div>

          <div className="absolute bottom-12 left-6 md:left-8 flex items-center gap-4">
            <div className="w-8 h-[1px] bg-[#1a1a1a] opacity-30"></div>
            <span className="font-ui text-[11px] tracking-wide uppercase opacity-40">{hero.scroll}</span>
          </div>
        </section>

        {/* Problem */}
        <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32">
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{problem.section}</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                {Array.isArray(problem.headline) ? (
                  problem.headline.map((line, index) => (
                    <span key={index} className="block">{line}</span>
                  ))
                ) : (
                  problem.headline
                )}
              </h2>
            </div>
            
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="space-y-4">
                {problem.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
          </div>
        </section>

      </div>

      {/* Solution - white background */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32 bg-white">
        <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{solution.section}</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
              {Array.isArray(solution.headline) ? (
                solution.headline.map((line, index) => (
                  <span key={index} className="block">{line}</span>
                ))
              ) : (
                solution.headline
              )}
            </h2>
          </div>
          
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-4">
              {solution.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* Impact - card style */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32">
        
        <div className="bg-[#f7f7f7] rounded-[4px] p-6 pt-14 md:p-16 relative">
          
          <span className="absolute top-6 right-6 font-ui text-[10px] tracking-widest uppercase opacity-30">{impact.section}</span>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            
            <div>
              <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">{impact.headline}</h2>
            </div>
            
            <div>
              <div className="space-y-4">
                {impact.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <span className="font-ui text-[10px] tracking-wide opacity-40 pt-1">—</span>
                    <p className="text-[16px] md:text-[18px] font-normal leading-[1.4] opacity-70">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* DARK ZONE: Platforms */}
      <div className="w-full text-white" style={{ background: 'linear-gradient(to bottom, #484848 0%, #2f2f2f 100%)' }}>
        
        <section className="py-16 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8">
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-8">{platforms.section}</p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5">
                <h2 className="text-[32px] md:text-[44px] font-normal leading-[1.05] tracking-[-0.01em]">
                  {Array.isArray(platforms.headline) ? (
                    platforms.headline.map((line, index) => (
                      <span key={index} className="block">{line}</span>
                    ))
                  ) : (
                    platforms.headline
                  )}
                </h2>
              </div>
              
              <div className="lg:col-span-6 lg:col-start-7">
                <div className="space-y-4">
                  {platforms.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-70">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              
            </div>

          </div>
        </section>

      </div>

      {/* CTA - gradient to footer */}
      <section className="w-full text-white py-12 md:py-24" style={{ background: 'linear-gradient(to bottom, #2f2f2f 0%, #1a1a1a 100%)' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          
          <div className="flex items-center gap-4 justify-end">
            <span className="font-ui text-[12px] font-medium tracking-wide uppercase-force opacity-40">{cta.label}</span>
            <Link href="/contact" className="relative font-ui text-[12px] font-medium tracking-wide uppercase px-6 py-4 rounded-[4px] overflow-hidden">
              <span className="absolute inset-0 bg-[#3a3a3a] animate-pulse-soft rounded-[4px]"></span>
              <span className="relative z-10 text-white uppercase-force">{cta.button}</span>
            </Link>
          </div>
          
        </div>
      </section>

    </div>
  )
}
