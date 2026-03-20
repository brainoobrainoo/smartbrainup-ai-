'use client'

// app/(smartbrainup-ai)/founder/page.tsx
// Founder Interface — gestione completa clienti
// Accesso: solo utenti con role = 'developer'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ── Types ────────────────────────────────────────────────────────────────────

type Brain = {
  id: string
  name: string
  prompt_key: string
  prompt_version: string
  prompt_status: string
  user_id: string
  created_at: string
  submitted: boolean
}

type ChatEntry = {
  id: string
  prompt_key: string
  label: string
  is_default: boolean
  sort_order: number
}

type ClientFile = {
  id: string
  file_type: string
  asset_type: string | null
  file_url: string
  phase: string | null
  status: string | null
  created_at: string
}

type AssessmentResponses = {
  phase1?: Record<string, unknown>
  phase2?: Record<string, unknown>
  phase3?: string
}

type ClientContext = {
  user_email: string
  assessment: AssessmentResponses | null
  files: ClientFile[]
}

type UploadResult = {
  success: boolean
  prompt_key?: string
  label?: string
  version?: string
  is_default?: boolean
  error?: string
}

type Tab = 'fase1' | 'fase2' | 'fase3' | 'prompt'

// ── Helpers ──────────────────────────────────────────────────────────────────

const S: Record<string, React.CSSProperties> = {
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#888',
    marginBottom: '8px',
    letterSpacing: '0.12em',
    fontFamily: 'system-ui, sans-serif',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    background: '#fff',
    border: '1.5px solid #d0d0d0',
    borderRadius: '8px',
    padding: '13px 16px',
    fontSize: '15px',
    color: '#1a1a1a',
    outline: 'none',
    fontFamily: 'system-ui, sans-serif',
    boxSizing: 'border-box' as const,
  },
  card: {
    background: '#fff',
    border: '1.5px solid #e8e8e8',
    borderRadius: '10px',
    padding: '16px 18px',
  },
}

function chipStyle(color: string, bg: string): React.CSSProperties {
  return {
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color,
    background: bg,
    padding: '3px 8px',
    borderRadius: '4px',
    fontFamily: 'system-ui, sans-serif',
    flexShrink: 0,
  }
}

function statusChip(status: string | null) {
  if (status === 'active') return <span style={chipStyle('#16a34a', '#dcfce7')}>active</span>
  if (status === 'pending') return <span style={chipStyle('#d97706', '#fef3c7')}>pending</span>
  return <span style={chipStyle('#888', '#f0f0f0')}>{status || 'draft'}</span>
}

function fileTypeChip(type: string) {
  const map: Record<string, [string, string]> = {
    image: ['#7c3aed', '#ede9fe'],
    audio: ['#0369a1', '#e0f2fe'],
    document: ['#b45309', '#fef3c7'],
    video: ['#be185d', '#fce7f3'],
  }
  const [c, bg] = map[type] || ['#888', '#f0f0f0']
  return <span style={chipStyle(c, bg)}>{type}</span>
}

// ── Phase Response Renderer ───────────────────────────────────────────────────

