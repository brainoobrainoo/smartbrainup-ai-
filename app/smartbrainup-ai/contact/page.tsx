'use client'

// app/smartbrainup-ai/contact/page.tsx

import { useEffect, useState } from 'react'
import { contactContent } from '@/content/smartbrainup-ai/contact'

export default function ContactPage() {
  const { hero, form, info, note } = contactContent

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
      
      {/* Hero */}
      <section className="relative max-w-[1200px] mx-auto px-6 md:px-8 pt-20 md:pt-32 pb-24 md:pb-32">
        
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
          
          <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] max-w-[480px] opacity-70">
            {hero.description}
          </p>
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
              
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50">
                {note}
              </p>
              
              <div className="pt-8 border-t border-[#e8e8e8]">
                <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] mb-2">
                  {info.company}
                </p>
                <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] opacity-60">
                  {info.address}
                </p>
                <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] opacity-60 mt-4">
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
