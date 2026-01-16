'use client'

// app/smartbrainup-com/page.tsx

import { homeContent } from '@/content/smartbrainup-com/home'

export default function HomePage() {
  const { hero, mission, ip, surfaces, legal } = homeContent

  return (
    <div className="min-h-screen bg-white">
      
      {/* All content - light background */}
      <div className="relative w-full">
        
        <section className="max-w-[900px] mx-auto px-6 md:px-8 pt-24 pb-20">
          
          {/* Hero */}
          <div className="mb-16">
            <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-4">
              {hero.badge}
            </p>
            
            <h1 className="text-[32px] md:text-[42px] font-normal leading-[1.1] tracking-[-0.02em] mb-6">
              {hero.headline}
            </h1>
            
            <p className="text-[17px] md:text-[18px] font-normal leading-[1.6] opacity-70">
              {hero.description}
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#e0e0e0] mb-16"></div>

          {/* Surfaces - Clickable Cards */}
          <div className="mb-16">
            <h2 className="text-[24px] md:text-[28px] font-normal leading-[1.2] tracking-[-0.01em] mb-4">
              {surfaces.headline}
            </h2>
            <p className="text-[16px] md:text-[17px] font-normal leading-[1.7] opacity-70 mb-8">
              {surfaces.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {surfaces.items.map((item, index) => (
                item.comingSoon ? (
                  <div 
                    key={index}
                    className="p-6 rounded-[4px] bg-black/[0.03] opacity-60"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-[17px] md:text-[18px] font-medium leading-[1.3]">
                        {item.name}
                      </h3>
                      <span className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] opacity-60 mb-3">
                      {item.description}
                    </p>
                    <span className="font-ui text-[12px] font-medium tracking-wide opacity-50">
                      Coming Soon
                    </span>
                  </div>
                ) : (
                  <a 
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 rounded-[4px] bg-black/[0.03] hover:bg-black/[0.06] transition-colors group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-[17px] md:text-[18px] font-medium leading-[1.3]">
                        {item.name}
                      </h3>
                      <span className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] opacity-60 mb-3">
                      {item.description}
                    </p>
                    <span className="font-ui text-[12px] font-medium tracking-wide opacity-40 group-hover:opacity-100 transition-opacity">
                      Visit →
                    </span>
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#e0e0e0] mb-16"></div>

          {/* Mission */}
          <div className="mb-16">
            <h2 className="text-[24px] md:text-[28px] font-normal leading-[1.2] tracking-[-0.01em] mb-6">
              {mission.headline}
            </h2>
            {mission.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-[16px] md:text-[17px] font-normal leading-[1.7] opacity-70 mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#e0e0e0] mb-16"></div>

          {/* IP */}
          <div className="mb-16">
            <h2 className="text-[24px] md:text-[28px] font-normal leading-[1.2] tracking-[-0.01em] mb-4">
              {ip.headline}
            </h2>
            <p className="text-[16px] md:text-[17px] font-normal leading-[1.7] opacity-70 mb-8">
              {ip.intro}
            </p>
            
            <div className="space-y-6">
              {ip.items.map((item, index) => (
                <div key={index}>
                  <h3 className="text-[17px] md:text-[18px] font-medium leading-[1.3] mb-2">
                    {item.name}
                  </h3>
                  <p className="text-[15px] md:text-[16px] font-normal leading-[1.7] opacity-60">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#e0e0e0] mb-16"></div>

          {/* Legal */}
          <div>
            <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] opacity-50 mb-1">
              {legal.company}
            </p>
            <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] opacity-50 mb-1">
              {legal.vat}
            </p>
            <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] opacity-50 mb-4">
              {legal.address}
            </p>
            <p className="text-[15px] md:text-[16px] font-normal leading-[1.6]">
              {legal.email}
            </p>
          </div>

        </section>

      </div>

    </div>
  )
}
