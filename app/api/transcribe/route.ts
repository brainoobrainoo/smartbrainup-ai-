import OpenAI from 'openai'

export async function POST(req: Request) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const formData = await req.formData()
    const audio = formData.get('file') as File

    if (!audio) {
      return Response.json({ error: 'No audio file' }, { status: 400 })
    }

    const transcription = await client.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
    })

    return Response.json({ text: transcription.text })
  } catch (error) {
    console.error('Transcription error:', error)
    return Response.json({ error: 'Transcription failed' }, { status: 500 })
  }
}
