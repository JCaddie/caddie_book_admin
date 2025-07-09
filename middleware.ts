import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 토큰 유효성 검증 함수
function validateToken(token: string): boolean {
  try {
    // 목 토큰 검증 (실제 구현에서는 JWT 검증)
    const parts = token.split("-");
    if (parts.length < 3) return false;

    const tokenType = parts[0];
    const prefix = parts[1];
    const userId = parts[2];

    // 기본 형식 검증
    if (tokenType !== "mock" || prefix !== "token") return false;

    // 사용자 ID 검증 (테스트 환경에서는 1, 2만 유효)
    if (!["1", "2"].includes(userId)) return false;

    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token");
  const { pathname } = request.nextUrl;

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

  // 관리자 페이지 접근 시 인증 체크
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 토큰 유효성 검증
    if (!validateToken(token.value)) {
      // 유효하지 않은 토큰 쿠키 삭제
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      response.cookies.delete("user_data");
      return response;
    }
  }

  // 로그인 페이지에 인증된 상태로 접근 시 대시보드로 리다이렉트
  if (isPublicRoute && token) {
    // 토큰이 있어도 유효성 검증
    if (validateToken(token.value)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      // 유효하지 않은 토큰 쿠키 삭제
      const response = NextResponse.next();
      response.cookies.delete("auth_token");
      response.cookies.delete("user_data");
      return response;
    }
  }

  // 홈페이지(/) 접근 시 클라이언트 사이드에서 리다이렉트 처리
  if (pathname === "/") {
    // 유효하지 않은 토큰이 있다면 삭제
    if (token && !validateToken(token.value)) {
      const response = NextResponse.next();
      response.cookies.delete("auth_token");
      response.cookies.delete("user_data");
      return response;
    }
    // 홈페이지는 클라이언트 사이드에서 리다이렉트 처리
    return NextResponse.next();
  }

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
