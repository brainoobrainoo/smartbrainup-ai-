'use client'

// app/(smartbrainup-com)/ip/page.tsx

import { useEffect, useState } from 'react'
import { ipContent } from '@/content/smartbrainup-com/ip'
import Container from '@/components/layout/Container'

export default function IPPage() {
  const { hero, premise, structure, coreLogic, distribution, enterprise, ownership, position, contact } = ipContent

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
      
      {/* Hero - bianco */}
      <section className="pt-20 md:pt-32 pb-24 md:pb-32 bg-white">
        <Container>
          <div className="relative">
            {/* Badge - Mobile */}
            <p className="md:hidden font-ui text-[11px] font-medium tracking-widest uppercase mb-4">
              <span className="block">
                <span className="opacity-100">{hero.badge.primary}</span>
                <span className="opacity-50"> SECOND BRAIN™</span>
              </span>
              <span className="block opacity-50">INTELLECTUAL PROPERTY</span>
            </p>
            
            {/* Badge - Desktop */}
            <p className="hidden md:block font-ui text-[11px] font-medium tracking-widest uppercase mb-4">
              <span className="opacity-100">{hero.badge.primary}</span>
              <span className="opacity-50"> {hero.badge.secondary}</span>
            </p>
            
            <h1 className="text-[42px] md:text-[64px] font-normal leading-[1.0] tracking-[-0.02em] mb-8">
              {/* Mobile */}
              <span 
                className="md:hidden"
                style={{ 
                  opacity: showFirst ? 1 : 0.08,
                  transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <span className="block">Protection</span>
                <span className="block">is not a layer</span>
              </span>
              <span 
                className="md:hidden"
                style={{ 
                  opacity: showSecond ? 1 : 0.03,
                  transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <span className="block">it is part of the</span>
                <span className="block">architecture</span>
              </span>
              
              {/* Desktop */}
              <span 
                className="hidden md:block"
                style={{ 
                  opacity: showFirst ? 1 : 0.08,
                  transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {hero.title[0]}
              </span>
              <span 
                className="hidden md:block"
                style={{ 
                  opacity: showSecond ? 1 : 0.03,
                  transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {hero.title[1]}
              </span>
            </h1>
            
            <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] max-w-[560px] opacity-70">
              {hero.subtext.map((line, index) => (
                <span key={index} className="block">{line}</span>
              ))}
            </p>
          </div>
        </Container>
      </section>

      {/* Row 1: 01 Premise | 02 Structure - crema leggerissimo */}
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
            
            {/* 02 Structure */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {structure.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {structure.title}
              </h2>
              {renderBody(structure.body)}
              {/* Mobile */}
              <div className="md:hidden space-y-4 mt-6">
                <div>
                  <span className="block text-[15px] font-medium text-[#1a1a1a]">Prompt Genesi™</span>
                  <span className="block text-[15px] text-[#1a1a1a]/50">the non-exposed patentable core</span>
                </div>
                <div>
                  <span className="block text-[15px] font-medium text-[#1a1a1a]">PMF™</span>
                  <span className="block text-[15px] text-[#1a1a1a]/50">portable masked implementation</span>
                </div>
                <div>
                  <span className="block text-[15px] font-medium text-[#1a1a1a]">PMF Dynamic™</span>
                  <span className="block text-[15px] text-[#1a1a1a]/50">enterprise-grade deployment</span>
                  <span className="block text-[15px] text-[#1a1a1a]/50">with governance and attribution</span>
                </div>
              </div>
              
              {/* Desktop */}
              <div className="hidden md:block space-y-3 mt-6">
                {structure.items.map((item, index) => (
                  <div key={index} className="flex items-baseline gap-3">
                    <span className="text-[15px] font-medium text-[#1a1a1a]">{item.name}</span>
                    <span className="text-[15px] text-[#1a1a1a]/50">{item.description}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </Container>
      </section>

      {/* Row 2: 03 Core Logic | 04 Distribution - bianco freddo leggerissimo */}
      <section className="py-16 md:py-24 bg-[#fcfcfb]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* 03 Core Logic */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {coreLogic.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {coreLogic.title}
              </h2>
              {renderBody(coreLogic.body)}
            </div>
            
            {/* 04 Distribution */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {distribution.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {distribution.title}
              </h2>
              {renderBody(distribution.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* Row 3: 05 Enterprise | 06 Ownership - beige leggerissimo */}
      <section className="py-16 md:py-24 bg-[#fbfaf8]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* 05 Enterprise Deployment */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {enterprise.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {enterprise.title}
              </h2>
              {renderBody(enterprise.body)}
            </div>
            
            {/* 06 Ownership */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {ownership.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {ownership.title}
              </h2>
              {renderBody(ownership.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* Row 4: 07 Position | 08 Contact - bianco */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* 07 Position */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {position.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {position.title}
              </h2>
              {renderBody(position.body)}
            </div>
            
            {/* 08 Contact */}
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
