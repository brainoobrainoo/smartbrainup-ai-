'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export default function BrainooHome() {
  const [logoAnimation, setLogoAnimation] = useState(null)
  const [bgAnimation, setBgAnimation] = useState(null)
  const [showFirst, setShowFirst] = useState(false)
  const [showSecond, setShowSecond] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    
    // Carica logo subito
    fetch('/animations/SFERA_LOGO_B.json')
      .then(res => res.json())
      .then(data => setLogoAnimation(data))
    
    // Carica neuroni con ritardo su mobile
    const delay = window.innerWidth < 768 ? 500 : 0
    setTimeout(() => {
      fetch('/animations/NEURONI_20.json')
        .then(res => res.json())
        .then(data => setBgAnimation(data))
    }, delay)

    const timerFirst = setTimeout(() => setShowFirst(true), 100)
    const timerSecond = setTimeout(() => setShowSecond(true), 600)

    return () => {
      clearTimeout(timerFirst)
      clearTimeout(timerSecond)
    }
  }, [])

  return (
    <div className="relative">
      
      {/* Neuroni fissi */}
      {bgAnimation && (
        <div 
          className="fixed inset-0 z-0"
          style={{
            width: 'max(105vw, 186.67vh)',
            height: 'max(105vh, 59.06vw)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Lottie
            animationData={bgAnimation}
            loop={true}
            autoplay={true}
            style={{
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      )}

      {/* Gradient nebbia */}
      <div 
        className="absolute top-0 left-0 right-0 z-[1] pointer-events-none"
        style={{
          height: '300vh',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.9) 100%)'
        }}
      />

      {/* Contenuto */}
      <div className="relative z-10">
        
        {/* Hero Section */}
        <section className="min-h-screen w-full">
          
          <header className="fixed top-0 left-0 right-0 z-20 px-6 md:px-8 py-6">
            <div className="relative max-w-[1200px] mx-auto flex items-center justify-end">
              
              {/* Logo sfera centrato assoluto */}
              <div className="absolute left-1/2 -translate-x-1/2 w-[47px] h-[47px] md:w-14 md:h-14">
                {logoAnimation && (
                  <Lottie
                    animationData={logoAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
              </div>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-8">
                <span className="font-ui text-[12px] font-medium tracking-wide uppercase text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors cursor-pointer">
                  Method
                </span>
                <span className="font-ui text-[12px] font-medium tracking-wide uppercase text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors cursor-pointer">
                  Pricing
                </span>
              </nav>

              {/* Mobile burger */}
              <button 
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span 
                  className="w-5 h-[2.5px] bg-[#1a1a1a]/70 transition-all duration-300"
                  style={{
                    transform: menuOpen ? 'rotate(45deg) translateY(3.25px)' : 'none'
                  }}
                />
                <span 
                  className="w-5 h-[2.5px] bg-[#1a1a1a]/70 transition-all duration-300"
                  style={{
                    transform: menuOpen ? 'rotate(-45deg) translateY(-3.25px)' : 'none'
                  }}
                />
              </button>

            </div>

            {/* Mobile menu */}
            {menuOpen && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm px-6 py-6">
                <nav className="flex flex-col gap-4">
                  <span className="font-ui text-[14px] font-medium tracking-wide uppercase text-[#1a1a1a]/70">
                    Method
                  </span>
                  <span className="font-ui text-[14px] font-medium tracking-wide uppercase text-[#1a1a1a]/70">
                    Pricing
                  </span>
                </nav>
              </div>
            )}
          </header>

          {/* Testo centrato sotto il logo */}
          <div className="flex flex-col items-center pt-[88px] md:pt-[76px] px-6 md:px-8">
            
            <div className="text-center">
              
              <h1 
                className="text-[42px] md:text-[54px] lg:text-[68px] font-semibold tracking-[-0.02em] text-[#1a1a1a] leading-none"
                style={{ 
                  opacity: showFirst ? 1 : 0.05,
                  transition: 'opacity 3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                brainoo
              </h1>

              <p 
                className="text-[22px] md:text-[24px] lg:text-[28px] font-extralight tracking-[-0.01em] text-[#1a1a1a]/60 leading-none"
                style={{ 
                  marginTop: '0px',
                  opacity: showSecond ? 1 : 0.02,
                  transition: 'opacity 3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                your ai guided
              </p>

              <p 
                className="text-[22px] md:text-[24px] lg:text-[28px] font-extralight tracking-[-0.01em] text-[#1a1a1a]/60 leading-none"
                style={{ 
                  marginTop: '0px',
                  opacity: showSecond ? 1 : 0.02,
                  transition: 'opacity 3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0.2s'
                }}
              >
                describe your situation
              </p>

              <p 
                className="text-[22px] md:text-[24px] lg:text-[28px] font-extralight tracking-[-0.01em] text-[#1a1a1a]/60 leading-none"
                style={{ 
                  marginTop: '0px',
                  opacity: showSecond ? 1 : 0.02,
                  transition: 'opacity 3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0.4s'
                }}
              >
                get clarity
              </p>

            </div>

          </div>

        </section>

        {/* Sezione 2 - Test */}
        <section className="min-h-screen w-full flex items-center justify-center px-6 md:px-8">
          <div className="max-w-[1200px] mx-auto w-full">
            <h2 className="text-[32px] md:text-[48px] font-semibold text-[#1a1a1a]">
              sezione due
            </h2>
            <p className="text-[18px] text-[#1a1a1a]/60 mt-4">
              qui il testo si legge bene perché la nebbia copre i neuroni
            </p>
          </div>
        </section>

        {/* Sezione 3 - Test */}
        <section className="min-h-screen w-full flex items-center justify-center px-6 md:px-8">
          <div className="max-w-[1200px] mx-auto w-full">
            <h2 className="text-[32px] md:text-[48px] font-semibold text-[#1a1a1a]">
              sezione tre
            </h2>
            <p className="text-[18px] text-[#1a1a1a]/60 mt-4">
              neuroni ancora leggermente visibili
            </p>
          </div>
        </section>

      </div>

    </div>
  )
}
