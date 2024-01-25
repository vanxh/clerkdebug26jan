import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  beforeAuth: (req) => {
    const url = req.nextUrl.clone();

    if (url.pathname.includes("api/trpc")) {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  publicRoutes: [
    "/api",
    "/api/(.*)",
    "/api/",
    "/sign-in",
    "/sign-up",
    "/api/webhook/clerk",
  ],
  afterAuth: (auth, req) => {
    if (auth.isPublicRoute || auth.isApiRoute) return NextResponse.next();

    if (!auth.userId) {
      return NextResponse.redirect(new URL("/sign-in", req.nextUrl.origin));
    }

    return NextResponse.next();
  },
  debug: true,
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
