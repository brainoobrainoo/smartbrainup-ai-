'use client'

// app/(smartbrainup-ai)/account/page.tsx

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Container from '@/components/layout/Container'

export default function AccountPage() {
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === 'true'

  return (
    <div className="min-h-screen">
      {/* DARK zone */}
      <div className="relative w-full overflow-hidden text-white" style={{ background: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 100%)' }}>
        <section className="relative z-10 pt-20 md:pt-32 pb-16 md:pb-24">
          <Container>
            {/* Badge */}
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase mb-11">
              <span className="opacity-100">AI-UP</span>
              <span className="opacity-50"> SECOND BRAIN™ YOUR ACCOUNT</span>
            </p>

            {/* Main Card */}
            <div 
              className="rounded-[4px] p-8 py-10 md:p-12 md:py-16 mb-11"
              style={{ background: 'linear-gradient(to bottom, #353535 0%, #232323 100%)' }}
            >
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                
                {/* Welcome message if new */}
                {isWelcome && (
                  <div className="mb-8 px-6 py-3 bg-white/10 rounded-[4px]">
                    <p className="text-[15px] text-white/80">Welcome! Your account has been created.</p>
                  </div>
                )}

                {/* Status icon */}
                <div className="w-20 h-20 mb-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>

                {/* Title */}
                <h1 className="text-[28px] md:text-[40px] font-normal leading-[1.1] text-white mb-4">
                  <span className="block">Your Second Brain</span>
                  <span className="block">is being built</span>
                </h1>
                
                {/* Description */}
                <p className="text-[17px] md:text-[18px] font-normal leading-[1.4] text-white opacity-70 max-w-[480px] mb-10">
                  We've received your assessment data. Our team will configure your personal Second Brain and contact you within 24-48 hours.
                </p>

                {/* Status card */}
                <div className="w-full max-w-[400px] p-6 bg-white/[0.03] rounded-[4px] border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[15px] text-white/50">Status</span>
                    <span className="text-[15px] text-white font-medium">In Progress</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-1/4 h-full bg-white/40 rounded-full animate-pulse"></div>
                  </div>
                </div>

              </div>

              {/* Section label */}
              <p className="mt-10 md:mt-14 text-center font-ui text-[11px] font-medium tracking-widest uppercase text-white/40">
                ACCOUNT
              </p>
              
            </div>

            {/* Info text */}
            <div className="text-[17px] md:text-[18px] font-normal leading-[1.15] text-white max-w-[560px] space-y-5">
              <p className="opacity-70">
                <span className="block font-medium">What happens next?</span>
              </p>
              <p className="opacity-70">
                <span className="block">Your assessment responses are being analyzed.</span>
                <span className="block">We'll configure your Second Brain based on your context.</span>
                <span className="block">You'll receive access instructions via email.</span>
              </p>
            </div>

            {/* Back link */}
            <div className="mt-12">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span className="font-ui text-[12px] font-medium tracking-wide uppercase">Back to home</span>
              </Link>
            </div>

          </Container>
        </section>
      </div>
    </div>
  )
}
