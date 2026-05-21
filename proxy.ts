import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/routing';

const intlMiddleware = createMiddleware(routing);

export function proxy(request: Parameters<typeof intlMiddleware>[0]) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|fleet|images|destinations).*)',
  ],
};
