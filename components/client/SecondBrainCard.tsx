'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { SecondBrain } from '@/content/smartbrainup-ai/client'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const CARD_COLORS: { key: string; from: string; to: string }[] = [
  { key: 'slate', from: '#c8cfd8', to: '#8f99a8' },
  { key: 'ocean', from: '#d0dde6', to: '#9bb4c4' },
  { key: 'sage', from: '#bcc0a8', to: '#8a9070' },
  { key: 'sand', from: '#ebe0a0', to: '#d0c078' },
  { key: 'rose', from: '#b47575', to: '#945c5c' },
  { key: 'lavender', from: '#4d6578', to: '#2d3f4e' },
  { key: 'charcoal', from: '#6a6a6a', to: '#3a3a3a' },
]

const SPHERE_ANIMATIONS = [
  '/animations/sfera_cards_01.json',
  '/animations/sfera_cards_02.json',
  '/animations/sfera_cards_03.json',
]

// Cycle through spheres — guaranteed different for each brain
function getSphereIndex(brain: { num: string; id: any }): number {
  const n = parseInt(brain.num, 10)
  if (!isNaN(n)) return (n - 1) % SPHERE_ANIMATIONS.length
  // fallback: use id string
  let sum = 0
  const id = String(brain.id)
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i)
  return sum % SPHERE_ANIMATIONS.length
}

function getGradient(colorKey: string) {
  const c = CARD_COLORS.find((c) => c.key === colorKey) || CARD_COLORS.find((c) => c.key === 'charcoal') || CARD_COLORS[0]
  return `linear-gradient(to bottom, ${c.from} 0%, ${c.to} 100%)`
}

interface SecondBrainCardProps {
  brain: SecondBrain
  onOpen: (brain: SecondBrain) => void
  onRename?: (brainId: string, newName: string) => Promise<void>
  onColorChange?: (brainId: string, color: string) => Promise<void>
}

