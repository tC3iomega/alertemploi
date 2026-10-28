import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // robots.txt et sitemap.xml doivent rester accessibles sans session : sinon le proxy
  // d'authentification les redirige vers l'accueil et les moteurs ne peuvent pas les lire.
  matcher: [
    '/((?!_next/static|_next/image|favicons|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
};
