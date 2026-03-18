'use client'

// app/smartbrainup-ai/founder/public/page.tsx
// Founder Interface — Public Runtime
// Upload Public Surface Context + Prompt Genesi™ for the public chat
// Never shows prompt content after submit. Never stores in client.

import { useState } from 'react'

type UploadStatus = 'idle' | 'loading' | 'success' | 'error'

type RuntimeMeta = {
  prompt_key: string
  prompt_version: string
  public_context_version: string
  status: string
}

export default function FounderPublicPage() {
  const [promptText, setPromptText] = useState('')
  const [promptVersion, setPromptVersion] = useState('')
  const [publicContext, setPublicContext] = useState('')
  const [publicContextVersion, setPublicContextVersion] = useState('')

  const [status, setStatus] = useState<UploadStatus>('idle')
  const [result, setResult] = useState<RuntimeMeta | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async () => {
    if (!promptText || !promptVersion || !publicContext || !publicContextVersion) {
      setErrorMsg('Tutti i campi sono obbligatori.')
      return
    }

    setStatus('loading')
    setErrorMsg('')
    setResult(null)

    try {
      const res = await fetch('/api/founder/public-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_text: promptText,
          prompt_version: promptVersion,
          public_context: publicContext,
          public_context_version: publicContextVersion,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Upload failed.')
        return
      }

      setPromptText('')
      setPublicContext('')

      setResult({
        prompt_key: data.prompt_key,
        prompt_version: data.prompt_version,
        public_context_version: data.public_context_version,
        status: data.status,
      })

      setStatus('success')

    } catch {
      setStatus('error')
      setErrorMsg('Network error. Riprova.')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#fff',
    border: '1.5px solid #d0d0d0',
    borderRadius: '8px',
    padding: '14px 16px',
    fontSize: '16px',
    color: '#1a1a1a',
    outline: 'none',
    fontFamily: 'monospace',
    boxSizing: 'border-box',
  }

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    background: '#fff',
    border: '1.5px solid #d0d0d0',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '15px',
    color: '#1a1a1a',
    outline: 'none',
    fontFamily: 'monospace',
    resize: 'vertical',
    lineHeight: '1.65',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px',
    letterSpacing: '0.03em',
    fontFamily: 'system-ui, sans-serif',
    textTransform: 'uppercase',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '2px solid #1a1a1a' }}>
          <p style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: '12px', fontFamily: 'system-ui, sans-serif' }}>
            SmartBrainUp — Founder Interface / Public Runtime
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: '400', color: '#1a1a1a', margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Public Chat Configuration
          </h1>
          <p style={{ fontSize: '17px', color: '#555', margin: 0, lineHeight: 1.5, fontFamily: 'system-ui, sans-serif' }}>
            Carica il Public Surface Context e il Prompt Genesi™ per la public chat. Il contenuto non viene mai mostrato dopo il submit.
          </p>
        </div>

        {status !== 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

            {/* Public Surface Context */}
            <div>
              <label style={labelStyle}>01 — Public Surface Context</label>
              <textarea
                value={publicContext}
                onChange={e => setPublicContext(e.target.value)}
                rows={10}
                placeholder="Incolla il Public Surface Context..."
                style={textareaStyle}
                onFocus={e => (e.target.style.borderColor = '#1a1a1a')}
                onBlur={e => (e.target.style.borderColor = '#d0d0d0')}
              />
              <div style={{ marginTop: '16px' }}>
                <label style={{ ...labelStyle, fontSize: '12px' }}>Versione</label>
                <input
                  type="text"
                  value={publicContextVersion}
                  onChange={e => setPublicContextVersion(e.target.value)}
                  placeholder="es. 1.0"
                  style={{ ...inputStyle, width: '280px' }}
                  onFocus={e => (e.target.style.borderColor = '#1a1a1a')}
                  onBlur={e => (e.target.style.borderColor = '#d0d0d0')}
                />
              </div>
            </div>

            {/* Prompt Genesi */}
            <div>
              <label style={labelStyle}>02 — Prompt Genesi™</label>
              <textarea
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
                rows={10}
                placeholder="Incolla il Prompt Genesi™..."
                style={textareaStyle}
                onFocus={e => (e.target.style.borderColor = '#1a1a1a')}
                onBlur={e => (e.target.style.borderColor = '#d0d0d0')}
              />
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#999', fontFamily: 'system-ui, sans-serif' }}>
                Il testo viene cifrato AES-256-GCM immediatamente. Non viene mai salvato in chiaro.
              </p>
              <div style={{ marginTop: '16px' }}>
                <label style={{ ...labelStyle, fontSize: '12px' }}>Versione</label>
                <input
                  type="text"
                  value={promptVersion}
                  onChange={e => setPromptVersion(e.target.value)}
                  placeholder="es. 1.0"
                  style={{ ...inputStyle, width: '280px' }}
                  onFocus={e => (e.target.style.borderColor = '#1a1a1a')}
                  onBlur={e => (e.target.style.borderColor = '#d0d0d0')}
                />
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <div style={{ padding: '14px 16px', borderRadius: '8px', border: '1.5px solid #dc2626', background: '#fef2f2' }}>
                <p style={{ fontSize: '14px', color: '#dc2626', margin: 0, fontFamily: 'system-ui, sans-serif' }}>✗ {errorMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '15px',
                fontWeight: '700',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                background: status === 'loading' ? '#e0e0e0' : '#1a1a1a',
                color: status === 'loading' ? '#aaa' : '#fff',
                transition: 'all 0.15s',
                fontFamily: 'system-ui, sans-serif',
              }}
              onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.background = '#333' }}
              onMouseLeave={e => { if (status !== 'loading') e.currentTarget.style.background = '#1a1a1a' }}
            >
              {status === 'loading' ? 'Upload in corso...' : '03 — Upload Public Runtime'}
            </button>

          </div>
        )}

        {/* Success */}
        {status === 'success' && result && (
          <div style={{ borderRadius: '8px', border: '1.5px solid #16a34a', background: '#f0fdf4', padding: '24px' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16a34a', marginBottom: '20px', fontFamily: 'system-ui, sans-serif' }}>
              ✓ Public runtime attivato
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '10px', fontFamily: 'system-ui, sans-serif' }}>
              {[
                ['prompt_key', result.prompt_key],
                ['prompt_version', result.prompt_version],
                ['public_context_version', result.public_context_version],
                ['status', result.status],
              ].map(([k, v]) => (
                <>
                  <span key={k + 'k'} style={{ fontSize: '13px', color: '#888' }}>{k}</span>
                  <span key={k + 'v'} style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: '500' }}>{v}</span>
                </>
              ))}
            </div>
            <button
              onClick={() => { setStatus('idle'); setResult(null); setPromptVersion(''); setPublicContextVersion('') }}
              style={{
                marginTop: '24px', padding: '12px 20px', borderRadius: '8px',
                border: '1.5px solid #d0d0d0', background: '#fff', color: '#555',
                fontSize: '14px', cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
                fontWeight: '500', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#d0d0d0')}
            >
              Carica nuova versione
            </button>
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
