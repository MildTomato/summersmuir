import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isProductionDeployment } from '@/lib/deployment';

export function proxy(request: NextRequest) {
  if (!isProductionDeployment || request.nextUrl.pathname === '/') {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL('/', request.url));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)',
  ],
};
