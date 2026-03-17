// app/api/founder/public-upload/route.ts
// Founder-only — uploads Public Surface Context + Prompt Genesi™ for public runtime
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
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'developer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ── Parse body ──
    const { prompt_text, prompt_version, public_context, public_context_version } = await request.json()

    if (!prompt_text || !prompt_version || !public_context || !public_context_version) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // ── Encrypt Prompt Genesi™ ──
    const encryptionKey = process.env.PROMPT_ENCRYPTION_KEY
    if (!encryptionKey) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    const keyBuffer = Buffer.from(encryptionKey, 'hex')
    if (keyBuffer.length !== 32) return NextResponse.json({ error: 'Invalid key' }, { status: 500 })

    const encrypted_prompt = encrypt(prompt_text, keyBuffer)
    const prompt_key = 'public-v1'

    const supabaseAdmin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ── Upsert Prompt Genesi™ into prompt_registry ──
    const { error: registryError } = await supabaseAdmin
      .from('prompt_registry')
      .upsert(
        { prompt_key, encrypted_prompt, version: prompt_version },
        { onConflict: 'prompt_key' }
      )

    if (registryError) {
      return NextResponse.json({ error: 'Registry write failed' }, { status: 500 })
    }

    // ── Update public_runtime ──
    const { error: runtimeError } = await supabaseAdmin
      .from('public_runtime')
      .update({
        prompt_key,
        prompt_version,
        prompt_status: 'active',
        public_context,
        public_context_version,
        public_context_status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('prompt_key', 'public-v1')

    if (runtimeError) {
      return NextResponse.json({ error: 'Runtime update failed' }, { status: 500 })
    }

    // ── Safe response — no content ever returned ──
    return NextResponse.json({
      success: true,
      prompt_key,
      prompt_version,
      public_context_version,
      status: 'active'
    })

  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
