'use client'

// app/smartbrainup-ai/thank-you/page.tsx

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { useTheme } from '@/lib/ThemeContext'
import Container from '@/components/layout/Container'
import Lottie from 'lottie-react'
import sphereAnimation from '../../../public/animations/SFERA_LOGO_B.json'
import sphereAnimationLight from '../../../public/animations/SFERA_LOGO_B_bianco.json'

const PLAN_LABELS: Record<string, { brains: number; label: string }> = {
  single:       { brains: 1,  label: '1 Second Brain' },
  team:         { brains: 3,  label: '3 Second Brains' },
  department:   { brains: 5,  label: '5 Second Brains' },
  organization: { brains: 10, label: '10 Second Brains' },
}

function ThankYouContent() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'single'
  const planInfo = PLAN_LABELS[plan] || PLAN_LABELS.single
  const [hasPhase1, setHasPhase1] = useState(false)

  useEffect(() => {
    try {
      const data = localStorage.getItem('phase1_results')
      setHasPhase1(!!data)
    } catch {
      setHasPhase1(false)
    }
  }, [])

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-[#252525] text-white' : 'bg-white text-[#1a1a1a]'}`}>
      <Container>
        <div className="flex flex-col items-center text-center py-24 md:py-32">

          <div className="mb-10">
            <Lottie
              animationData={isDark ? sphereAnimation : sphereAnimationLight}
              loop={true}
              className="w-[55px] h-[55px] md:w-[75px] md:h-[75px]"
            />
          </div>

          <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-40 mb-8">
            AI-UP Second Brain™
          </p>

          <h1 className="text-[28px] md:text-[40px] font-normal leading-[1.05] tracking-[-0.01em] mb-5">
            Purchase confirmed.
          </h1>

          <p className={`text-[16px] md:text-[18px] font-normal leading-[1.5] mb-3 ${isDark ? 'opacity-60' : 'opacity-50'}`}>
            {planInfo.label} — ready to be configured.
          </p>

          <p className={`text-[15px] md:text-[16px] font-normal leading-[1.6] max-w-[420px] mb-14 ${isDark ? 'opacity-40' : 'opacity-40'}`}>
            {hasPhase1
              ? 'Your purchase is confirmed. Continue where you left off.'
              : `Your Second ${planInfo.brains === 1 ? 'Brain is' : 'Brains are'} waiting in your dashboard. Create your account to access and configure ${planInfo.brains === 1 ? 'it' : 'them'} whenever you are ready.`
            }
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {hasPhase1 ? (
              <Link
                href="/start?checkout=success"
                className={`px-8 py-3.5 rounded-full text-[13px] font-medium tracking-wide uppercase transition-all duration-200 no-underline ${isDark ? 'bg-white text-[#1a1a1a] hover:bg-white/90' : 'bg-[#1a1a1a] text-white hover:bg-[#333]'}`}
              >
                Continue
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-8 py-3.5 rounded-full text-[13px] font-medium tracking-wide uppercase transition-all duration-200 no-underline ${isDark ? 'bg-white text-[#1a1a1a] hover:bg-white/90' : 'bg-[#1a1a1a] text-white hover:bg-[#333]'}`}
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className={`px-8 py-3.5 rounded-full text-[13px] font-medium tracking-wide uppercase transition-all duration-200 no-underline ${isDark ? 'border border-white/20 text-white/60 hover:text-white hover:border-white/40' : 'border border-black/15 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:border-black/30'}`}
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          <p className={`text-[12px] font-normal mt-14 ${isDark ? 'opacity-25' : 'opacity-30'}`}>
            Check your email for a confirmation from Stripe.
          </p>

        </div>
      </Container>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  )
}
