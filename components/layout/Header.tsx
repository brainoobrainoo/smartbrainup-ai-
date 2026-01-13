'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="w-full bg-[#252525]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
        <Link href="/" className="font-editorial text-[18px] font-normal text-white tracking-[-0.01em]">
          smartbrainup
        </Link>
        
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/method" className="font-ui text-[13px] font-medium text-white opacity-80 hover:opacity-100 transition-opacity">
            method
          </Link>
          <Link href="/licensing" className="font-ui text-[13px] font-medium text-white opacity-80 hover:opacity-100 transition-opacity">
            licensing
          </Link>
          <Link href="/enterprise" className="font-ui text-[13px] font-medium text-white opacity-80 hover:opacity-100 transition-opacity">
            enterprise
          </Link>
          <Link href="/contact" className="font-ui text-[13px] font-medium text-white opacity-80 hover:opacity-100 transition-opacity">
            contact
          </Link>
        </nav>

        {/* Burger button */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-8 h-8"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[1px] bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`}></span>
          <span className={`block w-5 h-[1px] bg-white mt-[5px] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`}></span>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden bg-[#252525] border-t border-white/10 px-6 py-6">
          <div className="flex flex-col gap-4">
            <Link href="/method" className="font-ui text-[13px] font-medium text-white opacity-80 hover:opacity-100 transition-opacity" onClick={() => setMenuOpen(false)}>
              method
            </Link>
            <Link href="/licensing" className="font-ui text-[13px] font-medium text-white opacity-80 hover:opacity-100 transition-opacity" onClick={() => setMenuOpen(false)}>
              licensing
            </Link>
            <Link href="/enterprise" className="font-ui text-[13px] font-medium text-white opacity-80 hover:opacity-100 transition-opacity" onClick={() => setMenuOpen(false)}>
              enterprise
            </Link>
            <Link href="/contact" className="font-ui text-[13px] font-medium text-white opacity-80 hover:opacity-100 transition-opacity" onClick={() => setMenuOpen(false)}>
              contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
