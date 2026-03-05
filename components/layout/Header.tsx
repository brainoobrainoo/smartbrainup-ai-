'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAuth, signOut } from '@/lib/useAuth'

function getInitials(user: any): string {
  const name = user?.user_metadata?.full_name || user?.email || ''
  if (name.includes('@')) return name[0].toUpperCase()
  return name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
}

type NavLink = {
  label: string
  href: string
}

type HeaderProps = {
  logo: string
  links: NavLink[]
  variant?: 'dark' | 'light'
  theme?: 'dark' | 'light'
  onThemeToggle?: () => void
}

const SunIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

export default function Header({ logo, links, variant = 'dark', theme, onThemeToggle }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isAuthenticated, user } = useAuth()
  const headerRef = useRef<HTMLElement>(null)

  const surface = searchParams.get('surface')
  const buildHref = (href: string) => {
    if (surface) return `${href}?surface=${surface}`
    return href
  }

  // Close on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Close on click outside
  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const bgColor = variant === 'dark' ? 'bg-[#252525]' : 'bg-white'
  const textColor = variant === 'dark' ? 'text-white' : 'text-[#1a1a1a]'
  const borderColor = variant === 'dark' ? 'border-white/10' : 'border-[#e8e8e8]'
  const lineColor = variant === 'dark' ? 'bg-white' : 'bg-[#1a1a1a]'

  const isActive = (href: string) => pathname === href

  return (
    <>
      <header ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 w-full ${bgColor}`}>
        <div className="max-w-[880px] mx-auto px-10 xl:px-12 py-5 flex items-center justify-center xl:justify-between relative">

          {/* ═══ MOBILE LEFT: Avatar (logged in) ═══ */}
          {isAuthenticated && user && (
            <Link
              href="/client"
              className={`xl:hidden absolute left-10 w-[35px] h-[35px] rounded-full
                         flex items-center justify-center
                         text-[11px] font-semibold tracking-[0.04em]
                         cursor-pointer flex-shrink-0 no-underline
                         ${variant === 'dark' ? 'bg-white text-[#252525]' : 'bg-[#252525] text-white'}`}
            >
              {getInitials(user)}
            </Link>
          )}

          {/* Logo — centered mobile, left desktop */}
          <Link
            href={buildHref('/')}
            className={`font-editorial text-[18px] font-normal ${textColor} tracking-[-0.01em]`}
            style={{ touchAction: 'manipulation', padding: '8px 4px', margin: '-8px -4px' }}
          >
            {logo}
          </Link>

          {/* ═══ DESKTOP NAV — right ═══ */}
          <nav className="hidden xl:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={buildHref(link.href)}
                className={`font-ui text-[13px] ${textColor} transition-opacity ${
                  isActive(link.href)
                    ? 'font-medium opacity-100'
                    : 'font-normal opacity-50 hover:opacity-80'
                }`}
              >
                {link.label.toLowerCase()}
              </Link>
            ))}

            {/* Desktop theme toggle — same opacity as nav links */}
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                className={`flex items-center justify-center ${textColor} opacity-60 hover:opacity-90 transition-opacity`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
            )}

            {/* Desktop auth element */}
            {isAuthenticated && user ? (
              <Link
                href="/client"
                className={`w-[35px] h-[35px] rounded-full
                           flex items-center justify-center
                           text-[11px] font-semibold tracking-[0.04em]
                           cursor-pointer flex-shrink-0 no-underline
                           hover:opacity-90 transition-opacity
                           ${variant === 'dark' ? 'bg-white text-[#252525]' : 'bg-[#252525] text-white'}`}
              >
                {getInitials(user)}
              </Link>
            ) : (
              <Link
                href="/login"
                className={`font-ui text-[13px] ${textColor} font-normal
                           opacity-35 hover:opacity-65 transition-opacity`}
              >
                sign in
              </Link>
            )}
          </nav>

          {/* ═══ MOBILE RIGHT: Burger only ═══ */}
          <div className="xl:hidden absolute right-10">
            <button
              className="flex flex-col justify-center items-center w-8 h-8"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-[1px] ${lineColor} transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-[3px]' : ''
                }`}
              />
              <span
                className={`block w-5 h-[1px] ${lineColor} mt-[5px] transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-[3px]' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* ═══ MOBILE DROPDOWN ═══ */}
        {menuOpen && (
          <nav
            className={`xl:hidden border-t ${borderColor} px-10 py-6`}
            style={{
              background: variant === 'light'
                ? 'linear-gradient(to bottom, #ffffff 0%, #e8e8e8 100%)'
                : '#252525',
              position: 'relative',
              zIndex: 100,
            }}
          >
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={buildHref(link.href)}
                  className={`font-ui text-[13px] ${textColor} transition-opacity ${
                    isActive(link.href)
                      ? 'font-medium opacity-100'
                      : 'font-normal opacity-50 hover:opacity-80'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label.toLowerCase()}
                </Link>
              ))}

              {/* Divider */}
              <div
                className={`h-px my-1 ${
                  variant === 'dark' ? 'bg-white/[0.06]' : 'bg-black/[0.06]'
                }`}
              />

              {/* Theme toggle — before sign in/out */}
              {onThemeToggle && (
                <button
                  onClick={() => {
                    onThemeToggle()
                    setMenuOpen(false)
                  }}
                  className={`font-ui text-[13px] ${textColor} font-normal
                             opacity-50 hover:opacity-80 transition-opacity
                             bg-transparent border-0 text-left cursor-pointer p-0`}
                >
                  {theme === 'dark' ? 'light' : 'dark'}
                </button>
              )}

              {/* Sign in or Sign out */}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    signOut()
                  }}
                  className={`font-ui text-[13px] ${textColor} font-normal
                             opacity-35 hover:opacity-65 transition-opacity
                             bg-transparent border-0 text-left cursor-pointer p-0`}
                >
                  sign out
                </button>
              ) : (
                <Link
                  href="/login"
                  className={`font-ui text-[13px] ${textColor} font-normal
                             opacity-35 hover:opacity-65 transition-opacity`}
                  onClick={() => setMenuOpen(false)}
                >
                  sign in
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>

    </>
  )
}
