'use client'

import { useState, useEffect, useRef } from 'react'

type DeviceType = 'chrome-installable' | 'ios-safari' | 'other'

interface InstallBannerProps {
  brainId: string
  brainName: string
}

export default function InstallBanner({ brainId, brainName }: InstallBannerProps) {
  const [visible, setVisible] = useState(false)
  const [device, setDevice] = useState<DeviceType>('other')
  const [installing, setInstalling] = useState(false)
  const [installed, setInstalled] = useState(false)
  const deferredPrompt = useRef<any>(null)

  useEffect(() => {
    const key = `install-banner-dismissed-${brainId}`
    if (localStorage.getItem(key)) return

    // Detect device
    const ua = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(ua)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as any).standalone === true

    // Already installed as PWA — don't show
    if (isStandalone) return

    if (isIOS) {
      setDevice('ios-safari')
      setTimeout(() => setVisible(true), 1200)
      return
    }

    // Listen for Chrome/Edge install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e
      setDevice('chrome-installable')
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // If no prompt fires within 3 seconds, show fallback
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt.current) {
        setDevice('other')
        setVisible(true)
      }
    }, 3000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(fallbackTimer)
    }
  }, [brainId])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(`install-banner-dismissed-${brainId}`, 'true')
  }

  const handleInstall = async () => {
    if (!deferredPrompt.current) return
    setInstalling(true)
    deferredPrompt.current.prompt()
    const result = await deferredPrompt.current.userChoice
    if (result.outcome === 'accepted') {
      setInstalled(true)
      setTimeout(dismiss, 2000)
    }
    setInstalling(false)
    deferredPrompt.current = null
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[998] bg-black/40 transition-opacity duration-300"
        onClick={dismiss}
      />

      {/* Banner */}
      <div className="fixed z-[999] left-0 right-0 bottom-0 flex justify-center px-4 pb-6"
           style={{ animation: 'installSlideUp 0.4s ease-out' }}>
        <div className="bg-white rounded-[16px] w-full max-w-[420px] overflow-hidden shadow-2xl">

          {/* Top accent */}
          <div className="h-[4px] bg-gradient-to-r from-[#1a1a1a] to-[#555]" />

          <div className="p-6">

            {/* ==================== */}
            {/* PATH 1: Chrome/Edge — auto install */}
            {/* ==================== */}
            {device === 'chrome-installable' && !installed && (
              <>
                <h3 className="text-[20px] font-semibold text-[#1a1a1a] leading-tight mb-1">
                  Install your Second Brain
                </h3>
                <p className="text-[15px] text-black/50 mb-6">
                  Add <strong className="text-black/70">{brainName}</strong> to your device.
                  Open it anytime with one tap — like a native app.
                </p>

                <button
                  onClick={handleInstall}
                  disabled={installing}
                  className="w-full py-3.5 bg-[#1a1a1a] text-white rounded-[10px]
                             text-[15px] font-medium
                             border-0 cursor-pointer hover:bg-[#333] transition-colors
                             disabled:opacity-50 disabled:cursor-wait"
                >
                  {installing ? 'Installing...' : 'Install'}
                </button>

                <button
                  onClick={dismiss}
                  className="w-full mt-2 py-2 text-[14px] text-black/40
                             bg-transparent border-0 cursor-pointer hover:text-black/60 transition-colors"
                >
                  Not now
                </button>
              </>
            )}

            {/* Installed confirmation */}
            {device === 'chrome-installable' && installed && (
              <div className="py-4 text-center">
                <div className="text-[32px] mb-3">✓</div>
                <h3 className="text-[20px] font-semibold text-[#1a1a1a] mb-1">Installed</h3>
                <p className="text-[15px] text-black/50">
                  {brainName} is now on your device.
                </p>
              </div>
            )}

            {/* ==================== */}
            {/* PATH 2: iOS Safari — manual guide */}
            {/* ==================== */}
            {device === 'ios-safari' && (
              <>
                <h3 className="text-[20px] font-semibold text-[#1a1a1a] leading-tight mb-1">
                  Add to Home Screen
                </h3>
                <p className="text-[15px] text-black/50 mb-5">
                  Open <strong className="text-black/70">{brainName}</strong> with one tap, like an app.
                </p>

                <div className="space-y-4 mb-6">
                  {/* Step 1 */}
                  <div className="flex gap-3.5 items-start">
                    <span className="flex-shrink-0 w-[32px] h-[32px] rounded-full bg-[#1a1a1a]
                                     text-white text-[14px] font-semibold
                                     flex items-center justify-center">
                      1
                    </span>
                    <p className="text-[16px] leading-[1.5] text-[#1a1a1a]/70 pt-[4px]">
                      Tap the <strong>Share</strong> button
                      <span className="inline-flex items-center justify-center ml-1.5 w-[28px] h-[28px] bg-[#f2f2f2] rounded-[8px] align-middle">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                          <polyline points="16 6 12 2 8 6"/>
                          <line x1="12" y1="2" x2="12" y2="15"/>
                        </svg>
                      </span>
                      {' '}at the bottom of Safari
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-3.5 items-start">
                    <span className="flex-shrink-0 w-[32px] h-[32px] rounded-full bg-[#1a1a1a]
                                     text-white text-[14px] font-semibold
                                     flex items-center justify-center">
                      2
                    </span>
                    <p className="text-[16px] leading-[1.5] text-[#1a1a1a]/70 pt-[4px]">
                      Scroll down and tap <strong>Add to Home Screen</strong>
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-3.5 items-start">
                    <span className="flex-shrink-0 w-[32px] h-[32px] rounded-full bg-[#1a1a1a]
                                     text-white text-[14px] font-semibold
                                     flex items-center justify-center">
                      3
                    </span>
                    <p className="text-[16px] leading-[1.5] text-[#1a1a1a]/70 pt-[4px]">
                      Tap <strong>Add</strong> — done
                    </p>
                  </div>
                </div>

                <button
                  onClick={dismiss}
                  className="w-full py-3.5 bg-[#1a1a1a] text-white rounded-[10px]
                             text-[15px] font-medium
                             border-0 cursor-pointer hover:bg-[#333] transition-colors"
                >
                  Got it
                </button>

                <button
                  onClick={dismiss}
                  className="w-full mt-2 py-2 text-[14px] text-black/40
                             bg-transparent border-0 cursor-pointer hover:text-black/60 transition-colors"
                >
                  Don't show again
                </button>
              </>
            )}

            {/* ==================== */}
            {/* PATH 3: Other browsers — fallback */}
            {/* ==================== */}
            {device === 'other' && (
              <>
                <h3 className="text-[20px] font-semibold text-[#1a1a1a] leading-tight mb-1">
                  Quick access to your Second Brain
                </h3>
                <p className="text-[15px] text-black/50 mb-5">
                  For the best experience, open this page in <strong className="text-black/70">Google Chrome</strong> to install <strong className="text-black/70">{brainName}</strong> as an app.
                </p>
                <p className="text-[14px] text-black/40 mb-5">
                  You can also bookmark this page for quick access.
                </p>

                <button
                  onClick={dismiss}
                  className="w-full py-3.5 bg-[#1a1a1a] text-white rounded-[10px]
                             text-[15px] font-medium
                             border-0 cursor-pointer hover:bg-[#333] transition-colors"
                >
                  Got it
                </button>

                <button
                  onClick={dismiss}
                  className="w-full mt-2 py-2 text-[14px] text-black/40
                             bg-transparent border-0 cursor-pointer hover:text-black/60 transition-colors"
                >
                  Don't show again
                </button>
              </>
            )}

          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes installSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}