function PhaseResponses({ data }: { data: Record<string, unknown> | null | undefined }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#bbb', fontFamily: 'system-ui, sans-serif', fontSize: '15px' }}>
        Nessuna risposta registrata per questa fase.
      </div>
    )
  }
  const entries = Object.entries(data)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {entries.map(([key, value]) => (
        <div key={key} style={{ ...S.card, display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '12px', color: '#aaa', fontFamily: 'monospace', paddingTop: '2px' }}>{key}</span>
          <span style={{ fontSize: '15px', color: '#1a1a1a', fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
            {Array.isArray(value)
              ? (value as unknown[]).join(', ')
              : typeof value === 'object' && value !== null
                ? JSON.stringify(value)
                : String(value ?? '—')}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Phase 3 File Renderer ────────────────────────────────────────────────────

function FileCard({ file }: { file: ClientFile }) {
  const [expanded, setExpanded] = useState(false)
  const date = new Date(file.created_at).toLocaleString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div style={{
      ...S.card,
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {fileTypeChip(file.file_type)}
          {file.phase && <span style={{ fontSize: '12px', color: '#aaa', fontFamily: 'monospace' }}>fase {file.phase}</span>}
          {statusChip(file.status)}
        </div>
        <span style={{ fontSize: '12px', color: '#bbb', fontFamily: 'system-ui, sans-serif' }}>{date}</span>
      </div>

      {/* Content by type */}
      {file.file_type === 'image' && (
        <div>
          <img
            src={file.file_url}
            alt="Client upload"
            style={{
              maxWidth: '100%',
              maxHeight: '420px',
              objectFit: 'contain',
              borderRadius: '8px',
              border: '1px solid #e8e8e8',
              cursor: 'pointer',
              display: 'block',
            }}
            onClick={() => window.open(file.file_url, '_blank')}
          />
          <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#bbb', fontFamily: 'system-ui, sans-serif' }}>
            Clicca per aprire in piena risoluzione
          </p>
        </div>
      )}

      {file.file_type === 'audio' && (
        <div>
          <audio
            controls
            src={file.file_url}
            style={{ width: '100%', borderRadius: '6px' }}
          />
        </div>
      )}

      {file.file_type === 'video' && (
        <div>
          <video
            controls
            src={file.file_url}
            style={{ width: '100%', maxHeight: '360px', borderRadius: '8px', background: '#000' }}
          />
        </div>
      )}

      {file.file_type === 'document' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* PDF inline preview */}
          {file.file_url.toLowerCase().endsWith('.pdf') && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onClick={() => setExpanded(!expanded)}
              >
                <span style={{ fontSize: '13px', fontFamily: 'system-ui, sans-serif', color: '#555' }}>
                  {expanded ? '▾ Nascondi anteprima' : '▸ Mostra anteprima PDF'}
                </span>
              </div>
              {expanded && (
                <iframe
                  src={file.file_url}
                  style={{ width: '100%', height: '600px', border: '1px solid #e0e0e0', borderRadius: '8px' }}
                  title="PDF preview"
                />
              )}
            </div>
          )}

          {/* Download button always shown */}
          <a
            href={file.file_url}
            target="_blank"
            rel="noopener noreferrer"
            download
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: '#1a1a1a',
              color: '#fff',
              borderRadius: '7px',
              fontSize: '13px',
              fontWeight: '600',
              fontFamily: 'system-ui, sans-serif',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              alignSelf: 'flex-start',
            }}
          >
            ↓ Scarica documento
          </a>
        </div>
      )}

      {/* URL fallback */}
      <p style={{ margin: 0, fontSize: '11px', color: '#d0d0d0', fontFamily: 'monospace', wordBreak: 'break-all' }}>
        {file.file_url}
      </p>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function FounderPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  // Brain list
  const [brains, setBrains] = useState<Brain[]>([])
  const [brainsLoading, setBrainsLoading] = useState(false)
  const [selectedBrainId, setSelectedBrainId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubmitted, setFilterSubmitted] = useState(false)

  // Client context
  const [context, setContext] = useState<ClientContext | null>(null)
  const [contextLoading, setContextLoading] = useState(false)

  // Active tab
  const [tab, setTab] = useState<Tab>('fase1')

  // Prompt upload state
  const [brainChats, setBrainChats] = useState<ChatEntry[]>([])
  const [chatsLoading, setChatsLoading] = useState(false)
  const [promptKey, setPromptKey] = useState('')
  const [promptLabel, setPromptLabel] = useState('')
  const [promptText, setPromptText] = useState('')
  const [version, setVersion] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

  // ── Auth check ─────────────────────────────────────────────────────────────

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

  // ── Load brains ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!authorized) return
    setBrainsLoading(true)
    fetch('/api/founder/brains')
      .then(r => r.json())
      .then(data => { if (data.brains) setBrains(data.brains) })
      .catch(() => {})
      .finally(() => setBrainsLoading(false))
  }, [authorized])

  // ── Load client context ────────────────────────────────────────────────────

  const loadContext = useCallback(async (brainId: string) => {
    setContextLoading(true)
    setContext(null)
    try {
      const res = await fetch(`/api/founder/client-context?brain_id=${brainId}`)
      const data = await res.json()
      if (res.ok) setContext(data)
    } catch { }
    finally { setContextLoading(false) }
  }, [])

  // ── Load chats (for Prompt tab) ────────────────────────────────────────────

  const loadBrainChats = useCallback(async (brainId: string) => {
    setChatsLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('chats')
        .select('id, prompt_key, label, is_default, sort_order')
        .eq('second_brain_id', brainId)
        .order('sort_order', { ascending: true })
      setBrainChats(data || [])
    } catch { }
    finally { setChatsLoading(false) }
  }, [])

  // ── Select brain ───────────────────────────────────────────────────────────

  const handleBrainSelect = (id: string) => {
    setSelectedBrainId(id)
    setContext(null)
    setBrainChats([])
    setUploadResult(null)
    setTab('fase1')
    if (!id) return
    loadContext(id)
    loadBrainChats(id)
    const brain = brains.find(b => b.id === id)
    setPromptKey(brain?.prompt_key || `pg_${id.slice(0, 8)}_01`)
    setPromptLabel('')
    setPromptText('')
    setVersion('')
    setIsDefault(false)
  }

  // ── Upload prompt ──────────────────────────────────────────────────────────

  const handleUpload = async () => {
    if (!selectedBrainId || !promptKey || !promptText.trim() || !version.trim() || !promptLabel.trim()) return
    setUploading(true)
    setUploadResult(null)
    try {
      const res = await fetch('/api/founder/upload-ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brain_id: selectedBrainId,
          prompt_key: promptKey,
          prompt_text: promptText,
          version: version.trim(),
          label: promptLabel.trim(),
          is_default: isDefault,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setUploadResult({ success: true, ...data })
        setPromptText('')
        await loadBrainChats(selectedBrainId)
        fetch('/api/founder/brains').then(r => r.json()).then(d => { if (d.brains) setBrains(d.brains) })
      } else {
        setUploadResult({ success: false, error: data.error || 'Upload failed' })
      }
    } catch {
      setUploadResult({ success: false, error: 'Network error' })
    } finally {
      setUploading(false)
    }
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const selectedBrain = brains.find(b => b.id === selectedBrainId)
  const canUpload = selectedBrainId && promptKey && promptText.trim() && version.trim() && promptLabel.trim() && !uploading
  const submittedCount = brains.filter(b => b.submitted).length
  const filteredBrains = brains.filter(b => {
    const matchesSearch = !searchQuery ||
      (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.includes(searchQuery) ||
      b.user_id.includes(searchQuery)
    const matchesFilter = !filterSubmitted || b.submitted
    return matchesSearch && matchesFilter
  })
  const phase3Files = (context?.files || [])
  const hasPhase3Text = !!(context?.assessment?.phase3)

  // ── Render guards ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#aaa', fontSize: '14px', letterSpacing: '0.08em', fontFamily: 'system-ui, sans-serif' }}>
          Verifying access...
        </p>
      </div>
    )
  }

  if (!authorized) return null

  // ── UI ─────────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f3', fontFamily: 'Georgia, "Times New Roman", serif', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Header ─────────────────────────────────────────────────────── */}
      <div style={{
        background: '#1a1a1a',
        color: '#fff',
        padding: '0 32px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#666', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
            SmartBrainUp
          </p>
          <span style={{ color: '#333' }}>—</span>
          <p style={{ fontSize: '14px', color: '#fff', margin: 0, fontFamily: 'system-ui, sans-serif', fontWeight: '500', letterSpacing: '0.02em' }}>
            Founder Interface
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a', display: 'block' }} />
          <span style={{ fontSize: '12px', color: '#666', fontFamily: 'system-ui, sans-serif' }}>developer</span>
        </div>
      </div>

      {/* ── Body: two-panel ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left panel: client list ─────────────────────────────────────── */}
        <div style={{
          width: '300px',
          flexShrink: 0,
          background: '#fff',
          borderRight: '1.5px solid #e8e8e8',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Panel header */}
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <p style={{ ...S.label, marginBottom: '12px' }}>Second Brain — clienti ({brains.length})</p>
            <input
              type="text"
              placeholder="Cerca cliente o ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#f8f8f6',
                border: '1.5px solid #e8e8e8',
                borderRadius: '7px',
                padding: '9px 12px',
                fontSize: '14px',
                color: '#1a1a1a',
                outline: 'none',
                fontFamily: 'system-ui, sans-serif',
                boxSizing: 'border-box',
              }}
            />
            {/* Filter bar */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <button
                onClick={() => setFilterSubmitted(false)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  fontFamily: 'system-ui, sans-serif',
                  cursor: 'pointer',
                  background: !filterSubmitted ? '#1a1a1a' : '#f0f0f0',
                  color: !filterSubmitted ? '#fff' : '#888',
                  transition: 'all 0.12s',
                }}
              >
                TUTTI ({brains.length})
              </button>
              <button
                onClick={() => setFilterSubmitted(true)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  fontFamily: 'system-ui, sans-serif',
                  cursor: 'pointer',
                  background: filterSubmitted ? '#dc2626' : '#fef2f2',
                  color: filterSubmitted ? '#fff' : '#dc2626',
                  transition: 'all 0.12s',
                }}
              >
                DA LAVORARE {submittedCount > 0 ? `(${submittedCount})` : ''}
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {brainsLoading ? (
              <p style={{ padding: '24px 20px', color: '#bbb', fontSize: '14px', fontFamily: 'system-ui, sans-serif' }}>
                Caricamento...
              </p>
            ) : filteredBrains.length === 0 ? (
              <p style={{ padding: '24px 20px', color: '#bbb', fontSize: '14px', fontFamily: 'system-ui, sans-serif' }}>
                Nessun cliente trovato.
              </p>
            ) : (
              filteredBrains.map(brain => {
                const isSelected = brain.id === selectedBrainId
                return (
                  <div
                    key={brain.id}
                    onClick={() => handleBrainSelect(brain.id)}
                    style={{
                      padding: '14px 20px',
                      borderBottom: '1px solid #f5f5f3',
                      cursor: 'pointer',
                      background: isSelected ? '#1a1a1a' : 'transparent',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f8f8f6' }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          margin: '0 0 4px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: isSelected ? '#fff' : '#1a1a1a',
                          fontFamily: 'system-ui, sans-serif',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {brain.name || 'Brain senza nome'}
                        </p>
                        <p style={{
                          margin: 0,
                          fontSize: '11px',
                          color: isSelected ? '#888' : '#bbb',
                          fontFamily: 'monospace',
                        }}>
                          {brain.id.slice(0, 12)}...
                        </p>
                      </div>
                      <span style={{
                        ...chipStyle(
                          brain.prompt_status === 'active' ? (isSelected ? '#4ade80' : '#16a34a') : (isSelected ? '#888' : '#aaa'),
                          isSelected ? '#2a2a2a' : (brain.prompt_status === 'active' ? '#dcfce7' : '#f0f0f0')
                        ),
                        marginTop: '2px',
                      }}>
                        {brain.prompt_status || 'draft'}
                      </span>
                    </div>
                    {brain.submitted && (
                      <div style={{ marginTop: '6px' }}>
                        <span style={{
                          fontSize: '9px',
                          fontWeight: '800',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: isSelected ? '#fca5a5' : '#dc2626',
                          fontFamily: 'system-ui, sans-serif',
                        }}>
                          ● DA LAVORARE
                        </span>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ── Right panel: detail ──────────────────────────────────────────── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {!selectedBrainId ? (
            // Empty state
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '28px', color: '#d0d0d0', margin: 0 }}>←</p>
              <p style={{ fontSize: '15px', color: '#bbb', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
                Seleziona un cliente dalla lista
              </p>
            </div>
          ) : (
            <>
              {/* Client header */}
              <div style={{
                background: '#fff',
                borderBottom: '1.5px solid #e8e8e8',
                padding: '16px 32px',
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '400', color: '#1a1a1a', letterSpacing: '-0.01em' }}>
                    {selectedBrain?.name || 'Brain senza nome'}
                  </h2>
                  {selectedBrain && statusChip(selectedBrain.prompt_status)}
                  {selectedBrain?.submitted && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#dc2626',
                      background: '#fef2f2',
                      padding: '4px 10px',
                      borderRadius: '5px',
                      fontFamily: 'system-ui, sans-serif',
                      border: '1.5px solid #fecaca',
                    }}>
                      ● DA LAVORARE
                    </span>
                  )}
                </div>

                {/* Context metadata */}
                {contextLoading ? (
                  <p style={{ fontSize: '13px', color: '#bbb', fontFamily: 'system-ui, sans-serif', margin: 0 }}>Caricamento contesto...</p>
                ) : context && (
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div>
                      <span style={S.label}>Cliente</span>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1a1a1a', fontFamily: 'system-ui, sans-serif' }}>
                        {context.user_email}
                      </p>
                    </div>
                    <div>
                      <span style={S.label}>File Fase 3</span>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1a1a1a', fontFamily: 'system-ui, sans-serif' }}>
                        {phase3Files.length} {phase3Files.length === 1 ? 'file' : 'files'}
                      </p>
                    </div>
                    <div>
                      <span style={S.label}>Brain ID</span>
                      <p style={{ margin: 0, fontSize: '13px', color: '#aaa', fontFamily: 'monospace' }}>
                        {selectedBrainId.slice(0, 20)}...
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab bar */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
                  {(['fase1', 'fase2', 'fase3', 'prompt'] as Tab[]).map(t => {
                    const labels: Record<Tab, string> = {
                      fase1: 'Fase 1',
                      fase2: 'Fase 2',
                      fase3: `Fase 3${phase3Files.length > 0 ? ` (${phase3Files.length})` : ''}`,
                      prompt: 'Prompt Genesi™',
                    }
                    const isActive = tab === t
                    return (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '7px',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: isActive ? '700' : '400',
                          letterSpacing: '0.02em',
                          fontFamily: 'system-ui, sans-serif',
                          cursor: 'pointer',
                          background: isActive ? '#1a1a1a' : 'transparent',
                          color: isActive ? '#fff' : '#666',
                          transition: 'all 0.12s',
                        }}
                      >
                        {labels[t]}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tab content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

                {/* ── Fase 1 ──────────────────────────────────────────────── */}
                {tab === 'fase1' && (
                  <div>
                    <p style={{ ...S.label, marginBottom: '20px' }}>Assessment — Fase 1</p>
                    {contextLoading ? (
                      <p style={{ color: '#bbb', fontSize: '15px', fontFamily: 'system-ui, sans-serif' }}>Caricamento...</p>
                    ) : (
                      <PhaseResponses data={context?.assessment?.phase1 as Record<string, unknown> | null} />
                    )}
                  </div>
                )}

                {/* ── Fase 2 ──────────────────────────────────────────────── */}
                {tab === 'fase2' && (
                  <div>
                    <p style={{ ...S.label, marginBottom: '20px' }}>Assessment — Fase 2</p>
                    {contextLoading ? (
                      <p style={{ color: '#bbb', fontSize: '15px', fontFamily: 'system-ui, sans-serif' }}>Caricamento...</p>
                    ) : (
                      <PhaseResponses data={context?.assessment?.phase2 as Record<string, unknown> | null} />
                    )}
                  </div>
                )}

                {/* ── Fase 3 ──────────────────────────────────────────────── */}
                {tab === 'fase3' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {contextLoading ? (
                      <p style={{ color: '#bbb', fontSize: '15px', fontFamily: 'system-ui, sans-serif' }}>Caricamento...</p>
                    ) : (
                      <>
                        {/* Text from Phase 3 textarea */}
                        {hasPhase3Text && (
                          <div>
                            <p style={{ ...S.label, marginBottom: '12px' }}>Testo libero</p>
                            <div style={{
                              ...S.card,
                              borderLeft: '3px solid #1a1a1a',
                              borderRadius: '0 10px 10px 0',
                            }}>
                              <p style={{
                                margin: 0,
                                fontSize: '15px',
                                color: '#1a1a1a',
                                fontFamily: 'system-ui, sans-serif',
                                lineHeight: '1.7',
                                whiteSpace: 'pre-wrap',
                              }}>
                                {context?.assessment?.phase3}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Files */}
                        {phase3Files.length > 0 && (
                          <div>
                            <p style={{ ...S.label, marginBottom: '12px' }}>
                              File caricati — {phase3Files.length} {phase3Files.length === 1 ? 'file' : 'files'}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {/* Group by type */}
                              {['image', 'audio', 'video', 'document'].map(type => {
                                const typeFiles = phase3Files.filter(f => f.file_type === type)
                                if (typeFiles.length === 0) return null
                                return (
                                  <div key={type}>
                                    <p style={{ ...S.label, marginBottom: '8px' }}>
                                      {type === 'image' ? `Immagini (${typeFiles.length})` :
                                        type === 'audio' ? `Audio (${typeFiles.length})` :
                                          type === 'video' ? `Video (${typeFiles.length})` :
                                            `Documenti (${typeFiles.length})`}
                                    </p>
                                    {typeFiles.map(file => <FileCard key={file.id} file={file} />)}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Empty state */}
                        {!hasPhase3Text && phase3Files.length === 0 && (
                          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                            <p style={{ fontSize: '15px', color: '#bbb', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
                              Nessun contenuto Fase 3 ancora inviato da questo cliente.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* ── Prompt Genesi™ ───────────────────────────────────────── */}
                {tab === 'prompt' && (
                  <div>
                    {/* Existing prompts */}
                    <div style={{ marginBottom: '32px' }}>
                      <p style={{ ...S.label, marginBottom: '12px' }}>Prompt Genesi™ attivi su questo brain</p>
                      {chatsLoading ? (
                        <p style={{ color: '#bbb', fontSize: '14px', fontFamily: 'system-ui, sans-serif' }}>Caricamento...</p>
                      ) : brainChats.length === 0 ? (
                        <div style={{ ...S.card }}>
                          <p style={{ color: '#bbb', fontSize: '14px', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
                            Nessun prompt caricato ancora.
                          </p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {brainChats.map((chat, i) => (
                            <div
                              key={chat.id}
                              onClick={() => {
                                setPromptKey(chat.prompt_key)
                                setPromptLabel(chat.label)
                                setIsDefault(chat.is_default)
                                setVersion('')
                                setPromptText('')
                                setUploadResult(null)
                              }}
                              style={{
                                ...S.card,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                transition: 'border-color 0.12s',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
                              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e8e8')}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '12px', color: '#ccc', fontFamily: 'monospace', minWidth: '20px' }}>
                                  {String(i + 1).padStart(2, '0')}
                                </span>
                                <span style={{ fontSize: '15px', color: '#1a1a1a', fontFamily: 'system-ui, sans-serif', fontWeight: '500' }}>
                                  {chat.label}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '12px', color: '#ccc', fontFamily: 'monospace' }}>{chat.prompt_key}</span>
                                {chat.is_default && <span style={chipStyle('#16a34a', '#dcfce7')}>default</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: '1.5px solid #e8e8e8', marginBottom: '28px', paddingTop: '10px' }}>
                      <p style={{ fontSize: '12px', color: '#aaa', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                        Aggiungi o aggiorna Prompt Genesi™
                      </p>
                    </div>

                    {/* Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

                      {/* Label */}
                      <div>
                        <label style={S.label}>Label chat</label>
                        <input
                          type="text"
                          value={promptLabel}
                          onChange={e => setPromptLabel(e.target.value)}
                          placeholder="es. Decisione operativa"
                          style={S.input}
                          onFocus={e => (e.target.style.borderColor = '#1a1a1a')}
                          onBlur={e => (e.target.style.borderColor = '#d0d0d0')}
                        />
                        <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#aaa', fontFamily: 'system-ui, sans-serif' }}>
                          Nome visibile al cliente nella lista chat.
                        </p>
                      </div>

                      {/* Prompt Key */}
                      <div>
                        <label style={S.label}>Prompt Key</label>
                        <input
                          type="text"
                          value={promptKey}
                          onChange={e => setPromptKey(e.target.value)}
                          placeholder="es. pg_client_001_decisione"
                          style={{ ...S.input, fontFamily: 'monospace' }}
                          onFocus={e => (e.target.style.borderColor = '#1a1a1a')}
                          onBlur={e => (e.target.style.borderColor = '#d0d0d0')}
                        />
                      </div>

                      {/* Version */}
                      <div>
                        <label style={S.label}>Versione</label>
                        <input
                          type="text"
                          value={version}
                          onChange={e => setVersion(e.target.value)}
                          placeholder="es. 1.0"
                          style={{ ...S.input, fontFamily: 'monospace', maxWidth: '200px' }}
                          onFocus={e => (e.target.style.borderColor = '#1a1a1a')}
                          onBlur={e => (e.target.style.borderColor = '#d0d0d0')}
                        />
                      </div>

                      {/* Default toggle */}
                      <div>
                        <label style={S.label}>Chat default</label>
                        <div
                          onClick={() => setIsDefault(!isDefault)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: `1.5px solid ${isDefault ? '#16a34a' : '#d0d0d0'}`,
                            background: isDefault ? '#f0fdf4' : '#fff',
                            transition: 'all 0.12s',
                            userSelect: 'none',
                          }}
                        >
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: `2px solid ${isDefault ? '#16a34a' : '#ccc'}`,
                            background: isDefault ? '#16a34a' : '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.12s',
                          }}>
                            {isDefault && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <span style={{
                            fontSize: '14px',
                            color: isDefault ? '#16a34a' : '#555',
                            fontFamily: 'system-ui, sans-serif',
                            fontWeight: isDefault ? '600' : '400',
                          }}>
                            {isDefault ? 'Chat di default attiva' : 'Imposta come chat di default'}
                          </span>
                        </div>
                      </div>

                      {/* Prompt text */}
                      <div>
                        <label style={S.label}>Prompt Genesi™</label>
                        <textarea
                          value={promptText}
                          onChange={e => setPromptText(e.target.value)}
                          placeholder="Incolla qui il Prompt Genesi™..."
                          rows={14}
                          style={{
                            width: '100%',
                            background: '#fff',
                            border: '1.5px solid #d0d0d0',
                            borderRadius: '8px',
                            padding: '14px 16px',
                            fontSize: '14px',
                            color: '#1a1a1a',
                            outline: 'none',
                            fontFamily: 'monospace',
                            resize: 'vertical',
                            lineHeight: '1.6',
                            boxSizing: 'border-box',
                          }}
                          onFocus={e => (e.target.style.borderColor = '#1a1a1a')}
                          onBlur={e => (e.target.style.borderColor = '#d0d0d0')}
                        />
                        <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#aaa', fontFamily: 'system-ui, sans-serif' }}>
                          Il testo viene cifrato AES-256-GCM immediatamente. Non viene mai salvato in chiaro.
                        </p>
                      </div>

                      {/* Upload button */}
                      <button
                        onClick={handleUpload}
                        disabled={!canUpload}
                        style={{
                          padding: '16px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: '700',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          cursor: canUpload ? 'pointer' : 'not-allowed',
                          background: canUpload ? '#1a1a1a' : '#e8e8e8',
                          color: canUpload ? '#fff' : '#aaa',
                          transition: 'all 0.12s',
                          fontFamily: 'system-ui, sans-serif',
                        }}
                        onMouseEnter={e => { if (canUpload) e.currentTarget.style.background = '#333' }}
                        onMouseLeave={e => { if (canUpload) e.currentTarget.style.background = '#1a1a1a' }}
                      >
                        {uploading ? 'Cifratura e upload...' : 'Upload Prompt Genesi™'}
                      </button>

                      {/* Upload result */}
                      {uploadResult && (
                        <div style={{
                          borderRadius: '8px',
                          padding: '18px 20px',
                          border: `1.5px solid ${uploadResult.success ? '#16a34a' : '#dc2626'}`,
                          background: uploadResult.success ? '#f0fdf4' : '#fef2f2',
                        }}>
                          {uploadResult.success ? (
                            <>
                              <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16a34a', marginBottom: '12px', fontFamily: 'system-ui, sans-serif' }}>
                                ✓ Upload completato
                              </p>
                              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontFamily: 'system-ui, sans-serif' }}>
                                {[
                                  ['key', uploadResult.prompt_key],
                                  ['label', uploadResult.label],
                                  ['version', uploadResult.version],
                                  ['default', uploadResult.is_default ? 'sì' : 'no'],
                                ].map(([k, v]) => (
                                  <>
                                    <span key={k + 'k'} style={{ fontSize: '12px', color: '#888' }}>{k}</span>
                                    <span key={k + 'v'} style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: '500' }}>{v}</span>
                                  </>
                                ))}
                              </div>
                            </>
                          ) : (
                            <p style={{ fontSize: '14px', color: '#dc2626', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
                              ✗ {uploadResult.error}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
