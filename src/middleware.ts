import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware({
    locales: ['en', 'fr', 'ar'],
    defaultLocale: 'fr',
    localePrefix: 'always' // Forces /fr, /en, /ar prefixes
});

export default async function middleware(request: NextRequest) {
    // 1. Run next-intl middleware to handle locale routing
    const response = intlMiddleware(request);

    // 2. Run Supabase auth check, passing the intl response
    // This ensures session cookies are set on the response that next-intl prepared
    return await updateSession(request, response);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
