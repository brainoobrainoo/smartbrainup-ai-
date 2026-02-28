'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NavigationOverlay() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)

  // Hide overlay when new page loads
  useEffect(() => {
    setShow(false)
  }, [pathname])

  // Intercept all internal link clicks → show dark overlay instantly
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null
      if (!link) return
      // Only internal links (same origin, not external, not anchor)
      const href = link.getAttribute('href')
      if (!href) return
      if (href.startsWith('http') && !href.startsWith(window.location.origin)) return
      if (href.startsWith('#')) return
      // Same page link — skip
      if (href === pathname) return
      setShow(true)
    }
    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [pathname])

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#252525',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    />
  )
}
