import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import OpenAI from 'openai'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File
    const secondBrainId = formData.get('second_brain_id') as string
    const assetType = formData.get('asset_type') as string // 'audio' | 'text' | 'document'
    const source = formData.get('source') as string // 'input_bar_audio' | 'file_upload' | 'text'

    if (!file || !secondBrainId) {
      return Response.json({ error: 'Missing file or second_brain_id' }, { status: 400 })
    }

    // 1. Upload to Supabase Storage
    const ext = file.name.split('.').pop() || 'bin'
    const storagePath = `${user.id}/${secondBrainId}/${Date.now()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: storageError } = await supabase.storage
      .from('phase3-assets')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (storageError) {
      console.error('Storage error:', storageError)
      return Response.json({ error: 'Storage upload failed' }, { status: 500 })
    }

    // 2. Record in files table
    const { data: fileRecord, error: fileError } = await supabase
      .from('files')
      .insert({
        user_id: user.id,
        second_brain_id: secondBrainId,
        phase: 'phase3',
        asset_type: assetType,
        source: source,
        storage_path: storagePath,
        mime_type: file.type,
        size_bytes: file.size,
        status: 'processing',
      })
      .select('id')
      .single()

    if (fileError || !fileRecord) {
      return Response.json({ error: 'File record failed' }, { status: 500 })
    }

    // 3. Transcribe if audio
    let transcript = ''
    if (assetType === 'audio') {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY_PUBLIC })
        const transcription = await openai.audio.transcriptions.create({
          file: file,
          model: 'whisper-1',
        })
        transcript = transcription.text
      } catch (e) {
        console.error('Transcription error:', e)
      }
    }

    const rawText = assetType === 'text' ? await file.text() : transcript

    // 4. Save to context_extractions
    await supabase.from('context_extractions').insert({
      asset_id: fileRecord.id,
      raw_text: rawText,
      transcript: transcript || null,
    })

    // 5. Update file status
    await supabase.from('files')
      .update({ status: 'processed', transcript: transcript || null })
      .eq('id', fileRecord.id)

    return Response.json({
      success: true,
      file_id: fileRecord.id,
      transcript: transcript || null,
      raw_text: rawText,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
