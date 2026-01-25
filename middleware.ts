import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/signup' || path === '/' || path === '/suspended' || path === '/contact' || path === '/about' || path === '/forgot-password' || path === '/feedback';

  // Check if user is authenticated by looking for user data in cookies
  const isAuthenticated = request.cookies.has('user');
  
  // Check if user is admin by looking for admin session and user data
  let isAdmin = false;
  if (isAuthenticated) {
    try {
      const userCookie = request.cookies.get('user');
      if (userCookie) {
        const userData = JSON.parse(userCookie.value);
        isAdmin = userData.isAdmin === true || userData.role === 'admin';
      }
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users to login page for protected routes
  if (!isAuthenticated && path.startsWith('/select')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect admin routes - require admin authentication
  if (path.startsWith('/admin')) {
    // Allow access to admin login page for non-authenticated users
    if (path === '/admin' && !isAuthenticated) {
      return NextResponse.next();
    }
    
    // For all other admin routes, require admin authentication
    if (path.startsWith('/admin/') || (path === '/admin' && isAuthenticated)) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      
      if (!isAdmin) {
        // Non-admin users trying to access admin routes get redirected to home
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  // Protect admin API routes
  if (path.startsWith('/api/admin') && !path.startsWith('/api/admin/send-otp') && !path.startsWith('/api/admin/verify-otp')) {
    if (!isAuthenticated || !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/select/:path*', '/login', '/signup', '/', '/contact', '/about', '/feedback', '/admin/:path*', '/api/admin/:path*']
}; 