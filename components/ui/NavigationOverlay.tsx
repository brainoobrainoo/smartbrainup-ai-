'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function NavigationOverlay() {
  const pathname = usePathname()

  // Remove class when new page loads
  useEffect(() => {
    document.body.classList.remove('navigating')
  }, [pathname])

  // On any internal link click, add class instantly
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href.startsWith('#') || href === pathname) return
      if (href.startsWith('http') && !href.startsWith(window.location.origin)) return
      document.body.classList.add('navigating')
    }
    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [pathname])

  return null
}
