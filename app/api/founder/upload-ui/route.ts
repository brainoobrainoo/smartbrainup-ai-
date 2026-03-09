// app/api/founder/upload-ui/route.ts
// Upload Prompt Genesi via UI — session authenticated, role verified
// Never logs prompt content. Never exposes to client.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { createCipheriv, randomBytes } from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALGORITHM = 'aes-256-gcm'

function encrypt(text: string, key: Buffer): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv.toString('base64'), tag.toString('base64'), encrypted.toString('base64')].join(':')
}

export async function POST(request: NextRequest) {
  try {
    // ── Verify session ──
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Verify role = developer ──
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'developer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ── Parse body ──
    const { brain_id, prompt_key, prompt_text, version } = await request.json()

    if (!brain_id || !prompt_key || !prompt_text || !version) {
      return NextResponse.json({
        error: 'Missing fields: brain_id, prompt_key, prompt_text, version'
      }, { status: 400 })
    }

    // ── Encrypt ──
    const encryptionKey = process.env.PROMPT_ENCRYPTION_KEY
    if (!encryptionKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const keyBuffer = Buffer.from(encryptionKey, 'hex')
    if (keyBuffer.length !== 32) {
      return NextResponse.json({ error: 'Invalid encryption key length' }, { status: 500 })
    }

    const encrypted_prompt = encrypt(prompt_text, keyBuffer)

    // ── Supabase admin ──
    const supabaseAdmin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Upsert into prompt_registry
    const { error: registryError } = await supabaseAdmin
      .from('prompt_registry')
      .upsert(
        { prompt_key, encrypted_prompt, version },
        { onConflict: 'prompt_key' }
      )

    if (registryError) {
      return NextResponse.json({ error: 'Registry write failed' }, { status: 500 })
    }

    // Update second_brains
    const { error: brainError } = await supabaseAdmin
      .from('second_brains')
      .update({
        prompt_key,
        prompt_version: version,
        prompt_status: 'active'
      })
      .eq('id', brain_id)

    if (brainError) {
      return NextResponse.json({ error: 'Brain update failed' }, { status: 500 })
    }

    // ── Safe response — no prompt content ever returned ──
    return NextResponse.json({
      success: true,
      brain_id,
      prompt_key,
      version,
      status: 'active'
    })

  } catch {
    // Never log error details — may contain prompt content
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