export default function SecondBrainCard({ brain, onOpen, onRename, onColorChange }: SecondBrainCardProps) {
  const [sphereData, setSphereData] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(brain.name)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const sphereIdx = getSphereIndex(brain)
    console.log(`[Sphere] brain.num="${brain.num}" brain.id="${brain.id}" → index=${sphereIdx} → ${SPHERE_ANIMATIONS[sphereIdx]}`)
    fetch(SPHERE_ANIMATIONS[sphereIdx])
      .then((r) => r.json())
      .then(setSphereData)
      .catch(() => {})
  }, [brain.num, brain.id])

  const isLight = !['charcoal', 'rose', 'lavender'].includes(brain.cardColor)
  const textPrimary = isLight ? 'text-[#1a1a1a]' : 'text-white'
  const textSecondary = isLight ? 'text-black/50' : 'text-white/50'
  const textBody = isLight ? 'text-black/60' : 'text-white/60'
  const borderColor = isLight ? 'border-black/[0.15]' : 'border-white/[0.2]'

  const handleSave = async () => {
    if (!editName.trim()) return
    setSaving(true)
    if (onRename && editName.trim() !== brain.name) {
      await onRename(brain.id, editName.trim())
    }
    setSaving(false)
    setEditing(false)
  }

  const handleColorSelect = async (colorKey: string) => {
    if (onColorChange) {
      await onColorChange(brain.id, colorKey)
    }
  }

  if (editing) {
    return (
      <div
        className="rounded-[12px] p-6 flex flex-col"
        style={{ background: getGradient(brain.cardColor) }}
      >
        {/* Name input */}
        <p className={`font-ui text-[10px] font-medium tracking-widest uppercase ${textSecondary} mb-2`}>
          Rename
        </p>
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
          autoFocus
          className={`text-[18px] font-normal border-0 border-b ${borderColor}
                     bg-transparent outline-none w-full rounded-none ${textPrimary} mb-6`}
        />

        {/* Color picker */}
        <p className={`font-ui text-[10px] font-medium tracking-widest uppercase ${textSecondary} mb-3`}>
          Color
        </p>
        <div className="flex gap-2 mb-auto">
          {CARD_COLORS.map((c) => (
            <button
              key={c.key}
              onClick={() => handleColorSelect(c.key)}
              className="w-[28px] h-[28px] rounded-full border-0 cursor-pointer transition-transform hover:scale-110"
              style={{
                background: c.from,
                boxShadow: brain.cardColor === c.key ? '0 0 0 2px #1a1a1a, 0 0 0 4px white' : 'none',
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex-1 py-2.5 ${isLight ? 'bg-[#1a1a1a]/[0.08] hover:bg-[#1a1a1a]/[0.15] text-[#1a1a1a]/60' : 'bg-white/[0.1] hover:bg-white/[0.18] text-white/70'}
                       rounded-[4px] font-ui text-[10px] font-medium tracking-widest
                       uppercase border-0 cursor-pointer transition-colors`}
          >
            {saving ? '...' : 'Save'}
          </button>
          <button
            onClick={() => { setEditing(false); setEditName(brain.name) }}
            className={`flex-1 py-2.5 ${isLight ? 'bg-[#1a1a1a]/[0.06] hover:bg-[#1a1a1a]/[0.12] text-[#1a1a1a]/50' : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/50'}
                       rounded-[4px] font-ui text-[10px] font-medium tracking-widest
                       uppercase border-0 cursor-pointer transition-colors`}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-[12px] p-6 h-[220px] md:h-[88px] overflow-hidden flex flex-col md:flex-row md:items-center gap-4 md:gap-6
                 text-left transition-all duration-200
                 relative border-0"
      style={{ background: getGradient(brain.cardColor) }}
    >
      {/* Sphere */}
      <div className="flex-shrink-0">
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

      {/* Text — label, name, context, platforms */}
      <div className="flex-1 min-w-0">
        <p className={`font-ui text-[11px] font-medium tracking-widest uppercase ${textSecondary} mb-1`}>
          Second Brain {brain.num}
        </p>
        <h3 className={`text-[20px] font-normal tracking-[-0.01em] truncate ${textPrimary} mb-1`}>
          {brain.name}
        </h3>
        {brain.context && (
          <p className={`text-[14px] leading-[1.4] ${textBody} mb-2`}>
            {brain.context.length > 120
              ? brain.context.slice(0, 120) + '…'
              : brain.context}
          </p>
        )}
        {brain.platforms.length > 0 && (
          <div className="flex gap-1.5">
            {brain.platforms.map((p) => (
              <span
                key={p}
                className={`font-ui text-[10px] font-medium tracking-[0.06em]
                           uppercase px-2.5 py-0.5 border ${borderColor}
                           rounded-[3px] ${textSecondary}`}
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons — right side */}
      <div className="flex gap-3 w-full md:w-auto md:flex-shrink-0">
        <button
          onClick={() => onOpen(brain)}
          className={`flex-1 md:flex-none md:w-[169px] py-2.5 px-6 ${isLight ? 'bg-[#1a1a1a]/[0.08] hover:bg-[#1a1a1a]/[0.15] text-[#1a1a1a]/60' : 'bg-white/[0.1] hover:bg-white/[0.18] text-white/70'}
                     rounded-[4px] font-ui text-[10px] font-medium tracking-widest
                     uppercase border-0 cursor-pointer transition-colors`}
        >
          Open
        </button>
        <button
          onClick={() => { setEditing(true); setEditName(brain.name) }}
          className={`flex-1 md:flex-none md:w-[169px] py-2.5 px-6 ${isLight ? 'bg-[#1a1a1a]/[0.06] hover:bg-[#1a1a1a]/[0.12] text-[#1a1a1a]/50' : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/50'}
                     rounded-[4px] font-ui text-[10px] font-medium tracking-widest
                     uppercase border-0 cursor-pointer transition-colors`}
        >
          Edit
        </button>
      </div>
    </div>
  )
}
