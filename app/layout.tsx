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
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${crimson.variable} ${inter.variable}`} style={{ background: '#252525' }}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.style.background='#252525';document.body&&(document.body.style.background='#252525');`,
          }}
        />
      </head>
      <body className="font-editorial font-normal">
        {children}
      </body>
    </html>
  )
}
