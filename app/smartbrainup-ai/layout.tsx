'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { navigationAi } from '@/content/smartbrainup-ai/navigation'
import NavigationOverlay from '@/components/ui/NavigationOverlay'

const ScrollToTop = dynamic(() => import('@/components/ui/ScrollToTop'), { ssr: false })

export default function SmartBrainUpAILayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isChat = pathname.endsWith('/chat')

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#252525' }}>
      
      <NavigationOverlay />

      <Header logo={navigationAi.logo} links={navigationAi.links} />

      {/* Spacer per compensare l'header fixed - non serve su chat */}
      {!isChat && <div className="h-[21px] xl:h-0"></div>}

      <main className="flex-1 relative">
        {children}
      </main>

      {!isChat && <ScrollToTop />}

      {!isChat && <Footer />}

    </div>
  )
}
