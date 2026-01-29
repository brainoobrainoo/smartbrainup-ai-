'use client'

// app/(smartbrainup-com)/contact/page.tsx

import { contactContent } from '@/content/smartbrainup-com/contact'
import Container from '@/components/layout/Container'

export default function ContactPage() {
  const { hero, purpose, contact, company, responseTime } = contactContent

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
      <section className="pt-20 md:pt-32 pb-16 md:pb-24 bg-white">
        <Container>
          <div className="relative">
            {/* Badge - Mobile */}
            <p className="md:hidden font-ui text-[11px] font-medium tracking-widest uppercase mb-4">
              <span className="block">
                <span className="opacity-100">{hero.badge.primary}</span>
                <span className="opacity-50"> SECOND BRAIN™</span>
              </span>
              <span className="block opacity-50">CONTACT</span>
            </p>
            
            {/* Badge - Desktop */}
            <p className="hidden md:block font-ui text-[11px] font-medium tracking-widest uppercase mb-4">
              <span className="opacity-100">{hero.badge.primary}</span>
              <span className="opacity-50"> {hero.badge.secondary}</span>
            </p>
            
            <h1 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-8">
              {hero.title.map((line, index) => (
                <span key={index} className="block">{line}</span>
              ))}
            </h1>
            
            <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] max-w-[560px] opacity-70">
              {hero.subtext.map((line, index) => (
                <span key={index} className="block">{line}</span>
              ))}
            </p>
          </div>
        </Container>
      </section>

      {/* Row 1: COMPANY | RESPONSE TIME - crema */}
      <section className="py-16 md:py-24 bg-[#fdfcfb]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* COMPANY */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {company.section}
              </p>
              {renderBody(company.body)}
            </div>
            
            {/* RESPONSE TIME */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {responseTime.section}
              </p>
              {renderBody(responseTime.body)}
            </div>
            
          </div>
        </Container>
      </section>

      {/* Row 2: PURPOSE | CONTACT - bianco */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            
            {/* PURPOSE */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {purpose.section}
              </p>
              <h2 className="text-[20px] md:text-[24px] font-medium leading-[1.2] tracking-[-0.01em] mb-5">
                {purpose.title}
              </h2>
              {renderBody(purpose.body)}
            </div>
            
            {/* CONTACT */}
            <div>
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-[#1a1a1a]/40 mb-6">
                {contact.section}
              </p>
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
