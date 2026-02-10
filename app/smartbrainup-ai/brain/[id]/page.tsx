'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { getColorByKey } from '@/lib/cardColors'

export default function BrainPage({ params }: { params: { id: string } }) {
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const router = useRouter()
  const [brain, setBrain] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', parseInt(params.id))
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setBrain(data)
      setLoading(false)

      // Inject dynamic manifest for PWA
      const color = getColorByKey(data.card_color || 'default')
      const name = data.brain_name || 'Second Brain'

      // Remove existing manifest if any
      const existing = document.querySelector('link[rel="manifest"]')
      if (existing) existing.remove()

      const link = document.createElement('link')
      link.rel = 'manifest'
      link.href = `/api/manifest/${params.id}?color=${encodeURIComponent(color.from)}&name=${encodeURIComponent(name)}`
      document.head.appendChild(link)

      // iOS PWA meta tags
      const setMeta = (name: string, content: string) => {
        let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
        if (!el) {
          el = document.createElement('meta')
          el.name = name
          document.head.appendChild(el)
        }
        el.content = content
      }

      setMeta('apple-mobile-web-app-capable', 'yes')
      setMeta('apple-mobile-web-app-status-bar-style', 'default')
      setMeta('apple-mobile-web-app-title', name)
      setMeta('theme-color', color.from)

      // iOS icon
      let appleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement
      if (!appleIcon) {
        appleIcon = document.createElement('link')
        appleIcon.rel = 'apple-touch-icon'
        document.head.appendChild(appleIcon)
      }
      appleIcon.href = `/api/icon/${params.id}?color=${encodeURIComponent(color.from)}&size=180`
    }

    load()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black/40 font-ui text-[11px] tracking-widest uppercase">Loading...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black/40 font-ui text-[11px] tracking-widest uppercase">Brain not found</p>
      </div>
    )
  }

  const color = getColorByKey(brain.card_color || 'default')

  return (
    <div className="min-h-screen bg-white">
      {/* Header bar with brain color */}
      <div
        className="h-[4px] w-full"
        style={{ background: color.from }}
      />

      <div className="max-w-[600px] mx-auto px-6 py-16">
        <p className="font-ui text-[10px] font-medium tracking-widest uppercase text-black/40 mb-3">
          Second Brain
        </p>

        <h1 className="text-[28px] font-normal tracking-[-0.02em] text-[#1a1a1a] mb-6">
          {brain.brain_name || 'Second Brain'}
        </h1>

        <div
          className="rounded-[4px] p-8 text-center"
          style={{ background: `linear-gradient(to bottom, ${color.from}, ${color.to})` }}
        >
          <p className={`text-[15px] leading-[1.5] ${brain.card_color === 'charcoal' ? 'text-white/60' : 'text-black/50'}`}>
            This Second Brain is active
          </p>
          <p className={`text-[13px] mt-2 ${brain.card_color === 'charcoal' ? 'text-white/40' : 'text-black/35'}`}>
            Full experience coming soon
          </p>
        </div>

        {/* Add to Home instruction */}
        <div className="mt-12 text-center">
          <p className="font-ui text-[10px] font-medium tracking-widest uppercase text-black/30 mb-2">
            Add to Home Screen
          </p>
          <p className="text-[14px] leading-[1.5] text-black/45">
            Tap the share button in your browser<br />
            and select &ldquo;Add to Home Screen&rdquo;
          </p>
        </div>

        {/* Back to dashboard */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/client')}
            className="font-ui text-[10px] font-medium tracking-widest uppercase
                       text-black/40 hover:text-black/60 transition-colors
                       border-0 bg-transparent cursor-pointer"
          >
            ← Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
