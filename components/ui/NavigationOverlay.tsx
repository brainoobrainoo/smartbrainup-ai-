'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function NavigationOverlay() {
  const pathname = usePathname()

  useEffect(() => {
    const el = document.getElementById('nav-overlay')
    if (el) el.remove()
  }, [pathname])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href.startsWith('#') || href === pathname) return
      if (href.startsWith('http') && !href.startsWith(window.location.origin)) return
      if (document.getElementById('nav-overlay')) return

      const div = document.createElement('div')
      div.id = 'nav-overlay'
      div.style.cssText = 'position:fixed;inset:0;background:#252525;z-index:99999;'
      document.documentElement.appendChild(div)
      // Force synchronous paint — browser MUST render before continuing
      void div.offsetHeight
    }
    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [pathname])

  return null
}
