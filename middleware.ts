import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token");
  const { pathname } = request.nextUrl;

  console.log(`미들웨어 실행: ${pathname}, 토큰: ${token?.value || "none"}`);

  // 인증이 필요한 경로들 (관리자 페이지)
  const protectedRoutes = [
    "/dashboard",
    "/caddies",
    "/golf-courses",
    "/users",
    "/announcements",
    "/works",
    "/carts",
    "/fields",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 인증이 필요하지 않은 경로들
  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

  console.log(
    `경로 분석: protected=${isProtectedRoute}, public=${isPublicRoute}`
  );

  // 관리자 페이지 접근 시 인증 체크
  if (isProtectedRoute) {
    if (!token) {
      console.log("인증되지 않은 사용자 -> 로그인 페이지로 리다이렉트");
      // 인증되지 않은 경우 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL("/login", request.url));
    }
    console.log("인증된 사용자 -> 관리자 페이지 접근 허용");
  }

  // 로그인 페이지에 인증된 상태로 접근 시 대시보드로 리다이렉트
  if (isPublicRoute && token) {
    console.log("인증된 사용자가 로그인 페이지 접근 -> 대시보드로 리다이렉트");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 홈페이지(/) 접근 시 인증 상태에 따라 리다이렉트
  if (pathname === "/") {
    if (token) {
      console.log("홈페이지 접근 (인증됨) -> 대시보드로 리다이렉트");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      console.log("홈페이지 접근 (미인증) -> 로그인 페이지로 리다이렉트");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  console.log("미들웨어 통과 -> 다음 핸들러로");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
