import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const isAuthRoute =
    request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/sign-up";

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL("/", baseUrl));
    }

    const { searchParams, pathname } = new URL(request.url);

    if (!searchParams.get("noteId") && pathname === "/" && user) {
      const fetchNewest = await fetch(
        `${baseUrl}/api/fetch-newest-note?userId=${user.id}`,
      );
      const { newestNoteId } = await fetchNewest.json();

      const url = request.nextUrl.clone();

      if (newestNoteId) {
        url.searchParams.set("noteId", newestNoteId);
        return NextResponse.redirect(url);
      }

      const createNoteRes = await fetch(
        `${baseUrl}/api/create-new-note?userId=${user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      const { noteId } = await createNoteRes.json();
      url.searchParams.set("noteId", noteId);
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (err) {
    console.error("Middleware error:", err);
    return supabaseResponse;
  }
}
