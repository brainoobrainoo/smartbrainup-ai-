import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Skip static files
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // --- SUPABASE SESSION REFRESH ---
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /client routes
  if (!user && pathname.startsWith('/client')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect logged users away from /login
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/client'
    return NextResponse.redirect(url)
  }

  // Skip API, auth and login routes from rewriting
  if (pathname.startsWith('/api') || pathname.startsWith('/auth') || pathname.startsWith('/login')) {
    return response
  }

  // --- HOST-BASED ROUTING ---
  const surfaceParam = request.nextUrl.searchParams.get('surface')

  let surface = 'smartbrainup-ai'

  if (surfaceParam === 'brainoo') {
    surface = 'brainoo'
  } else if (surfaceParam === 'smartbrainup-com') {
    surface = 'smartbrainup-com'
  } else if (host.includes('smartbrainup.com') || host.includes('smartbrainup-com')) {
    surface = 'smartbrainup-com'
  } else if (host.includes('smartbrainup.ai') || host.includes('smartbrainup-ai') || host.includes('smartbrainup')) {
    surface = 'smartbrainup-ai'
  } else if (host.includes('brainoo.ai') || host === 'brainoo') {
    surface = 'brainoo'
  }
  // Any unknown host (Vercel preview URLs) → smartbrainup-ai by default

  const url = request.nextUrl.clone()
  url.pathname = '/' + surface + (pathname === '/' ? '' : pathname)

  const rewrittenResponse = NextResponse.rewrite(url, { request })

  // Copy Supabase cookies to rewritten response
  response.cookies.getAll().forEach((cookie) => {
    rewrittenResponse.cookies.set(cookie.name, cookie.value)
  })

  return rewrittenResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
