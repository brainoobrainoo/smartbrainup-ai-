'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
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
}

export default function Header({ logo, links, variant = 'dark' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isAuthenticated, user } = useAuth()

  const surface = searchParams.get('surface')
  const buildHref = (href: string) => {
    if (surface) return `${href}?surface=${surface}`
    return href
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const bgColor = variant === 'dark' ? 'bg-[#252525]' : 'bg-white'
  const textColor = variant === 'dark' ? 'text-white' : 'text-[#1a1a1a]'
  const borderColor = variant === 'dark' ? 'border-white/10' : 'border-[#e8e8e8]'
  const lineColor = variant === 'dark' ? 'bg-white' : 'bg-[#1a1a1a]'

  const isActive = (href: string) => pathname === href

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 w-full ${bgColor}`}>
        <div className="max-w-[1200px] mx-auto px-10 md:px-12 py-5 flex items-center justify-center md:justify-between relative">

          {/* ═══ MOBILE LEFT: Avatar (logged in) ═══ */}
          {isAuthenticated && user && (
            <Link
              href="/client"
              className="md:hidden absolute left-10 w-[40px] h-[40px] rounded-full
                         bg-white flex items-center justify-center
                         text-[12px] font-semibold tracking-[0.04em] text-[#1a1a1a]
                         cursor-pointer flex-shrink-0 no-underline"
            >
              {getInitials(user)}
            </Link>
          )}

          {/* Logo — centered mobile, left desktop */}
          <Link
            href={buildHref('/')}
            className={`font-editorial text-[18px] font-normal ${textColor} tracking-[-0.01em]`}
          >
            {logo}
          </Link>

          {/* Desktop — vertical separator */}
          <span
            className={`hidden md:block absolute left-1/2 -translate-x-1/2 w-[1.5px] h-[22px] ${
              variant === 'dark' ? 'bg-white/50' : 'bg-black/50'
            }`}
          />

          {/* ═══ DESKTOP NAV — right ═══ */}
          <nav className="hidden md:flex items-center gap-6">
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

            {/* Desktop auth element */}
            {isAuthenticated && user ? (
              <Link
                href="/client"
                className="w-[40px] h-[40px] rounded-full bg-white
                           flex items-center justify-center
                           text-[12px] font-semibold tracking-[0.04em] text-[#1a1a1a]
                           cursor-pointer flex-shrink-0 no-underline
                           hover:opacity-90 transition-opacity"
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

          {/* ═══ MOBILE RIGHT: Burger (always) ═══ */}
          <div className="md:hidden absolute right-10">
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
          <nav className={`md:hidden ${bgColor} border-t ${borderColor} px-10 py-6`}>
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

              {/* Sign in or Sign out */}
              <div
                className={`h-px my-1 ${
                  variant === 'dark' ? 'bg-white/[0.06]' : 'bg-black/[0.06]'
                }`}
              />
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

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}
