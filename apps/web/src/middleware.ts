import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const role = request.cookies.get('user_role')?.value;
  const path = request.nextUrl.pathname;

  // 1. If on root (landing page) and logged in, redirect to respective dashboard
  if (path === '/') {
    if (role) {
      if (role === 'ministry_admin') return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      if (role === 'applicant') return NextResponse.redirect(new URL('/dashboard/applicant', request.url));
      if (role === 'institute_nodal_officer') return NextResponse.redirect(new URL('/dashboard/institute', request.url));
      if (role === 'scrutiny_officer') return NextResponse.redirect(new URL('/dashboard/scrutiny', request.url));
      if (role === 'selection_committee') return NextResponse.redirect(new URL('/dashboard/selection', request.url));
    }
    return NextResponse.next();
  }

  // 2. Unrestricted paths (like unauthorized page or static assets)
  if (path.startsWith('/unauthorized') || path.startsWith('/_next') || path.includes('/api/')) {
    return NextResponse.next();
  }

  // 3. If accessing a protected route without login
  if (!role && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url)); // Back to landing
  }

  // 4. Role-based routing guards
  if (path.startsWith('/dashboard/admin') && role !== 'ministry_admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  if (path.startsWith('/dashboard/applicant') && role !== 'applicant') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  if (path.startsWith('/dashboard/institute') && role !== 'institute_nodal_officer' && role !== 'ministry_admin') {
     // Admin can see it too, or strict? Prompt says: "roles should each only see their specific workbench... Add a route guard/middleware that redirects any user to a 403... if they try to access a URL for a role they don't have". Let's be strict.
     if (role !== 'institute_nodal_officer') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
     }
  }

  if (path.startsWith('/dashboard/scrutiny') && role !== 'scrutiny_officer') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (path.startsWith('/dashboard/selection') && role !== 'selection_committee') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
