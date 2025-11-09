import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	// Public paths that don't require authentication
	const isPublicPath = nextUrl.pathname.startsWith("/login");

	// If not logged in and trying to access protected route
	if (!isLoggedIn && !isPublicPath) {
		const loginUrl = new URL("/login", nextUrl.origin);
		loginUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
		return NextResponse.redirect(loginUrl);
	}

	// Allow access to login page even if logged in
	// NextAuth will handle post-login redirects automatically

	return NextResponse.next();
});

export const config = {
	// Skip API routes, NextAuth routes, static files
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|assets).*)"],
};
