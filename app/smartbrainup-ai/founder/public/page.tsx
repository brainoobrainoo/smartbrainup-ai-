'use client'

// app/smartbrainup-ai/founder/public/page.tsx
// Founder Interface — Public Runtime
// Upload Public Surface Context + Prompt Genesi™ for the public chat
// Never shows prompt content after submit. Never stores in client.

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type UploadStatus = 'idle' | 'loading' | 'success' | 'error'

type RuntimeMeta = {
  prompt_key: string
  prompt_version: string
  public_context_version: string
  status: string
}

export default function FounderPublicPage() {
  const router = useRouter()

  const [promptText, setPromptText] = useState('')
  const [promptVersion, setPromptVersion] = useState('')
  const [publicContext, setPublicContext] = useState('')
  const [publicContextVersion, setPublicContextVersion] = useState('')

  const [status, setStatus] = useState<UploadStatus>('idle')
  const [result, setResult] = useState<RuntimeMeta | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async () => {
    if (!promptText || !promptVersion || !publicContext || !publicContextVersion) {
      setErrorMsg('All fields are required.')
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

      // Clear sensitive fields immediately after submit
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
      setErrorMsg('Network error. Try again.')
    }
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '8px',
  }

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'monospace',
    fontSize: '13px',
    lineHeight: 1.6,
    resize: 'vertical',
    outline: 'none',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'monospace',
    fontSize: '13px',
    outline: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111',
      color: 'rgba(255,255,255,0.85)',
      fontFamily: 'var(--font-inter), sans-serif',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
            Founder Interface — Public Runtime
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, margin: 0 }}>
            Public Chat Configuration
          </h1>
          <p style={{ marginTop: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
            Upload Public Surface Context and Prompt Genesi™ for the public chat.<br />
            Both fields are required. Content is never shown after submit.
          </p>
        </div>

        {status !== 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Public Surface Context */}
            <div>
              <label style={labelStyle}>Public Surface Context</label>
              <textarea
                value={publicContext}
                onChange={e => setPublicContext(e.target.value)}
                rows={8}
                placeholder="Paste the Public Surface Context here..."
                style={textareaStyle}
              />
              <div style={{ marginTop: '8px' }}>
                <label style={{ ...labelStyle, marginBottom: '6px' }}>Version</label>
                <input
                  type="text"
                  value={publicContextVersion}
                  onChange={e => setPublicContextVersion(e.target.value)}
                  placeholder="e.g. 1.0"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Prompt Genesi™ */}
            <div>
              <label style={labelStyle}>Prompt Genesi™</label>
              <textarea
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
                rows={8}
                placeholder="Paste Prompt Genesi™ here..."
                style={{ ...textareaStyle, borderColor: 'rgba(255,255,255,0.15)' }}
              />
              <div style={{ marginTop: '8px' }}>
                <label style={{ ...labelStyle, marginBottom: '6px' }}>Version</label>
                <input
                  type="text"
                  value={promptVersion}
                  onChange={e => setPromptVersion(e.target.value)}
                  placeholder="e.g. 1.0"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <div style={{ fontSize: '13px', color: '#ff6b6b' }}>{errorMsg}</div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              style={{
                padding: '14px 28px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: status === 'loading' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
                color: '#111',
                fontSize: '14px',
                fontWeight: 600,
                cursor: status === 'loading' ? 'default' : 'pointer',
                alignSelf: 'flex-start',
              }}
            >
              {status === 'loading' ? 'Uploading...' : 'Upload Public Runtime'}
            </button>

          </div>
        )}

        {/* Success */}
        {status === 'success' && result && (
          <div style={{
            padding: '24px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}>
            <div style={{ fontSize: '13px', color: 'rgba(100,220,120,0.9)', fontWeight: 600, marginBottom: '20px' }}>
              ✓ Public runtime activated
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'prompt_key', value: result.prompt_key },
                { label: 'prompt_version', value: result.prompt_version },
                { label: 'public_context_version', value: result.public_context_version },
                { label: 'status', value: result.status },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: '16px', fontSize: '13px', fontFamily: 'monospace' }}>
                  <span style={{ color: 'rgba(255,255,255,0.35)', minWidth: '200px' }}>{row.label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{row.value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setStatus('idle')
                setResult(null)
                setPromptVersion('')
                setPublicContextVersion('')
              }}
              style={{
                marginTop: '24px',
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.15)',
                backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Upload new version
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
