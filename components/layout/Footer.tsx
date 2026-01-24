// components/layout/Footer.tsx

import Link from 'next/link'
import { footerData } from '@/content/shared/footer'

export default function Footer() {
  return (
    <footer className="w-full bg-[#1a1a1a] text-white py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-10 md:px-12">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          
          {/* Company */}
          <div>
            <p className="font-ui text-[11px] tracking-widest uppercase opacity-40 mb-4">
              {footerData.company.label}
            </p>
            <p className="text-[14px] leading-[1.7] opacity-60">
              {footerData.company.name}
            </p>
            <p className="text-[14px] leading-[1.7] opacity-60">
              {footerData.company.vat}
            </p>
          </div>
          
          {/* Address */}
          <div>
            <p className="font-ui text-[11px] tracking-widest uppercase opacity-40 mb-4">
              {footerData.address.label}
            </p>
            {footerData.address.lines.map((line, index) => (
              <p key={index} className="text-[14px] leading-[1.7] opacity-60">
                {line}
              </p>
            ))}
          </div>
          
          {/* Contact */}
          <div>
            <p className="font-ui text-[11px] tracking-widest uppercase opacity-40 mb-4">
              {footerData.contact.label}
            </p>
            <p className="text-[14px] leading-[1.7] opacity-60">
              {footerData.contact.email}
            </p>
            <p className="text-[14px] leading-[1.7] opacity-60">
              {footerData.contact.pec}
            </p>
          </div>
          
          {/* Legal */}
          <div>
            <p className="font-ui text-[11px] tracking-widest uppercase opacity-40 mb-4">
              {footerData.legal.label}
            </p>
            <div className="text-[14px] leading-[1.7] opacity-60 space-y-1">
              {footerData.legal.links.map((link, index) => (
                <Link 
                  key={index} 
                  href={link.href} 
                  className="block hover:opacity-100 transition-opacity"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="border-t border-white/10 pt-8">
          <p className="font-ui text-[11px] opacity-30">
            {footerData.copyright}
          </p>
        </div>
        
      </div>
    </footer>
  )
}
