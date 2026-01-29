'use client'

// app/(smartbrainup-com)/page.tsx

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { homeContent } from '@/content/smartbrainup-com/home'
import Container from '@/components/layout/Container'
import Lottie from 'lottie-react'
import sphereAnimation from '../../public/animations/SFERA_LOGO_B_bianco.json'

export default function HomePage() {
  const { hero, intro, premise, method, surfaces, ownership, position, contact } = homeContent

  // Animazione fade-in per il testo hero
  const [textOpacity, setTextOpacity] = useState(0)

  useEffect(() => {
    const duration = 6000 // 6 secondi
    const steps = 100
    const stepDuration = duration / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      setTextOpacity(currentStep / steps)
      if (currentStep >= steps) {
        clearInterval(interval)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [])

  // Helper per body con blocchi separati
  const renderBody = (lines: string[]) => {
    const blocks: string[][] = []
    let currentBlock: string[] = []
    
    lines.forEach((line) => {
      if (line === '') {
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
          <p key={blockIndex} className="text-[16px] leading-[1.55] text-[#1a1a1a]/65">
            {block.map((line, lineIndex) => (
              <span key={lineIndex} className="block">{line}</span>
            ))}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      
      {/* Hero: Mobile = struttura identica al .ai, Desktop = two columns */}
      
      {/* Mobile only - struttura identica al .ai */}
      <div className="min-h-[100dvh] flex flex-col md:hidden bg-white">
        <section className="flex-1 flex flex-col justify-center pt-16 pb-[250px]">
          <Container>
            <div className="flex flex-col items-center text-center relative">
              
              {/* Sfera */}
              <div className="mb-9">
                <Lottie 
                  animationData={sphereAnimation}
                  loop={true}
                  className="w-[65px] h-[65px]"
                />
              </div>
              
              {/* Testo - altezza fissa come .ai */}
              <div className="h-[60px]">
                <p className="text-[17px] font-normal leading-[1.15] text-[#1a1a1a]/70">
                  <span className="block">a promptless method</span>
                  <span className="block">powered by</span>
                  <span className="block" style={{ opacity: textOpacity }}>AI-UP SECOND BRAIN™</span>
                </p>
              </div>
              
              {/* Testo extra - absolute, non influenza il centro */}
              <div className="absolute top-full mt-5 whitespace-nowrap">
                <p className="text-[17px] font-normal leading-[1.15] text-[#1a1a1a]/70">
                  <span className="block">Designed to give structure</span>
                  <span className="block">where generative AI breaks</span>
                </p>
              </div>
              
            </div>
          </Container>
        </section>
        
        {/* CTA Section - identico al .ai */}
        <section className="pb-12">
          <Container>
            <div className="flex items-center gap-4 justify-end">
              <span className="font-ui text-[12px] font-medium tracking-wide uppercase opacity-40">B2B ONLY</span>
              <Link 
                href="/contact" 
                className="relative flex items-center justify-center w-[55px] h-[55px] rounded-full overflow-hidden"
              >
                <span className="absolute inset-0 bg-[#1a1a1a]/[0.07] animate-pulse-soft rounded-full"></span>
                <span className="relative z-10 font-ui text-[11px] font-bold tracking-wide text-[#1a1a1a] uppercase">TRY</span>
              </Link>
            </div>
          </Container>
        </section>
      </div>

      {/* Desktop layout - identico al .ai */}
      <section className="hidden md:block min-h-[100dvh] bg-white">
        <div className="min-h-[100dvh] flex flex-col">
          <div className="flex-1 flex flex-col justify-center pt-16 pb-[350px]">
            <Container>
              <div className="flex flex-col items-center text-center relative">
                
                {/* Sfera */}
                <div className="mb-9">
                  <Lottie 
                    animationData={sphereAnimation}
                    loop={true}
                    className="w-[95px] h-[95px]"
                  />
                </div>
                
                {/* Testo - altezza fissa come .ai */}
                <div className="h-[66px]">
                  <p className="text-[18px] font-normal leading-[1.15] text-[#1a1a1a]/70">
                    <span className="block">a promptless method</span>
                    <span className="block">powered by</span>
                    <span className="block" style={{ opacity: textOpacity }}>AI-UP SECOND BRAIN™</span>
                  </p>
                </div>
                
                {/* Testo extra - absolute, non influenza il centro */}
                <div className="absolute top-full mt-5 whitespace-nowrap">
                  <p className="text-[18px] font-normal leading-[1.15] text-[#1a1a1a]/70">
                    <span className="block">Designed to give structure</span>
                    <span className="block">where generative AI breaks</span>
                  </p>
                </div>
                
              </div>
            </Container>
          </div>
          
          {/* CTA Section - identico al .ai */}
          <section className="pb-16">
            <Container>
              <div className="flex items-center gap-4 justify-end">
                <span className="font-ui text-[12px] font-medium tracking-wide uppercase opacity-40">B2B ONLY</span>
                <Link 
                  href="/contact" 
                  className="relative flex items-center justify-center w-[75px] h-[75px] rounded-full overflow-hidden"
                >
                  <span className="absolute inset-0 bg-[#1a1a1a]/[0.07] animate-pulse-soft rounded-full"></span>
                  <span className="relative z-10 font-ui text-[12px] font-bold tracking-wide text-[#1a1a1a] uppercase">TRY</span>
                </Link>
              </div>
            </Container>
          </section>
        </div>
      </section>

      {/* Intro Section - bianco */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="max-w-[600px]">
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
              For work that depends on AI
            </p>
            
            {/* Mobile */}
            <div className="md:hidden">
              <p className="text-[20px] font-medium leading-[1.2] tracking-[-0.01em] text-[#1a1a1a]/70 mb-6">
                <span className="block">SmartBrainUp is</span>
                <span className="block">the Italian innovation company</span>
                <span className="block">with deep</span>
                <span className="block">prompt engineering expertise</span>
                <span className="block">and real professional use cases</span>
              </p>
              
              <p className="text-[20px] font-medium leading-[1.2] tracking-[-0.01em] text-[#1a1a1a]/70 mb-6">
                <span className="block">We develop protect and license</span>
                <span className="block">a proprietary promptless method</span>
                <span className="block">designed to bring structure</span>
                <span className="block">where generative AI becomes unstable</span>
              </p>
              
              <p className="text-[20px] font-medium leading-[1.2] tracking-[-0.01em] text-[#1a1a1a]/70">
                <span className="block">Turning statistical behavior</span>
                <span className="block">into deterministic reasoning</span>
              </p>
            </div>
            
            {/* Desktop */}
            <div className="hidden md:block">
              <p className="text-[24px] font-medium leading-[1.2] tracking-[-0.01em] text-[#1a1a1a]/70 mb-6">
                <span className="block">SmartBrainUp is the Italian innovation company</span>
                <span className="block">with deep prompt engineering expertise</span>
                <span className="block">and real professional use cases</span>
              </p>
              
              <p className="text-[24px] font-medium leading-[1.2] tracking-[-0.01em] text-[#1a1a1a]/70 mb-6">
                <span className="block">We develop protect and license</span>
                <span className="block">a proprietary promptless method</span>
                <span className="block">designed to bring structure</span>
                <span className="block">where generative AI becomes unstable</span>
              </p>
              
              <p className="text-[24px] font-medium leading-[1.2] tracking-[-0.01em] text-[#1a1a1a]/70">
                <span className="block">Turning statistical behavior</span>
                <span className="block">into deterministic reasoning</span>
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Row 2: 01 Premise | 02 Method - crema leggerissimo */}
      <section className="py-16 md:py-24 bg-[#fdfcfb]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* 01 Premise */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {premise.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {premise.title}
              </h2>
              {renderBody(premise.body)}
            </div>
            
            {/* 02 Method */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {method.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {method.title}
              </h2>
              {renderBody(method.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* Row 3: 03 Surfaces | 04 Ownership - beige leggerissimo */}
      <section className="py-16 md:py-24 bg-[#fbfaf8]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* 03 Surfaces */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {surfaces.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {surfaces.title}
              </h2>
              {renderBody(surfaces.body)}
            </div>
            
            {/* 04 Ownership */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {ownership.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {ownership.title}
              </h2>
              <div className="space-y-4">
                <p className="text-[16px] leading-[1.55] text-[#1a1a1a]/65">
                  The method is built on a layered intellectual property architecture
                </p>
                <p className="text-[16px] leading-[1.55] text-[#1a1a1a]/65">
                  <span className="block font-medium text-[#1a1a1a]">Prompt Genesi™</span>
                  <span className="block">the non-exposed</span>
                  <span className="block">patentable core</span>
                </p>
                <p className="text-[16px] leading-[1.55] text-[#1a1a1a]/65">
                  <span className="block font-medium text-[#1a1a1a]">PMF™</span>
                  <span className="block">portable masked implementation</span>
                </p>
                <p className="text-[16px] leading-[1.55] text-[#1a1a1a]/65">
                  <span className="block font-medium text-[#1a1a1a]">PMF Dynamic™</span>
                  <span className="block">enterprise-grade deployment</span>
                </p>
                <p className="text-[16px] leading-[1.55] text-[#1a1a1a]/65">
                  <span className="block">Each component serves a specific role</span>
                  <span className="block">each is protected accordingly</span>
                </p>
                <p className="text-[16px] leading-[1.55] text-[#1a1a1a]/65">
                  <span className="block">→ Explore the IP architecture</span>
                </p>
              </div>
            </div>
            
          </div>
        </Container>
      </section>

      {/* Row 4: 05 Position | 06 Contact - bianco */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* 05 Position */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {position.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {position.title}
              </h2>
              {renderBody(position.body)}
            </div>
            
            {/* 06 Contact */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {contact.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {contact.title}
              </h2>
              {renderBody(contact.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* Bottom spacing before footer */}
      <div className="h-12 md:h-20"></div>

    </div>
  )
}
