'use client'

// app/(smartbrainup-com)/security/page.tsx

import { useEffect, useState } from 'react'
import { securityContent } from '@/content/smartbrainup-com/security'
import Container from '@/components/layout/Container'

export default function SecurityPage() {
  const { hero, premise, structure, integrity, attribution, control, governance, data, enterprise, position, contact } = securityContent

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
              <span className="block opacity-50">SECURITY & COMPLIANCE</span>
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
                <span className="block">Security is not</span>
                <span className="block">an add-on</span>
              </span>
              <span 
                className="md:hidden"
                style={{ 
                  opacity: showSecond ? 1 : 0.03,
                  transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <span className="block">it is part of</span>
                <span className="block">the method</span>
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

      {/* Row 1: 01 Premise | 02 Structure - crema */}
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
            </div>
            
          </div>
        </Container>
      </section>

      {/* Row 2: 03 Integrity | 04 Attribution - freddo */}
      <section className="py-16 md:py-24 bg-[#fcfcfb]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* 03 Integrity */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {integrity.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {integrity.title}
              </h2>
              {renderBody(integrity.body)}
            </div>
            
            {/* 04 Attribution */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {attribution.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {attribution.title}
              </h2>
              {renderBody(attribution.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* Row 3: 05 Control | 06 Governance - beige */}
      <section className="py-16 md:py-24 bg-[#fbfaf8]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* 05 Control */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {control.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {control.title}
              </h2>
              {renderBody(control.body)}
            </div>
            
            {/* 06 Governance */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {governance.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {governance.title}
              </h2>
              {renderBody(governance.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* Row 4: 07 Data | 08 Enterprise - freddo */}
      <section className="py-16 md:py-24 bg-[#fcfcfb]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* 07 Data */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {data.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {data.title}
              </h2>
              {renderBody(data.body)}
            </div>
            
            {/* 08 Enterprise */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {enterprise.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {enterprise.title}
              </h2>
              {renderBody(enterprise.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* Row 5: 09 Position | 10 Contact - bianco */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* 09 Position */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {position.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {position.title}
              </h2>
              {renderBody(position.body)}
            </div>
            
            {/* 10 Contact */}
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
