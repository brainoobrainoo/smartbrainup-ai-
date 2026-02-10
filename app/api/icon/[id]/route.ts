import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url)
  const color = searchParams.get('color') || '#e0e0e0'
  const size = parseInt(searchParams.get('size') || '512')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${color}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size*0.225}" fill="rgba(255,255,255,0.85)"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size*0.075}" fill="${color}"/>
  </svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}
