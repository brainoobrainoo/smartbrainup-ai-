'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { navigationAi } from '@/content/smartbrainup-ai/navigation'
import { ThemeContext } from '@/lib/ThemeContext'

const ScrollToTop = dynamic(() => import('@/components/ui/ScrollToTop'), { ssr: false })

export default function SmartBrainUpAILayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isChat = pathname.endsWith('/chat')
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <div className="min-h-screen flex flex-col" style={{ background: theme === 'dark' ? '#252525' : '#ffffff' }}>

      <Header
        logo={navigationAi.logo}
        links={navigationAi.links}
        variant={theme}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      {/* Spacer per compensare l'header fixed - non serve su chat */}
      {!isChat && <div className="h-[21px] xl:h-0"></div>}

      <main className="flex-1 relative">
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>

      {!isChat && <ScrollToTop />}

      {!isChat && <Footer />}

    </div>
    </ThemeContext.Provider>
  )
}
