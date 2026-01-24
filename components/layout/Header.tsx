'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

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

  const bgColor = variant === 'dark' ? 'bg-[#252525]' : 'bg-white'
  const textColor = variant === 'dark' ? 'text-white' : 'text-[#1a1a1a]'
  const borderColor = variant === 'dark' ? 'border-white/10' : 'border-[#e8e8e8]'
  const lineColor = variant === 'dark' ? 'bg-white' : 'bg-[#1a1a1a]'

  const isActive = (href: string) => pathname === href

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full ${bgColor}`}>
      <div className="max-w-[1200px] mx-auto px-10 md:px-12 py-5 flex items-center justify-center relative">
        
        {/* Logo centrato */}
        <Link href="/" className={`font-editorial text-[18px] font-normal ${textColor} tracking-[-0.01em]`}>
          {logo}
        </Link>
        
        {/* Desktop nav - posizione assoluta a destra */}
        <nav className="hidden md:flex items-center gap-8 absolute right-12">
          {links.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`font-ui text-[13px] ${textColor} transition-opacity ${
                isActive(link.href) 
                  ? 'font-medium opacity-100' 
                  : 'font-normal opacity-50 hover:opacity-80'
              }`}
            >
              {link.label.toLowerCase()}
            </Link>
          ))}
        </nav>

        {/* Burger button - posizione assoluta a destra */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 absolute right-10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[1px] ${lineColor} transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`}></span>
          <span className={`block w-5 h-[1px] ${lineColor} mt-[5px] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`}></span>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className={`md:hidden ${bgColor} border-t ${borderColor} px-10 py-6`}>
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
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
          </div>
        </nav>
      )}
    </header>
  )
}
