import OpenAI from 'openai'

const publicClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_PUBLIC,
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const input = messages.map((msg: { role: string; content: string }) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }))

  const stream = await publicClient.responses.create({
    model: 'gpt-4.1-mini',
    prompt: {
      id: process.env.OPENAI_PROMPT_ID_PUBLIC!,
      version: '2',
    },
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
}
