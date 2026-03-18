'use client'

// app/smartbrainup-ai/founder/page.tsx
// Founder Interface — caricamento multiplo Prompt Genesi™
// 1 Second Brain → N Prompt Genesi → N Chat
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

type ChatEntry = {
  id: string
  prompt_key: string
  label: string
  is_default: boolean
  sort_order: number
}

type UploadResult = {
  success: boolean
  prompt_key?: string
  label?: string
  version?: string
  is_default?: boolean
  error?: string
}

export default function FounderPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  const [brains, setBrains] = useState<Brain[]>([])
  const [brainsLoading, setBrainsLoading] = useState(false)
  const [selectedBrainId, setSelectedBrainId] = useState('')
  const [brainChats, setBrainChats] = useState<ChatEntry[]>([])
  const [chatsLoading, setChatsLoading] = useState(false)

  // Form fields
  const [promptKey, setPromptKey] = useState('')
  const [label, setLabel] = useState('')
  const [promptText, setPromptText] = useState('')
  const [version, setVersion] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)

  // ── Auth + role check ──
  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) { router.replace('/login'); return }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'developer') { router.replace('/client'); return }

      setAuthorized(true)
      setLoading(false)
    }
    check()
  }, [router])

  // ── Load brains ──
  useEffect(() => {
    if (!authorized) return
    const fetchBrains = async () => {
      setBrainsLoading(true)
      try {
        const res = await fetch('/api/founder/brains')
        const data = await res.json()
        if (data.brains) setBrains(data.brains)
      } catch { /* silent */ } finally {
        setBrainsLoading(false)
      }
    }
    fetchBrains()
  }, [authorized])

  // ── Load chats for selected brain ──
  const loadBrainChats = async (brainId: string) => {
    setChatsLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('chats')
        .select('id, prompt_key, label, is_default, sort_order')
        .eq('second_brain_id', brainId)
        .order('sort_order', { ascending: true })
      setBrainChats(data || [])
    } catch { /* silent */ } finally {
      setChatsLoading(false)
    }
  }

  // ── Select brain ──
  const handleBrainSelect = (id: string) => {
    setSelectedBrainId(id)
    setResult(null)
    setBrainChats([])
    const brain = brains.find(b => b.id === id)
    if (id) {
      loadBrainChats(id)
      if (brain?.prompt_key) {
        setPromptKey(brain.prompt_key)
      } else if (brain) {
        setPromptKey(`pg_${brain.id.slice(0, 8)}_01`)
      }
    }
  }

  // ── Upload ──
  const handleUpload = async () => {
    if (!selectedBrainId || !promptKey || !promptText.trim() || !version.trim() || !label.trim()) return

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
          version: version.trim(),
          label: label.trim(),
          is_default: isDefault,
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setResult({ success: true, ...data })
        setPromptText('')
        // Refresh chats list
        await loadBrainChats(selectedBrainId)
        // Refresh brain list
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
  const canUpload = selectedBrainId && promptKey && promptText.trim() && version.trim() && label.trim() && !uploading

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
      <div className="max-w-[720px] mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-14">
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-30 mb-3">
            SmartBrainUp — Founder Interface
          </p>
          <h1 className="text-[28px] font-normal leading-[1.1] tracking-[-0.01em]">
            Prompt Genesi™
          </h1>
          <p className="text-[14px] opacity-40 mt-2 leading-[1.5]">
            Ogni Second Brain contiene N Prompt Genesi™. Ogni prompt è una chat con un modo di ragionare distinto.
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
            </div>
          )}
        </div>

        {/* Prompt Genesi™ già caricati per questo brain */}
        {selectedBrainId && (
          <div className="mb-10">
            <label className="block text-[10px] font-mono tracking-[0.15em] uppercase opacity-40 mb-3">
              Prompt Genesi™ attivi su questo brain
            </label>

            {chatsLoading ? (
              <p className="text-[13px] opacity-30">Caricamento...</p>
            ) : brainChats.length === 0 ? (
              <div className="bg-[#252525] border border-white/5 rounded-[4px] p-4">
                <p className="text-[13px] opacity-30 font-mono">Nessun prompt caricato ancora.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {brainChats.map((chat, i) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setPromptKey(chat.prompt_key)
                      setLabel(chat.label)
                      setIsDefault(chat.is_default)
                      setVersion('')
                      setPromptText('')
                      setResult(null)
                    }}
                    className="bg-[#252525] border border-white/5 rounded-[4px] p-4 flex items-center justify-between cursor-pointer hover:border-white/15 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono opacity-30">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[13px] text-white">{chat.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono opacity-40">{chat.prompt_key}</span>
                      {chat.is_default && (
                        <span className="text-[10px] font-mono tracking-widest uppercase text-green-400 bg-green-400/10 px-2 py-0.5 rounded-[3px]">
                          default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        {selectedBrainId && (
          <div className="border-t border-white/5 mb-10">
            <p className="text-[10px] font-mono tracking-[0.15em] uppercase opacity-20 mt-4">
              Aggiungi o aggiorna un Prompt Genesi™
            </p>
          </div>
        )}

        {/* Step 2 — Label */}
        <div className="mb-8">
          <label className="block text-[10px] font-mono tracking-[0.15em] uppercase opacity-40 mb-3">
            02 — Label chat
          </label>
          <input
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="es. Decisione operativa"
            className="w-full bg-[#2a2a2a] border border-white/10 rounded-[4px] px-4 py-3 text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
          <p className="text-[11px] opacity-20 mt-2">
            Nome visibile al cliente nella lista chat.
          </p>
        </div>

        {/* Step 3 — Prompt Key */}
        <div className="mb-8">
          <label className="block text-[10px] font-mono tracking-[0.15em] uppercase opacity-40 mb-3">
            03 — Prompt Key
          </label>
          <input
            type="text"
            value={promptKey}
            onChange={e => setPromptKey(e.target.value)}
            placeholder="es. pg_client_001_decisione"
            className="w-full bg-[#2a2a2a] border border-white/10 rounded-[4px] px-4 py-3 text-[14px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Step 4 — Version */}
        <div className="mb-8">
          <label className="block text-[10px] font-mono tracking-[0.15em] uppercase opacity-40 mb-3">
            04 — Versione
          </label>
          <input
            type="text"
            value={version}
            onChange={e => setVersion(e.target.value)}
            placeholder="es. 1.0"
            className="w-full bg-[#2a2a2a] border border-white/10 rounded-[4px] px-4 py-3 text-[14px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Step 5 — Default flag */}
        <div className="mb-8">
          <label className="block text-[10px] font-mono tracking-[0.15em] uppercase opacity-40 mb-3">
            05 — Chat default
          </label>
          <div
            onClick={() => setIsDefault(!isDefault)}
            className={`flex items-center gap-3 cursor-pointer w-fit px-4 py-3 rounded-[4px] border transition-colors ${
              isDefault
                ? 'border-green-500/40 bg-green-500/5'
                : 'border-white/10 bg-[#2a2a2a]'
            }`}
          >
            <div className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors ${
              isDefault ? 'border-green-400 bg-green-400' : 'border-white/30'
            }`}>
              {isDefault && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l2.5 2.5L9 1" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className={`text-[13px] font-mono ${isDefault ? 'text-green-400' : 'text-white opacity-50'}`}>
              {isDefault ? 'Questa è la chat di default — "Start here"' : 'Imposta come chat di default'}
            </span>
          </div>
          <p className="text-[11px] opacity-20 mt-2">
            La chat default viene evidenziata come punto di partenza consigliato.
          </p>
        </div>

        {/* Step 6 — Prompt Genesi */}
        <div className="mb-10">
          <label className="block text-[10px] font-mono tracking-[0.15em] uppercase opacity-40 mb-3">
            06 — Prompt Genesi™
          </label>
          <textarea
            value={promptText}
            onChange={e => setPromptText(e.target.value)}
            placeholder="Incolla qui il Prompt Genesi™..."
            rows={14}
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
          {uploading ? 'Cifratura e upload in corso...' : '07 — Upload Prompt Genesi™'}
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
                    <span className="text-[11px] opacity-40 font-mono">prompt_key</span>
                    <span className="text-[11px] font-mono opacity-80">{result.prompt_key}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] opacity-40 font-mono">label</span>
                    <span className="text-[11px] font-mono opacity-80">{result.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] opacity-40 font-mono">version</span>
                    <span className="text-[11px] font-mono opacity-80">{result.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] opacity-40 font-mono">default</span>
                    <span className={`text-[11px] font-mono ${result.is_default ? 'text-green-400' : 'opacity-50'}`}>
                      {result.is_default ? 'sì' : 'no'}
                    </span>
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
