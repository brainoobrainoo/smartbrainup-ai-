// app/api/public-chat/route.ts
// Public chat — composes 3 layers server-side at runtime
// Prompt Genesi™ decrypted only in RAM. Never logged. Never exposed.

import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import { createDecipheriv } from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALGORITHM = 'aes-256-gcm'

function decrypt(encrypted: string, key: Buffer): string {
  const [ivB64, tagB64, dataB64] = encrypted.split(':')
  const iv = Buffer.from(ivB64, 'base64')
  const tag = Buffer.from(tagB64, 'base64')
  const data = Buffer.from(dataB64, 'base64')
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
}

const SYSTEM_RUNTIME = `You are the public interface of the AI-UP Second Brain™ method by SmartBrainUp.
Your role is to explain the method, answer questions, and guide visitors toward BUILD.
You do not build Second Brains here. You do not collect personal context.
You do not replace the questionnaire or the private activation flow.
Be clear, essential, and direct. One focused response at a time.`

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_PUBLIC || process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ── Load public runtime record ──
    const { data: runtime } = await supabaseAdmin
      .from('public_runtime')
      .select('prompt_key, prompt_status, public_context, public_context_status')
      .eq('prompt_key', 'public-v1')
      .single()

    let promptGenesi: string | null = null
    let publicContext: string | null = null

    // ── Load and decrypt Prompt Genesi™ ──
    if (runtime?.prompt_key && runtime.prompt_status === 'active') {
      const { data: registry } = await supabaseAdmin
        .from('prompt_registry')
        .select('encrypted_prompt')
        .eq('prompt_key', runtime.prompt_key)
        .single()

      if (registry?.encrypted_prompt) {
        try {
          const encryptionKey = process.env.PROMPT_ENCRYPTION_KEY
          if (encryptionKey) {
            const keyBuffer = Buffer.from(encryptionKey, 'hex')
            promptGenesi = decrypt(registry.encrypted_prompt, keyBuffer)
          }
        } catch {
          // Never log — could contain sensitive data
        }
      }
    }

    // ── Load Public Surface Context ──
    if (runtime?.public_context && runtime.public_context_status === 'active') {
      publicContext = runtime.public_context
    }

    // ── Compose instructions: System Runtime + Public Context + Prompt Genesi™ ──
    const instructionParts: string[] = [SYSTEM_RUNTIME]
    if (publicContext) instructionParts.push(publicContext)
    if (promptGenesi) instructionParts.push(promptGenesi)
    const instructions = instructionParts.join('\n\n---\n\n')

    // ── Format input ──
    const input = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))

    // ── Stream response ──
    const stream = await openai.responses.create({
      model: 'gpt-4.1-mini',
      instructions,
      input,
      stream: true,
    })

    const encoder = new TextEncoder()
    const textStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'response.output_text.delta') {
              controller.enqueue(encoder.encode(event.delta))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(textStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })

  } catch {
    return new Response('Internal server error', { status: 500 })
  }
}
