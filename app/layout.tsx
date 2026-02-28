import type { Metadata, Viewport } from 'next'
import { Crimson_Pro, Inter } from 'next/font/google'
import './globals.css'

const crimson = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-crimson',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SmartBrainUp',
  description: 'AI-UP Second Brain™',
  other: {
    'theme-color': '#252525',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#252525',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${crimson.variable} ${inter.variable}`} style={{ background: '#252525' }}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.style.background='#252525';document.documentElement.style.colorScheme='dark';` }} />
        <style dangerouslySetInnerHTML={{ __html: `html,body{background:#252525!important}` }} />
      </head>
      <body className="font-editorial font-normal" style={{ background: '#252525' }}>
        {children}
      </body>
    </html>
  )
}
