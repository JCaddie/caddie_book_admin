"use client";

import { useState, useEffect } from "react";
import { User, UserRole } from "@/shared/types";
import { cookieUtils } from "@/shared/lib/utils";
import { AUTH_CONSTANTS } from "@/shared/constants/auth";

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

// 통합된 쿠키 유틸리티 사용

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
    // 컴포넌트 마운트 시 쿠키에서 토큰 확인
    const token = cookieUtils.get(AUTH_CONSTANTS.COOKIES.AUTH_TOKEN);
    const userDataJson = cookieUtils.get(AUTH_CONSTANTS.COOKIES.USER_DATA);

    if (token) {
      let user: User | null = null;

      // 먼저 쿠키에서 사용자 데이터 확인
      if (userDataJson) {
        try {
          user = JSON.parse(decodeURIComponent(userDataJson));
        } catch (error) {
          console.error("사용자 데이터 파싱 에러:", error);
        }
      }

      // 쿠키에 사용자 데이터가 없으면 토큰에서 추출
      if (!user) {
        user = parseTokenToUser(token);
      }
      setAuthState({
        isAuthenticated: !!user,
        isLoading: false,
        user,
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  }, []);

  const login = (token: string, user: User) => {
    cookieUtils.set(
      AUTH_CONSTANTS.COOKIES.AUTH_TOKEN,
      token,
      AUTH_CONSTANTS.TOKEN.EXPIRES_DAYS
    );
    cookieUtils.set(
      AUTH_CONSTANTS.COOKIES.USER_DATA,
      encodeURIComponent(JSON.stringify(user)),
      AUTH_CONSTANTS.TOKEN.EXPIRES_DAYS
    );

    // 상태 업데이트를 더 확실하게 하기 위해 약간의 지연 추가
    setTimeout(() => {
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user,
      });
    }, 50);
  };

  const logout = () => {
    cookieUtils.removeMultiple([
      AUTH_CONSTANTS.COOKIES.AUTH_TOKEN,
      AUTH_CONSTANTS.COOKIES.USER_DATA,
    ]);

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
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
