import NextAuth from "next-auth";
import { NextResponse } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/login", "/register"];

// Create a minimal auth config for middleware (without Prisma)
const { auth } = NextAuth({
  providers: [],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    authorized: ({ auth }) => !!auth,
  },
});

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect non-logged-in users to login page for protected routes
  if (!isLoggedIn && !isPublicRoute && nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
