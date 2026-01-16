// app/smartbrainup-com/contact/page.tsx

import { contactContent } from '@/content/smartbrainup-com/contact'

export default function ContactPage() {
  const { hero, form, info, note } = contactContent

  return (
    <div className="min-h-screen bg-white">
      
      <div className="relative w-full">
        
        <section className="max-w-[1000px] mx-auto px-6 md:px-8 pt-24 pb-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left - Hero + Info */}
            <div className="flex flex-col">
              <p className="font-ui text-[11px] font-medium tracking-widest uppercase opacity-50 mb-4">
                {hero.badge}
              </p>
              
              <h1 className="text-[32px] md:text-[42px] font-normal leading-[1.1] tracking-[-0.02em] mb-6">
                {hero.headline}
              </h1>
              
              <p className="text-[17px] md:text-[18px] font-normal leading-[1.6] opacity-70 mb-12">
                {hero.description}
              </p>

              {/* Company Info */}
              <div className="mt-auto">
                <p className="text-[16px] md:text-[17px] font-normal leading-[1.6] opacity-60 mb-4">
                  {info.company}<br />
                  {info.address}
                </p>
                <p className="text-[16px] md:text-[17px] font-normal leading-[1.6] mb-1">{info.email}</p>
                <p className="text-[16px] md:text-[17px] font-normal leading-[1.6] opacity-60">{info.pec}</p>
              </div>
            </div>

            {/* Right - Form */}
            <div className="rounded-[4px] p-8 md:p-10 bg-black/[0.03]">
              <form className="flex flex-col gap-6">
                
                <div>
                  <label className="font-ui text-[10px] tracking-widest uppercase opacity-40 block mb-2">
                    {form.fields.name}
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-white rounded-[4px] px-4 py-3 text-[15px] font-normal outline-none border border-transparent focus:border-[#e0e0e0] transition-colors"
                  />
                </div>

                <div>
                  <label className="font-ui text-[10px] tracking-widest uppercase opacity-40 block mb-2">
                    {form.fields.email}
                  </label>
                  <input 
                    type="email" 
                    className="w-full bg-white rounded-[4px] px-4 py-3 text-[15px] font-normal outline-none border border-transparent focus:border-[#e0e0e0] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-ui text-[10px] tracking-widest uppercase opacity-40 block mb-2">
                      {form.fields.organization}
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-white rounded-[4px] px-4 py-3 text-[15px] font-normal outline-none border border-transparent focus:border-[#e0e0e0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-ui text-[10px] tracking-widest uppercase opacity-40 block mb-2">
                      {form.fields.subject}
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-white rounded-[4px] px-4 py-3 text-[15px] font-normal outline-none border border-transparent focus:border-[#e0e0e0] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-ui text-[10px] tracking-widest uppercase opacity-40 block mb-2">
                    {form.fields.message}
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full bg-white rounded-[4px] px-4 py-3 text-[15px] font-normal outline-none border border-transparent focus:border-[#e0e0e0] transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="self-start font-ui text-[12px] font-medium tracking-wide uppercase px-6 py-4 rounded-[4px] bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] transition-colors mt-2"
                >
                  {form.button}
                </button>

              </form>

              <p className="text-[13px] font-normal leading-[1.5] opacity-40 mt-8">
                {note}
              </p>
            </div>

          </div>

        </section>

      </div>

    </div>
  )
}
