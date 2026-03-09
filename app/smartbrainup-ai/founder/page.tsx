'use client'

// app/smartbrainup-ai/founder/page.tsx
// Founder Interface — caricamento Prompt Genesi™
// Accesso: solo utenti con role = 'developer'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Brain = {
  id: string
  name: string
  prompt_key: string
  prompt_version: string
  prompt_status: string
  user_id: string
  created_at: string
}

type UploadResult = {
  success: boolean
  brain_id?: string
  prompt_key?: string
  version?: string
  status?: string
  error?: string
}

export default function FounderPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  const [brains, setBrains] = useState<Brain[]>([])
  const [brainsLoading, setBrainsLoading] = useState(false)

  const [selectedBrainId, setSelectedBrainId] = useState('')
  const [promptKey, setPromptKey] = useState('')
  const [promptText, setPromptText] = useState('')
  const [version, setVersion] = useState('')

  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)

  // ── Auth + role check ──
  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'developer') {
        router.replace('/client')
        return
      }

      setAuthorized(true)
      setLoading(false)
    }

    check()
  }, [router])

  // ── Load brains once authorized ──
  useEffect(() => {
    if (!authorized) return

    const fetchBrains = async () => {
      setBrainsLoading(true)
      try {
        const res = await fetch('/api/founder/brains')
        const data = await res.json()
        if (data.brains) setBrains(data.brains)
      } catch {
        // Silent — user sees empty list
      } finally {
        setBrainsLoading(false)
      }
    }

    fetchBrains()
  }, [authorized])

  // ── Auto-fill prompt_key when brain selected ──
  const handleBrainSelect = (id: string) => {
    setSelectedBrainId(id)
    setResult(null)
    const brain = brains.find(b => b.id === id)
    if (brain && brain.prompt_key) {
      setPromptKey(brain.prompt_key)
    } else if (brain) {
      setPromptKey(`pg_${brain.id.slice(0, 8)}`)
    }
  }

  // ── Upload ──
  const handleUpload = async () => {
    if (!selectedBrainId || !promptKey || !promptText.trim() || !version.trim()) return

    setUploading(true)
    setResult(null)

    try {
      const res = await fetch('/api/founder/upload-ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brain_id: selectedBrainId,
          prompt_key: promptKey,
          prompt_text: promptText,
          version: version.trim()
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setResult({ success: true, ...data })
        // Clear prompt text after successful upload — never stays in memory
        setPromptText('')
        // Refresh brain list to show updated status
        const refreshRes = await fetch('/api/founder/brains')
        const refreshData = await refreshRes.json()
        if (refreshData.brains) setBrains(refreshData.brains)
      } else {
        setResult({ success: false, error: data.error || 'Upload failed' })
      }
    } catch {
      setResult({ success: false, error: 'Network error' })
    } finally {
      setUploading(false)
    }
  }

  const selectedBrain = brains.find(b => b.id === selectedBrainId)
  const canUpload = selectedBrainId && promptKey && promptText.trim() && version.trim() && !uploading

  // ── Loading / auth ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-white opacity-40 text-[13px] tracking-widest uppercase font-mono">Verifying access...</p>
      </div>
    )
  }

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-[680px] mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-14">
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-30 mb-3">
            SmartBrainUp — Founder Interface
          </p>
          <h1 className="text-[28px] font-normal leading-[1.1] tracking-[-0.01em]">
            Prompt Genesi™
          </h1>
          <p className="text-[14px] opacity-40 mt-2 leading-[1.5]">
            Carica il Prompt Genesi™ su un Second Brain attivo.
          </p>
        </div>

        {/* Step 1 — Select Brain */}
        <div className="mb-10">
          <label className="block text-[10px] font-mono tracking-[0.15em] uppercase opacity-40 mb-3">
            01 — Seleziona Second Brain
          </label>

          {brainsLoading ? (
            <p className="text-[13px] opacity-30">Caricamento...</p>
          ) : brains.length === 0 ? (
            <p className="text-[13px] opacity-30">Nessun Second Brain trovato.</p>
          ) : (
            <select
              value={selectedBrainId}
              onChange={e => handleBrainSelect(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-[4px] px-4 py-3 text-[14px] text-white appearance-none focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="">— Scegli un brain —</option>
              {brains.map(brain => (
                <option key={brain.id} value={brain.id}>
                  {brain.name || 'Brain senza nome'} — {brain.id.slice(0, 8)}
                </option>
              ))}
            </select>
          )}

          {/* Brain metadata */}
          {selectedBrain && (
            <div className="mt-4 bg-[#252525] border border-white/5 rounded-[4px] p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-[11px] opacity-30 font-mono">brain_id</span>
                <span className="text-[11px] font-mono opacity-70">{selectedBrain.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] opacity-30 font-mono">status</span>
                <span className={`text-[11px] font-mono ${selectedBrain.prompt_status === 'active' ? 'text-green-400' : 'opacity-50'}`}>
                  {selectedBrain.prompt_status || 'pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] opacity-30 font-mono">version</span>
                <span className="text-[11px] font-mono opacity-70">{selectedBrain.prompt_version || '—'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Step 2 — Prompt Key */}
        <div className="mb-10">
          <label className="block text-[10px] font-mono tracking-[0.15em] uppercase opacity-40 mb-3">
            02 — Prompt Key
          </label>
          <input
            type="text"
            value={promptKey}
            onChange={e => setPromptKey(e.target.value)}
            placeholder="es. pg_client_001"
            className="w-full bg-[#2a2a2a] border border-white/10 rounded-[4px] px-4 py-3 text-[14px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Step 3 — Version */}
        <div className="mb-10">
          <label className="block text-[10px] font-mono tracking-[0.15em] uppercase opacity-40 mb-3">
            03 — Versione
          </label>
          <input
            type="text"
            value={version}
            onChange={e => setVersion(e.target.value)}
            placeholder="es. 1.0"
            className="w-full bg-[#2a2a2a] border border-white/10 rounded-[4px] px-4 py-3 text-[14px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Step 4 — Prompt Genesi */}
        <div className="mb-10">
          <label className="block text-[10px] font-mono tracking-[0.15em] uppercase opacity-40 mb-3">
            04 — Prompt Genesi™
          </label>
          <textarea
            value={promptText}
            onChange={e => setPromptText(e.target.value)}
            placeholder="Incolla qui il Prompt Genesi™..."
            rows={12}
            className="w-full bg-[#2a2a2a] border border-white/10 rounded-[4px] px-4 py-3 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none leading-[1.6]"
          />
          <p className="text-[11px] opacity-20 mt-2">
            Il testo viene cifrato immediatamente. Non viene mai salvato in chiaro.
          </p>
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!canUpload}
          className={`w-full py-4 rounded-[4px] text-[13px] font-mono tracking-[0.1em] uppercase transition-all ${
            canUpload
              ? 'bg-white text-[#1a1a1a] hover:bg-white/90 cursor-pointer'
              : 'bg-white/10 text-white/20 cursor-not-allowed'
          }`}
        >
          {uploading ? 'Cifratura e upload in corso...' : '05 — Upload Prompt Genesi™'}
        </button>

        {/* Result */}
        {result && (
          <div className={`mt-8 border rounded-[4px] p-5 ${
            result.success
              ? 'border-green-500/30 bg-green-500/5'
              : 'border-red-500/30 bg-red-500/5'
          }`}>
            {result.success ? (
              <div className="space-y-3">
                <p className="text-[11px] font-mono tracking-widest uppercase text-green-400 mb-4">
                  ✓ Upload completato
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[11px] opacity-40 font-mono">brain_id</span>
                    <span className="text-[11px] font-mono opacity-80">{result.brain_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] opacity-40 font-mono">prompt_key</span>
                    <span className="text-[11px] font-mono opacity-80">{result.prompt_key}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] opacity-40 font-mono">version</span>
                    <span className="text-[11px] font-mono opacity-80">{result.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] opacity-40 font-mono">status</span>
                    <span className="text-[11px] font-mono text-green-400">{result.status}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[12px] font-mono text-red-400">
                ✗ {result.error}
              </p>
            )}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-[11px] opacity-20 font-mono leading-[1.6]">
            Prompt Genesi™ è cifrato AES-256-GCM server-side.<br />
            Nessun dato sensibile viene loggato o restituito al client.<br />
            Accesso riservato: role = developer.
          </p>
        </div>

      </div>
    </div>
  )
}
