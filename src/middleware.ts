import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { JWT } from 'next-auth/jwt'

const isExpired = (expiresAt?: string) => !!expiresAt && Date.now() > Date.parse(expiresAt)

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const pathname = url.pathname

  const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) as JWT | null

  const isAuthPage = pathname.startsWith('/auth')
  const isPrivate = pathname.startsWith('/dashboard') // adicione mais padrões se quiser

  if (token && isAuthPage) {
    if (isExpired(token.expiresAt)) {
      return NextResponse.redirect(new URL('/signin', req.url))
    }
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (isPrivate && !token) {
    const signin = new URL('/signin', req.url)
    signin.searchParams.set('callbackUrl', url.pathname + url.search)
    return NextResponse.redirect(signin)
  }

  if (isPrivate && token && isExpired(token.expiresAt)) {
    const signin = new URL('/signin', req.url)
    signin.searchParams.set('callbackUrl', url.pathname + url.search)
    return NextResponse.redirect(signin)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/auth/:path*']
}
