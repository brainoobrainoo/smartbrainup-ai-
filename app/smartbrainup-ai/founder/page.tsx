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

  const [promptKey, setPromptKey] = useState('')
  const [label, setLabel] = useState('')
  const [promptText, setPromptText] = useState('')
  const [version, setVersion] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const { data: profile } = await supabase
        .from('user_profiles').select('role').eq('id', user.id).single()
      if (!profile || profile.role !== 'developer') { router.replace('/client'); return }
      setAuthorized(true)
      setLoading(false)
    }
    check()
  }, [router])

  useEffect(() => {
    if (!authorized) return
    setBrainsLoading(true)
    fetch('/api/founder/brains')
      .then(r => r.json())
      .then(data => { if (data.brains) setBrains(data.brains) })
      .catch(() => {})
      .finally(() => setBrainsLoading(false))
  }, [authorized])

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
    } catch { } finally {
      setChatsLoading(false)
    }
  }

  const handleBrainSelect = (id: string) => {
    setSelectedBrainId(id)
    setResult(null)
    setBrainChats([])
    if (!id) return
    loadBrainChats(id)
    const brain = brains.find(b => b.id === id)
    setPromptKey(brain?.prompt_key || `pg_${id.slice(0, 8)}_01`)
  }

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
        await loadBrainChats(selectedBrainId)
        fetch('/api/founder/brains').then(r => r.json()).then(d => { if (d.brains) setBrains(d.brains) })
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
      <div style={{ minHeight: '100vh', background: '#f8f8f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#999', fontSize: '14px', letterSpacing: '0.05em' }}>Verifying access...</p>
      </div>
    )
  }

  if (!authorized) return null

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '2px solid #1a1a1a' }}>
          <p style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: '12px', fontFamily: 'system-ui, sans-serif' }}>
            SmartBrainUp — Founder Interface
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: '400', color: '#1a1a1a', margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Prompt Genesi™
          </h1>
          <p style={{ fontSize: '17px', color: '#555', margin: 0, lineHeight: 1.5, fontFamily: 'system-ui, sans-serif' }}>
            Carica i Prompt Genesi™ su un Second Brain. Ogni prompt diventa una chat con un modo di ragionare distinto.
          </p>
        </div>

        {/* Step 1 — Select Brain */}
        <div style={{ marginBottom: '36px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '10px', letterSpacing: '0.03em', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase' }}>
            01 — Seleziona Second Brain
          </label>

          {brainsLoading ? (
            <p style={{ color: '#999', fontSize: '15px', fontFamily: 'system-ui, sans-serif' }}>Caricamento...</p>
          ) : brains.length === 0 ? (
            <p style={{ color: '#999', fontSize: '15px', fontFamily: 'system-ui, sans-serif' }}>Nessun Second Brain trovato.</p>
          ) : (
            <select
              value={selectedBrainId}
              onChange={e => handleBrainSelect(e.target.value)}
              style={{
                width: '100%', background: '#fff', border: '1.5px solid #d0d0d0',
                borderRadius: '8px', padding: '14px 16px', fontSize: '16px',
                color: '#1a1a1a', outline: 'none', cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif', appearance: 'none',
              }}
            >
              <option value="">— Scegli un brain —</option>
              {brains.map(brain => (
                <option key={brain.id} value={brain.id}>
                  {brain.name || 'Brain senza nome'} — {brain.id.slice(0, 8)}
                </option>
              ))}
            </select>
          )}

          {selectedBrain && (
            <div style={{ marginTop: '12px', background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: '8px', padding: '14px 16px', display: 'flex', gap: '32px', fontFamily: 'system-ui, sans-serif' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</span>
                <p style={{ margin: '3px 0 0', fontSize: '14px', fontWeight: '600', color: selectedBrain.prompt_status === 'active' ? '#16a34a' : '#888' }}>
                  {selectedBrain.prompt_status || 'pending'}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Brain ID</span>
                <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#555', fontFamily: 'monospace' }}>{selectedBrain.id.slice(0, 16)}...</p>
              </div>
            </div>
          )}
        </div>

        {/* Prompt attivi */}
        {selectedBrainId && (
          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '10px', letterSpacing: '0.03em', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase' }}>
              Prompt Genesi™ attivi su questo brain
            </label>
            {chatsLoading ? (
              <p style={{ color: '#999', fontSize: '15px', fontFamily: 'system-ui, sans-serif' }}>Caricamento...</p>
            ) : brainChats.length === 0 ? (
              <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: '8px', padding: '20px 16px' }}>
                <p style={{ color: '#aaa', fontSize: '15px', margin: 0, fontFamily: 'system-ui, sans-serif' }}>Nessun prompt caricato ancora.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {brainChats.map((chat, i) => (
                  <div
                    key={chat.id}
                    onClick={() => { setPromptKey(chat.prompt_key); setLabel(chat.label); setIsDefault(chat.is_default); setVersion(''); setPromptText(''); setResult(null) }}
                    style={{
                      background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: '8px',
                      padding: '14px 16px', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', cursor: 'pointer',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e8e8')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '13px', color: '#bbb', fontFamily: 'monospace', minWidth: '20px' }}>{String(i + 1).padStart(2, '0')}</span>
                      <span style={{ fontSize: '16px', color: '#1a1a1a', fontFamily: 'system-ui, sans-serif', fontWeight: '500' }}>{chat.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#aaa', fontFamily: 'monospace' }}>{chat.prompt_key}</span>
                      {chat.is_default && (
                        <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16a34a', background: '#dcfce7', padding: '3px 8px', borderRadius: '4px', fontFamily: 'system-ui, sans-serif' }}>
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
        <div style={{ borderTop: '1.5px solid #e0e0e0', marginBottom: '36px', paddingTop: '12px' }}>
          <p style={{ fontSize: '13px', color: '#888', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Aggiungi o aggiorna un Prompt Genesi™
          </p>
        </div>

        {/* 02 — Label */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px', letterSpacing: '0.03em', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase' }}>
            02 — Label chat
          </label>
          <input
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="es. Decisione operativa"
            style={{ width: '100%', background: '#fff', border: '1.5px solid #d0d0d0', borderRadius: '8px', padding: '14px 16px', fontSize: '16px', color: '#1a1a1a', outline: 'none', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}
            onFocus={e => (e.target.style.borderColor = '#1a1a1a')}
            onBlur={e => (e.target.style.borderColor = '#d0d0d0')}
          />
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#999', fontFamily: 'system-ui, sans-serif' }}>Nome visibile al cliente nella lista chat.</p>
        </div>

        {/* 03 — Prompt Key */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px', letterSpacing: '0.03em', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase' }}>
            03 — Prompt Key
          </label>
          <input
            type="text"
            value={promptKey}
            onChange={e => setPromptKey(e.target.value)}
            placeholder="es. pg_client_001_decisione"
            style={{ width: '100%', background: '#fff', border: '1.5px solid #d0d0d0', borderRadius: '8px', padding: '14px 16px', fontSize: '16px', color: '#1a1a1a', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
            onFocus={e => (e.target.style.borderColor = '#1a1a1a')}
            onBlur={e => (e.target.style.borderColor = '#d0d0d0')}
          />
        </div>

        {/* 04 — Version */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px', letterSpacing: '0.03em', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase' }}>
            04 — Versione
          </label>
          <input
            type="text"
            value={version}
            onChange={e => setVersion(e.target.value)}
            placeholder="es. 1.0"
            style={{ width: '280px', background: '#fff', border: '1.5px solid #d0d0d0', borderRadius: '8px', padding: '14px 16px', fontSize: '16px', color: '#1a1a1a', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
            onFocus={e => (e.target.style.borderColor = '#1a1a1a')}
            onBlur={e => (e.target.style.borderColor = '#d0d0d0')}
          />
        </div>

        {/* 05 — Default */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px', letterSpacing: '0.03em', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase' }}>
            05 — Chat default
          </label>
          <div
            onClick={() => setIsDefault(!isDefault)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
              padding: '12px 16px', borderRadius: '8px', border: `1.5px solid ${isDefault ? '#16a34a' : '#d0d0d0'}`,
              background: isDefault ? '#f0fdf4' : '#fff', transition: 'all 0.15s',
              userSelect: 'none',
            }}
          >
            <div style={{
              width: '20px', height: '20px', borderRadius: '5px', border: `2px solid ${isDefault ? '#16a34a' : '#ccc'}`,
              background: isDefault ? '#16a34a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.15s',
            }}>
              {isDefault && (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path d="M1 4.5l3 3L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span style={{ fontSize: '15px', color: isDefault ? '#16a34a' : '#555', fontFamily: 'system-ui, sans-serif', fontWeight: isDefault ? '600' : '400' }}>
              {isDefault ? 'Chat di default — "Start here"' : 'Imposta come chat di default'}
            </span>
          </div>
        </div>

        {/* 06 — Prompt Genesi */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px', letterSpacing: '0.03em', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase' }}>
            06 — Prompt Genesi™
          </label>
          <textarea
            value={promptText}
            onChange={e => setPromptText(e.target.value)}
            placeholder="Incolla qui il Prompt Genesi™..."
            rows={16}
            style={{
              width: '100%', background: '#fff', border: '1.5px solid #d0d0d0',
              borderRadius: '8px', padding: '16px', fontSize: '15px', color: '#1a1a1a',
              outline: 'none', fontFamily: 'monospace', resize: 'vertical',
              lineHeight: '1.65', boxSizing: 'border-box',
            }}
            onFocus={e => (e.target.style.borderColor = '#1a1a1a')}
            onBlur={e => (e.target.style.borderColor = '#d0d0d0')}
          />
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#999', fontFamily: 'system-ui, sans-serif' }}>
            Il testo viene cifrato AES-256-GCM immediatamente. Non viene mai salvato in chiaro.
          </p>
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!canUpload}
          style={{
            width: '100%', padding: '18px', borderRadius: '8px', border: 'none',
            fontSize: '15px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase',
            cursor: canUpload ? 'pointer' : 'not-allowed',
            background: canUpload ? '#1a1a1a' : '#e0e0e0',
            color: canUpload ? '#fff' : '#aaa',
            transition: 'all 0.15s', fontFamily: 'system-ui, sans-serif',
          }}
          onMouseEnter={e => { if (canUpload) e.currentTarget.style.background = '#333' }}
          onMouseLeave={e => { if (canUpload) e.currentTarget.style.background = '#1a1a1a' }}
        >
          {uploading ? 'Cifratura e upload in corso...' : '07 — Upload Prompt Genesi™'}
        </button>

        {/* Result */}
        {result && (
          <div style={{
            marginTop: '24px', borderRadius: '8px', padding: '20px 24px',
            border: `1.5px solid ${result.success ? '#16a34a' : '#dc2626'}`,
            background: result.success ? '#f0fdf4' : '#fef2f2',
          }}>
            {result.success ? (
              <>
                <p style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16a34a', marginBottom: '16px', fontFamily: 'system-ui, sans-serif' }}>
                  ✓ Upload completato
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontFamily: 'system-ui, sans-serif' }}>
                  {[
                    ['prompt_key', result.prompt_key],
                    ['label', result.label],
                    ['version', result.version],
                    ['default', result.is_default ? 'sì' : 'no'],
                  ].map(([k, v]) => (
                    <>
                      <span key={k + 'k'} style={{ fontSize: '13px', color: '#888' }}>{k}</span>
                      <span key={k + 'v'} style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: '500' }}>{v}</span>
                    </>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ fontSize: '14px', color: '#dc2626', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
                ✗ {result.error}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '64px', paddingTop: '24px', borderTop: '1px solid #e0e0e0' }}>
          <p style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.7, margin: 0, fontFamily: 'system-ui, sans-serif' }}>
            Prompt Genesi™ è cifrato AES-256-GCM server-side. Nessun dato sensibile viene loggato o restituito al client. Accesso riservato: role = developer.
          </p>
        </div>

      </div>
    </div>
  )
}
