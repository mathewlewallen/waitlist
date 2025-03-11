import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/app(.*)',
  '/admin(.*)',
  '/api(.*)',
  '/trpc(.*)',
  '/recipes(.*)',
])

type UserMetadata = {
  isBetaUser?: boolean
  isAdmin?: boolean
}

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth()
  if (isProtectedRoute(req)) {
    await auth.protect()

    const { isAdmin, isBetaUser } = sessionClaims?.metadata as UserMetadata
    if(isAdmin) {
      return
    }
    if(!isAdmin && req.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.error()
    }
    if(!isBetaUser) {
      return NextResponse.redirect(new URL('/waitlist', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/((?!.*\\..*|_next).*)',
    '/',
  ],
} 