import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check for surface override (for local testing via IP)
  const surfaceParam = request.nextUrl.searchParams.get('surface')
  
  // Determine which surface based on host
  let surface = 'smartbrainup-ai'

  if (surfaceParam === 'brainoo') {
    surface = 'brainoo'
  } else if (surfaceParam === 'smartbrainup-com') {
    surface = 'smartbrainup-com'
  } else if (host.includes('smartbrainup-com') || host.includes('smartbrainup.com')) {
    surface = 'smartbrainup-com'
  } else if (host.includes('brainoo')) {
    surface = 'brainoo'
  }
  // IP locale = smartbrainup-ai (default)

  // Rewrite to the appropriate route
  const url = request.nextUrl.clone()
  url.pathname = `/${surface}${pathname === '/' ? '' : pathname}`
  
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
