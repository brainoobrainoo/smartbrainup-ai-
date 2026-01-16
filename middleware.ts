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

  // Determine which surface based on host
  let surface = 'smartbrainup-ai'

  if (host.includes('smartbrainup-com') || host.includes('smartbrainup.com')) {
    surface = 'smartbrainup-com'
  } else if (host.includes('brainoo')) {
    surface = 'brainoo'
  }

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
