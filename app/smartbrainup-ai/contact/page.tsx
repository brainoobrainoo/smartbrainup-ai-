'use client'

// app/smartbrainup-ai/contact/page.tsx

import { useEffect, useState } from 'react'
import { contactContent } from '@/content/smartbrainup-ai/contact'

export default function ContactPage() {
  const { hero, form, micro, info } = contactContent

  const [showTitle, setShowTitle] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowTitle(true), 10)
    return () => clearTimeout(timer)
  }, [])

  // Helper to render body with proper spacing
  const renderBody = (lines: string[], opacity: string = "opacity-60") => {
    const blocks: string[][] = []
    let currentBlock: string[] = []
    
    lines.forEach((line) => {
      if (line === "") {
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
      <div className="space-y-5">
        {blocks.map((block, blockIndex) => (
          <p key={blockIndex} className={`text-[17px] md:text-[18px] font-normal leading-[1.15] ${opacity}`}>
            {block.map((line, lineIndex) => (
              <span key={lineIndex} className="block">{line}</span>
            ))}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 pt-20 md:pt-32 pb-24 md:pb-32">
        
        <div className="relative">
          <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-4">
            <span className="opacity-100 uppercase-force">{hero.badge.primary}</span>
            <span className="opacity-50 uppercase-force"> {hero.badge.secondary}</span>
          </p>
          
          <h1 
            className="text-[42px] md:text-[64px] font-normal leading-[1.0] tracking-[-0.02em] mb-8"
            style={{ 
              opacity: showTitle ? 1 : 0.08,
              transition: 'opacity 4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {hero.title}
          </h1>
          
          <div className="max-w-[480px]">
            {renderBody(hero.body, "opacity-70")}
          </div>
        </div>

      </section>

      {/* Form + Info */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Form */}
          <div className="lg:col-span-6">
            <form className="space-y-6">
              <div>
                <label className="block font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-3">
                  {form.fields.name}
                </label>
                <input 
                  type="text" 
                  className="w-full bg-[#f7f7f7] border-0 rounded-[4px] px-4 py-4 text-[16px] font-normal focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                />
              </div>
              
              <div>
                <label className="block font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-3">
                  {form.fields.email}
                </label>
                <input 
                  type="email" 
                  className="w-full bg-[#f7f7f7] border-0 rounded-[4px] px-4 py-4 text-[16px] font-normal focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                />
              </div>
              
              <div>
                <label className="block font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-3">
                  {form.fields.company}
                </label>
                <input 
                  type="text" 
                  className="w-full bg-[#f7f7f7] border-0 rounded-[4px] px-4 py-4 text-[16px] font-normal focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                />
              </div>
              
              <div>
                <label className="block font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-3">
                  {form.fields.role}
                </label>
                <input 
                  type="text" 
                  className="w-full bg-[#f7f7f7] border-0 rounded-[4px] px-4 py-4 text-[16px] font-normal focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                />
              </div>
              
              <div>
                <label className="block font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-3">
                  {form.fields.message}
                </label>
                <textarea 
                  rows={5}
                  className="w-full bg-[#f7f7f7] border-0 rounded-[4px] px-4 py-4 text-[16px] font-normal focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20 resize-none"
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  className="relative font-ui text-[12px] font-medium tracking-wide uppercase px-6 py-4 rounded-[4px] overflow-hidden"
                >
                  <span className="absolute inset-0 bg-[#1a1a1a] rounded-[4px]"></span>
                  <span className="relative z-10 text-white uppercase-force">{form.button}</span>
                </button>
              </div>
            </form>
          </div>
          
          {/* Info */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="space-y-8">
              
              <p className="text-[15px] md:text-[16px] font-normal leading-[1.15] opacity-50">
                {micro.map((line, index) => (
                  <span key={index} className="block">{line}</span>
                ))}
              </p>
              
              <div className="pt-8">
                <p className="text-[17px] md:text-[18px] font-normal leading-[1.15] mb-4">
                  {info.company}
                </p>
                <p className="text-[15px] md:text-[16px] font-normal leading-[1.15] opacity-60">
                  {info.address.map((line, index) => (
                    <span key={index} className="block">{line}</span>
                  ))}
                </p>
                <p className="text-[15px] md:text-[16px] font-normal leading-[1.15] opacity-60 mt-4">
                  {info.email}
                </p>
              </div>
              
            </div>
          </div>
          
        </div>
      </section>

    </div>
  )
}
