import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { navigationCom } from '@/content/smartbrainup-com/navigation'

const ScrollToTop = dynamic(() => import('@/components/ui/ScrollToTop'), { ssr: false })

export default function SmartBrainUpComLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      
      <Header logo={navigationCom.logo} links={navigationCom.links} variant="light" />

      <main className="flex-1 relative">
        {children}
      </main>

      <ScrollToTop />

      <Footer />

    </div>
  )
}
