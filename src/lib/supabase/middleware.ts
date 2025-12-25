import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Redirection logic
    let redirectResponse: NextResponse | null = null;
    const pathname = request.nextUrl.pathname;
    const isLoginPage = pathname.startsWith("/admin/login");

    if (
        !user &&
        !isLoginPage &&
        !pathname.startsWith("/auth") &&
        pathname.startsWith("/admin")
    ) {
        // No user, accessing protected route -> Redirect to Login
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        redirectResponse = NextResponse.redirect(url);
    } else if (user && isLoginPage) {
        // User logged in, accessing login page -> Redirect to Dashboard
        const url = request.nextUrl.clone();
        url.pathname = "/admin/hidden-agencies";
        redirectResponse = NextResponse.redirect(url);
    }

    if (redirectResponse) {
        // IMPORTANT: Copy updated cookies (session changes) to the redirect response
        const cookies = response.cookies.getAll();
        cookies.forEach((cookie) => {
            redirectResponse!.cookies.set(cookie.name, cookie.value, cookie);
        });
        return redirectResponse;
    }

    return response;
}
