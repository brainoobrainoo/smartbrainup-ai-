// app/smartbrainup-com/ip/page.tsx

import { ipContent } from '@/content/smartbrainup-com/ip'

export default function IPPage() {
  const { hero, promptGenesi, pmf, pmfDynamic, protection, legal } = ipContent

  return (
    <div className="min-h-screen bg-white">
      
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

          {/* Prompt Genesi™ */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-[24px] md:text-[28px] font-normal leading-[1.2] tracking-[-0.01em]">
                {promptGenesi.headline}
              </h2>
              <span className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40">
                {promptGenesi.badge}
              </span>
            </div>
            {promptGenesi.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-[16px] md:text-[17px] font-normal leading-[1.7] opacity-70 mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#e0e0e0] mb-16"></div>

          {/* PMF™ */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-[24px] md:text-[28px] font-normal leading-[1.2] tracking-[-0.01em]">
                {pmf.headline}
              </h2>
              <span className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40">
                {pmf.badge}
              </span>
            </div>
            {pmf.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-[16px] md:text-[17px] font-normal leading-[1.7] opacity-70 mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#e0e0e0] mb-16"></div>

          {/* PMF Dynamic™ */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-[24px] md:text-[28px] font-normal leading-[1.2] tracking-[-0.01em]">
                {pmfDynamic.headline}
              </h2>
              <span className="font-ui text-[10px] font-medium tracking-widest uppercase opacity-40">
                {pmfDynamic.badge}
              </span>
            </div>
            {pmfDynamic.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-[16px] md:text-[17px] font-normal leading-[1.7] opacity-70 mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#e0e0e0] mb-16"></div>

          {/* Protection Framework */}
          <div className="mb-16">
            <h2 className="text-[24px] md:text-[28px] font-normal leading-[1.2] tracking-[-0.01em] mb-8">
              {protection.headline}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {protection.items.map((item, index) => (
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

          {/* Legal Notice */}
          <div>
            <h2 className="text-[24px] md:text-[28px] font-normal leading-[1.2] tracking-[-0.01em] mb-6">
              {legal.headline}
            </h2>
            {legal.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-[15px] md:text-[16px] font-normal leading-[1.7] opacity-60 mb-4">
                {paragraph}
              </p>
            ))}
          </div>

        </section>

      </div>

    </div>
  )
}
