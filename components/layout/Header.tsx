'use client'

import Link from 'next/link'
import { useState } from 'react'

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

  const bgColor = variant === 'dark' ? 'bg-[#252525]' : 'bg-white'
  const textColor = variant === 'dark' ? 'text-white' : 'text-[#1a1a1a]'
  const borderColor = variant === 'dark' ? 'border-white/10' : 'border-[#e8e8e8]'
  const lineColor = variant === 'dark' ? 'bg-white' : 'bg-[#1a1a1a]'

  return (
    <header className={`w-full ${bgColor}`}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
        <Link href="/" className={`font-editorial text-[18px] font-normal ${textColor} tracking-[-0.01em]`}>
          {logo}
        </Link>
        
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`font-ui text-[13px] font-medium ${textColor} opacity-80 hover:opacity-100 transition-opacity`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Burger button */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-8 h-8"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[1px] ${lineColor} transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`}></span>
          <span className={`block w-5 h-[1px] ${lineColor} mt-[5px] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`}></span>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className={`md:hidden ${bgColor} border-t ${borderColor} px-6 py-6`}>
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`font-ui text-[13px] font-medium ${textColor} opacity-80 hover:opacity-100 transition-opacity`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
