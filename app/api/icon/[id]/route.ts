// app/api/icon/[id]/route.ts

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url)
  const color = searchParams.get('color') || '#e0e0e0'
  const size = parseInt(searchParams.get('size') || '512')

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* White circle */}
        <div
          style={{
            width: size * 0.45,
            height: size * 0.45,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Inner dot */}
          <div
            style={{
              width: size * 0.15,
              height: size * 0.15,
              borderRadius: '50%',
              background: color,
            }}
          />
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
    }
  )
}
