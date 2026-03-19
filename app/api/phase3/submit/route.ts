import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import OpenAI from 'openai'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { assessment_id, second_brain_id } = await req.json()

    if (!assessment_id || !second_brain_id) {
      return Response.json({ error: 'Missing assessment_id or second_brain_id' }, { status: 400 })
    }

    // 1. Fetch assessment responses (phase1 + phase2 + phase3)
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('responses')
      .eq('id', assessment_id)
      .single()

    if (assessmentError || !assessment) {
      return Response.json({ error: 'Assessment not found' }, { status: 404 })
    }

    const { phase1, phase2, phase3 } = assessment.responses || {}

    // 2. Fetch all context_extractions for this second_brain
    const { data: files } = await supabase
      .from('files')
      .select('id, asset_type, source')
      .eq('second_brain_id', second_brain_id)
      .eq('phase', 'phase3')
      .eq('status', 'processed')

    let extractedSignals = ''

    if (files && files.length > 0) {
      const fileIds = files.map((f: any) => f.id)
      const { data: extractions } = await supabase
        .from('context_extractions')
        .select('raw_text, transcript, summary')
        .in('asset_id', fileIds)

      if (extractions && extractions.length > 0) {
        extractedSignals = extractions
          .map((e: any) => e.transcript || e.raw_text || '')
          .filter(Boolean)
          .join('\n\n')
      }
    }

    // 3. Build consolidated context for GPT
    const contextBlocks = [
      phase1 && Object.keys(phase1).length > 0
        ? `PHASE 1 — IDENTITY & DIRECTION:\n${JSON.stringify(phase1, null, 2)}`
        : null,
      phase2 && Object.keys(phase2).length > 0
        ? `PHASE 2 — EXECUTION & STYLE:\n${JSON.stringify(phase2, null, 2)}`
        : null,
      phase3 && phase3.length > 0
        ? `PHASE 3 — PROJECT DESCRIPTION:\n${phase3}`
        : null,
      extractedSignals.length > 0
        ? `PHASE 3 — ADDITIONAL CONTEXT (from audio/files):\n${extractedSignals}`
        : null,
    ].filter(Boolean).join('\n\n---\n\n')

    if (!contextBlocks) {
      return Response.json({ error: 'No context available to generate summary' }, { status: 400 })
    }

    // 4. Generate brain_summary via GPT
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are building the Second Brain context for a client.
Analyze all the input provided and generate a structured summary with these sections:
**IDENTITY:** (who the client is, their role, sector)
**OBJECTIVES:** (main goals and desired outcomes)
**WORKING STYLE:** (how they prefer to work, communication style)
**CONTEXT:** (specific project details, current situation)
**DECISIONS:** (any decisions already made or direction indicated)
**KEY DETAILS:** (important specifics to remember)

Be precise, concise, and use only what is explicitly stated.
Do not invent or assume anything not present in the input.`,
        },
        {
          role: 'user',
          content: contextBlocks,
        },
      ],
      max_tokens: 1500,
    })

    const summaryText = completion.choices[0]?.message?.content || ''

    if (!summaryText) {
      return Response.json({ error: 'Summary generation failed' }, { status: 500 })
    }

    // 5. Upsert brain_summary
    const { error: summaryError } = await supabase
      .from('brain_summary')
      .upsert(
        { brain_id: second_brain_id, summary_text: summaryText, updated_at: new Date().toISOString() },
        { onConflict: 'brain_id' }
      )

    if (summaryError) {
      console.error('brain_summary upsert error:', summaryError)
      return Response.json({ error: 'Failed to save brain summary' }, { status: 500 })
    }

    // 6. Mark assessment as submitted
    await supabase
      .from('assessments')
      .update({ submitted: true, phase2_complete: true })
      .eq('id', assessment_id)

    return Response.json({ success: true, summary: summaryText })

  } catch (error) {
    console.error('Submit error:', error)
    return Response.json({ error: 'Submit failed' }, { status: 500 })
  }
}
