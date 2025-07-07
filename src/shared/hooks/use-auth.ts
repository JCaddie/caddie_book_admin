"use client";

import { useState, useEffect } from "react";
import { User, UserRole } from "@/shared/types";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

interface UseAuthReturn extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

// 쿠키 유틸리티 함수들
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // 개발 환경에서는 Secure 플래그 제거
  const isSecure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${
    isSecure ? ";Secure" : ""
  }`;

  document.cookie = cookieString;
  console.log("쿠키 설정:", cookieString);

  // 쿠키가 제대로 저장되었는지 확인
  const savedCookie = getCookie(name);
  console.log("저장된 쿠키 확인:", name, "=", savedCookie);
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  console.log("쿠키 삭제:", name);
};

// 토큰에서 사용자 정보 추출 (실제 구현에서는 JWT 디코딩)
const parseTokenToUser = (token: string): User | null => {
  try {
    // 목 토큰 형태: mock-token-{userId}-{timestamp}
    const parts = token.split("-");
    if (parts.length < 3) return null;

    const userId = parts[2];

    // 테스트 사용자 정보 (실제로는 서버에서 가져오거나 JWT에서 디코딩)
    const testUsers: Record<string, User> = {
      "1": {
        id: "1",
        name: "개발사 관리자",
        email: "dev@example.com",
        role: "DEVELOPER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      "2": {
        id: "2",
        name: "골프장 관리자",
        email: "golf@example.com",
        role: "BRANCH",
        golfCourseId: "golf-course-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    return testUsers[userId] || null;
  } catch (error) {
    console.error("토큰 파싱 에러:", error);
    return null;
  }
};

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    console.log("useAuth 초기화 시작");

    // 컴포넌트 마운트 시 쿠키에서 토큰 확인
    const token = getCookie("auth_token");
    const userDataJson = getCookie("user_data");

    console.log("초기 토큰 확인:", token);
    console.log("초기 사용자 데이터:", userDataJson);
    console.log("현재 모든 쿠키:", document.cookie);

    if (token) {
      let user: User | null = null;

      // 먼저 쿠키에서 사용자 데이터 확인
      if (userDataJson) {
        try {
          user = JSON.parse(decodeURIComponent(userDataJson));
          console.log("쿠키에서 사용자 데이터 파싱 성공:", user);
        } catch (error) {
          console.error("사용자 데이터 파싱 에러:", error);
        }
      }

      // 쿠키에 사용자 데이터가 없으면 토큰에서 추출
      if (!user) {
        console.log("쿠키에 사용자 데이터가 없음, 토큰에서 추출 시도");
        user = parseTokenToUser(token);
        console.log("토큰에서 추출한 사용자 데이터:", user);
      }

      console.log("초기 상태 설정 - 사용자:", user, "인증 상태:", !!user);
      setAuthState({
        isAuthenticated: !!user,
        isLoading: false,
        user,
      });
    } else {
      console.log("토큰이 없음, 비인증 상태로 설정");
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  }, []);

  const login = (token: string, user: User) => {
    console.log("로그인 시작, 토큰:", token, "사용자:", user);

    setCookie("auth_token", token, 7); // 7일간 유효
    setCookie("user_data", encodeURIComponent(JSON.stringify(user)), 7);

    // 상태 업데이트를 더 확실하게 하기 위해 약간의 지연 추가
    setTimeout(() => {
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user,
      });

      console.log(
        "로그인 상태 업데이트 완료 - 사용자:",
        user,
        "인증 상태: true"
      );
    }, 50);
  };

  const logout = () => {
    console.log("로그아웃 시작");

    deleteCookie("auth_token");
    deleteCookie("user_data");

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    console.log("로그아웃 상태 업데이트 완료");
  };

  const hasRole = (role: UserRole): boolean => {
    return authState.user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return authState.user ? roles.includes(authState.user.role) : false;
  };

  return {
    ...authState,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };
};
