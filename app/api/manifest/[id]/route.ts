// app/api/manifest/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url)
  const color = searchParams.get('color') || '#e0e0e0'
  const name = searchParams.get('name') || 'Second Brain'

  const manifest = {
    name: name,
    short_name: name.length > 12 ? name.slice(0, 12) : name,
    description: 'AI-UP Second Brain™',
    start_url: `/brain/${params.id}`,
    display: 'standalone',
    background_color: color,
    theme_color: color,
    icons: [
      {
        src: `/api/icon/${params.id}?color=${encodeURIComponent(color)}&size=192`,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: `/api/icon/${params.id}?color=${encodeURIComponent(color)}&size=512`,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  })
}
