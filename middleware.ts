import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { tokenUtils } from "@/shared/lib/utils";
import { AUTH_CONSTANTS } from "@/shared/constants/auth";

// 토큰 유효성 검증 함수
function validateToken(token: string): boolean {
  try {
    // 통합된 토큰 유틸리티 사용
    if (!tokenUtils.isValidFormat(token)) return false;

    // 사용자 ID 검증 (테스트 환경에서는 1, 2만 유효)
    const userId = tokenUtils.extractUserId(token);
    if (!userId || !["1", "2"].includes(userId)) return false;

    // 토큰 만료 검증
    if (tokenUtils.isExpired(token)) return false;

    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_CONSTANTS.COOKIES.AUTH_TOKEN);
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
  const publicRoutes = [AUTH_CONSTANTS.ROUTES.LOGIN, "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // 관리자 페이지 접근 시 인증 체크
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(
        new URL(AUTH_CONSTANTS.ROUTES.LOGIN, request.url)
      );
    }

    // 토큰 유효성 검증
    if (!validateToken(token.value)) {
      // 유효하지 않은 토큰 쿠키 삭제
      const response = NextResponse.redirect(
        new URL(AUTH_CONSTANTS.ROUTES.LOGIN, request.url)
      );
      response.cookies.delete(AUTH_CONSTANTS.COOKIES.AUTH_TOKEN);
      response.cookies.delete(AUTH_CONSTANTS.COOKIES.USER_DATA);
      return response;
    }
  }

  // 로그인 페이지에 인증된 상태로 접근 시 대시보드로 리다이렉트
  if (isPublicRoute && token) {
    // 토큰이 있어도 유효성 검증
    if (validateToken(token.value)) {
      return NextResponse.redirect(
        new URL(AUTH_CONSTANTS.ROUTES.DASHBOARD, request.url)
      );
    } else {
      // 유효하지 않은 토큰 쿠키 삭제
      const response = NextResponse.next();
      response.cookies.delete(AUTH_CONSTANTS.COOKIES.AUTH_TOKEN);
      response.cookies.delete(AUTH_CONSTANTS.COOKIES.USER_DATA);
      return response;
    }
  }

  // 홈페이지(/) 접근 시 클라이언트 사이드에서 리다이렉트 처리
  if (pathname === AUTH_CONSTANTS.ROUTES.HOME) {
    // 유효하지 않은 토큰이 있다면 삭제
    if (token && !validateToken(token.value)) {
      const response = NextResponse.next();
      response.cookies.delete(AUTH_CONSTANTS.COOKIES.AUTH_TOKEN);
      response.cookies.delete(AUTH_CONSTANTS.COOKIES.USER_DATA);
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
