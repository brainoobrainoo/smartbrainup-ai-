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

  // Surface param preservation
  const surface = searchParams.get('surface')
  const buildHref = (href: string) => {
    if (surface) return `${href}?surface=${surface}`
    return href
  }

  // Close menu on route change
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

          {/* Desktop nav — right */}
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

            {/* Auth element */}
            {isAuthenticated && user ? (
              <Link
                href="/client"
                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center
                           text-[10px] font-semibold tracking-[0.04em] cursor-pointer
                           flex-shrink-0 transition-all ${
                  variant === 'dark'
                    ? 'bg-white/10 border border-white/15 text-white hover:bg-white/[0.18] hover:border-white/30'
                    : 'bg-black/[0.06] border border-black/10 text-[#1a1a1a] hover:bg-black/[0.12] hover:border-black/20'
                }`}
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

          {/* Mobile — burger or avatar circle */}
          <div className="md:hidden absolute right-10">
            {isAuthenticated && user && !menuOpen ? (
              <button
                onClick={() => setMenuOpen(true)}
                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center
                           text-[10px] font-semibold tracking-[0.04em] cursor-pointer
                           transition-all ${
                  variant === 'dark'
                    ? 'bg-white/10 border border-white/15 text-white hover:bg-white/[0.18]'
                    : 'bg-black/[0.06] border border-black/10 text-[#1a1a1a] hover:bg-black/[0.12]'
                }`}
              >
                {getInitials(user)}
              </button>
            ) : (
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
            )}
          </div>
        </div>

        {/* Mobile dropdown */}
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

              {/* Auth element — mobile */}
              <div
                className={`h-px my-1 ${
                  variant === 'dark' ? 'bg-white/[0.06]' : 'bg-black/[0.06]'
                }`}
              />
              {isAuthenticated ? (
                <Link
                  href="/client"
                  className={`font-ui text-[13px] ${textColor} font-normal
                             opacity-50 hover:opacity-80 transition-opacity`}
                  onClick={() => setMenuOpen(false)}
                >
                  client area
                </Link>
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
