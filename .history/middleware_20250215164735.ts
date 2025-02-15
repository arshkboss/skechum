import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from "@/utils/supabase/middleware";

// Define protected routes that require authentication
const protectedRoutes = [
  '/create',
  '/profile',
  '/settings',
  '/transaction/success',
  '/api/protected',
  '/account',
  '/test',
  // Add more protected routes here
];

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if it's a browser request to /api
  if (path.startsWith('/api')) {
    const referer = request.headers.get('referer')
    const isDirectBrowserAccess = !referer || referer.includes('/api')
    
    if (isDirectBrowserAccess) {
      // Redirect browser requests to home
      return NextResponse.redirect(new URL('/', request.url))
    }

    // For legitimate API requests, add security headers
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    return response
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    '/api/:path*',  // Match all API routes
  ],
};
