import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // Allow requests to the API routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to login page
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Check for user role and restrict access accordingly
  if (token) {
    const userRole = token.role as string | undefined

    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (pathname.startsWith('/manager') && !['manager', 'admin'].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (pathname.startsWith('/member') && !['member', 'admin'].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/member/:path*', '/admin/:path*', '/manager/:path*', '/login'],
}