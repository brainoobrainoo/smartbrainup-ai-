'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function NavigationOverlay() {
  const pathname = usePathname()

  // Remove overlay when new page loads
  useEffect(() => {
    const el = document.getElementById('nav-overlay')
    if (el) el.remove()
  }, [pathname])

  // Intercept clicks — direct DOM, no React state, instant
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null
      if (!link) return
      const href = link.getAttribute('href')
      if (!href) return
      if (href.startsWith('http') && !href.startsWith(window.location.origin)) return
      if (href.startsWith('#') || href === pathname) return
      // Already exists
      if (document.getElementById('nav-overlay')) return
      // Inject overlay directly into DOM — synchronous, zero delay
      const div = document.createElement('div')
      div.id = 'nav-overlay'
      div.style.cssText = 'position:fixed;inset:0;background:#252525;z-index:99999;pointer-events:none;'
      document.body.appendChild(div)
    }
    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [pathname])

  return null
}
