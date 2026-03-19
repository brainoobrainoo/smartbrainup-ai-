import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File
    const assessmentId = formData.get('assessment_id') as string
    const fileType = formData.get('file_type') as string // 'audio' | 'image' | 'document'

    if (!file || !assessmentId) {
      return Response.json({ error: 'Missing file or assessment_id' }, { status: 400 })
    }

    // 1. Upload to Supabase Storage
    const ext = file.name.split('.').pop() || 'bin'
    const storagePath = `${user.id}/${assessmentId}/${Date.now()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data: storageData, error: storageError } = await supabase.storage
      .from('phase3-assets')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (storageError) {
      console.error('Storage error:', storageError)
      return Response.json({ error: 'Storage upload failed' }, { status: 500 })
    }

    // 2. Get public URL
    const { data: urlData } = supabase.storage
      .from('phase3-assets')
      .getPublicUrl(storagePath)

    const fileUrl = urlData?.publicUrl || storagePath

    // 3. Insert into files — return id (MANDATORY)
    const { data: fileRecord, error: fileError } = await supabase
      .from('files')
      .insert({
        user_id: user.id,
        assessment_id: parseInt(assessmentId),
        file_url: fileUrl,
        file_type: fileType || file.type,
      })
      .select()
      .single()

    if (fileError || !fileRecord) {
      console.error('File insert error:', fileError)
      return Response.json({ error: 'File record failed' }, { status: 500 })
    }

    const file_id = fileRecord.id

    // 4. Insert into context_extractions — all null, structure only
    const { error: extractionError } = await supabase
      .from('context_extractions')
      .insert({
        asset_id: file_id,
        raw_text: null,
        transcript: null,
        summary: null,
        signals_extracted: null,
      })

    if (extractionError) {
      console.error('Context extraction insert error:', extractionError)
      return Response.json({ error: 'Context extraction failed' }, { status: 500 })
    }

    return Response.json({ success: true, file_id })

  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
