import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { navigationAi } from '@/content/smartbrainup-ai/navigation'

const ScrollToTop = dynamic(() => import('@/components/ui/ScrollToTop'), { ssr: false })

export default function SmartBrainUpAILayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      
      <Header logo={navigationAi.logo} links={navigationAi.links} />

      {/* Spacer per compensare l'header fixed */}
      <div className="h-[21px] md:h-0"></div>

      <main className="flex-1 relative">
        {children}
      </main>

      <ScrollToTop />

      <Footer />

    </div>
  )
}
