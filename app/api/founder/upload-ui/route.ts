// app/api/founder/upload-ui/route.ts
// Upload Prompt Genesi via UI — session authenticated, role verified
// Supports multiple prompts per brain via chats table
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
    const { brain_id, prompt_key, prompt_text, version, label, is_default, dce_entry_questions, context_summary, dce_description } = await request.json()

    if (!brain_id || !prompt_key || !prompt_text || !version || !label) {
      return NextResponse.json({
        error: 'Missing fields: brain_id, prompt_key, prompt_text, version, label'
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

    // ── Upsert prompt_registry (with second_brain_id) ──
    const { error: registryError } = await supabaseAdmin
      .from('prompt_registry')
      .upsert(
        {
          prompt_key,
          encrypted_prompt,
          version,
          second_brain_id: brain_id,
          dce_entry_questions: dce_entry_questions || [],
          context_summary: context_summary || null,
          dce_description: dce_description || null,
        },
        { onConflict: 'prompt_key' }
      )

    if (registryError) {
      return NextResponse.json({ error: 'Registry write failed' }, { status: 500 })
    }

    // ── If is_default, reset all other chats for this brain ──
    if (is_default) {
      await supabaseAdmin
        .from('chats')
        .update({ is_default: false })
        .eq('second_brain_id', brain_id)
    }

    // ── Upsert into chats ──
    // Get current max sort_order for this brain
    const { data: existingChats } = await supabaseAdmin
      .from('chats')
      .select('sort_order, prompt_key')
      .eq('second_brain_id', brain_id)
      .order('sort_order', { ascending: false })
      .limit(1)

    const isExisting = existingChats?.find(c => c.prompt_key === prompt_key)
    const nextSortOrder = existingChats && existingChats.length > 0
      ? (existingChats[0].sort_order || 0) + 1
      : 0

    if (isExisting) {
      // Update existing chat entry
      const { error: chatUpdateError } = await supabaseAdmin
        .from('chats')
        .update({ label, is_default: !!is_default })
        .eq('second_brain_id', brain_id)
        .eq('prompt_key', prompt_key)

      if (chatUpdateError) {
        return NextResponse.json({ error: 'Chat update failed' }, { status: 500 })
      }
    } else {
      // Insert new chat entry
      const { error: chatInsertError } = await supabaseAdmin
        .from('chats')
        .insert({
          second_brain_id: brain_id,
          prompt_key,
          label,
          is_default: !!is_default,
          sort_order: nextSortOrder,
        })

      if (chatInsertError) {
        return NextResponse.json({ error: 'Chat insert failed' }, { status: 500 })
      }
    }

    // ── Update second_brains if this is the default prompt ──
    if (is_default) {
      await supabaseAdmin
        .from('second_brains')
        .update({
          prompt_key,
          prompt_version: version,
          prompt_status: 'active'
        })
        .eq('id', brain_id)
    }

    // ── Safe response — no prompt content ever returned ──
    return NextResponse.json({
      success: true,
      brain_id,
      prompt_key,
      version,
      label,
      is_default: !!is_default,
      status: 'active'
    })

  } catch {
    // Never log error details — may contain prompt content
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
