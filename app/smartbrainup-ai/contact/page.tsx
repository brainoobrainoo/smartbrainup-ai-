'use client'

// app/(smartbrainup-ai)/contact/page.tsx

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
      
      {/* Hero + Form - Unified section */}
      <div className="relative w-full overflow-hidden" style={{ background: 'linear-gradient(to bottom, #f5f5f5 0%, #ffffff 100%)' }}>
        
        <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8 pt-32 pb-24">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left - Hero + Info */}
            <div className="flex flex-col">
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-4">
                <span className="opacity-70 uppercase-force">{hero.badge.prefix}</span>
                <span className="opacity-40 uppercase-force"> {hero.badge.name}</span>
                <span className="opacity-40 uppercase-force"> {hero.badge.secondary}</span>
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
              
              <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60 mb-12">
                {hero.description}
              </p>

              {/* Company Info */}
              <div className="mt-auto">
                <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-60 mb-4">
                  {info.company}<br />
                  {info.address}
                </p>
                <p className="text-[17px] md:text-[18px] font-normal leading-[1.5] opacity-100">{info.email}</p>
              </div>
            </div>

            {/* Right - Form */}
            <div 
              className="rounded-[4px] p-8 md:p-10"
              style={{ background: 'linear-gradient(to bottom, #eeeeee 0%, #f3f3f3 100%)' }}
            >
              <form className="flex flex-col gap-6">
                
                <div>
                  <label className="font-ui text-[10px] tracking-widest uppercase opacity-40 block mb-2">
                    {form.fields.name}
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-white/60 rounded-[4px] px-4 py-3 text-[15px] font-normal outline-none focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="font-ui text-[10px] tracking-widest uppercase opacity-40 block mb-2">
                    {form.fields.email}
                  </label>
                  <input 
                    type="email" 
                    className="w-full bg-white/60 rounded-[4px] px-4 py-3 text-[15px] font-normal outline-none focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-ui text-[10px] tracking-widest uppercase opacity-40 block mb-2">
                      {form.fields.company}
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-white/60 rounded-[4px] px-4 py-3 text-[15px] font-normal outline-none focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-ui text-[10px] tracking-widest uppercase opacity-40 block mb-2">
                      {form.fields.role}
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-white/60 rounded-[4px] px-4 py-3 text-[15px] font-normal outline-none focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-ui text-[10px] tracking-widest uppercase opacity-40 block mb-2">
                    {form.fields.message}
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full bg-white/60 rounded-[4px] px-4 py-3 text-[15px] font-normal outline-none focus:bg-white transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="self-start font-ui text-[12px] font-medium tracking-wide uppercase px-6 py-4 rounded-[4px] bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] transition-colors mt-2"
                >
                  {form.button}
                </button>

              </form>

              <p className="text-[13px] font-normal leading-[1.5] opacity-40 mt-8">
                {note}
              </p>
            </div>

          </div>

        </section>

      </div>

    </div>
  )
}
