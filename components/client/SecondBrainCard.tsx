'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { SecondBrain } from '@/content/smartbrainup-ai/client'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface SecondBrainCardProps {
  brain: SecondBrain
  onOpen: (brain: SecondBrain) => void
}

export default function SecondBrainCard({ brain, onOpen }: SecondBrainCardProps) {
  const [sphereData, setSphereData] = useState<any>(null)

  useEffect(() => {
    fetch('/animations/SFERA_LOGO_B_bianco.json')
      .then((r) => r.json())
      .then(setSphereData)
      .catch(() => {})
  }, [])

  return (
    <button
      onClick={() => onOpen(brain)}
      className="rounded-[4px] p-6
                 text-left cursor-pointer transition-all duration-200
                 relative border-0 hover:brightness-[0.96]"
      style={{ background: 'linear-gradient(to bottom, #e0e0e0 0%, #aeaeae 100%)' }}
    >
      {/* Sphere */}
      <div className="mb-4">
        {sphereData ? (
          <Lottie
            animationData={sphereData}
            loop
            autoplay
            style={{ width: 40, height: 40 }}
          />
        ) : (
          <div className="w-[40px] h-[40px] rounded-full bg-black/[0.06]" />
        )}
      </div>

      <p className="font-ui text-[11px] font-medium tracking-widest uppercase text-black/50 mb-2">
        Second Brain {brain.num}
      </p>

      <h3 className="text-[20px] font-normal tracking-[-0.01em] text-[#1a1a1a] mb-2">
        {brain.name}
      </h3>

      <p className="text-[15px] leading-[1.4] text-black/60 mb-4">
        {brain.context.length > 90
          ? brain.context.slice(0, 90) + '…'
          : brain.context}
      </p>

      <div className="flex gap-1.5">
        {brain.platforms.map((p) => (
          <span
            key={p}
            className="font-ui text-[10px] font-medium tracking-[0.06em]
                       uppercase px-2.5 py-0.5 border border-black/[0.15]
                       rounded-[3px] text-black/50"
          >
            {p}
          </span>
        ))}
      </div>
    </button>
  )
}
