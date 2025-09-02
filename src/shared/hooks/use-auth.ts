"use client";

import { useEffect, useState } from "react";
import { User, UserRole } from "@/shared/types";
import { cookieUtils } from "@/shared/lib/utils";
import { AUTH_CONSTANTS } from "@/shared/constants/auth";

// 로그인 API 응답 타입
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    name: string;
    role: string;
    golf_course_id: string | null;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

interface UseAuthReturn extends AuthState {
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  switchRole: (targetRole: UserRole) => Promise<boolean>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

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
        name: "마스터 관리자",
        email: "dev@example.com",
        role: "MASTER",
        created_at: new Date().toISOString(),
      },
      "2": {
        id: "2",
        name: "골프장 관리자",
        email: "golf@example.com",
        role: "ADMIN",
        golfCourseId: "golf-course-1",
        created_at: new Date().toISOString(),
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

  const login = (token: string, refreshToken: string, user: User) => {
    cookieUtils.set(
      AUTH_CONSTANTS.COOKIES.AUTH_TOKEN,
      token,
      AUTH_CONSTANTS.TOKEN.EXPIRES_DAYS
    );
    cookieUtils.set(
      AUTH_CONSTANTS.COOKIES.REFRESH_TOKEN,
      refreshToken,
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
      AUTH_CONSTANTS.COOKIES.REFRESH_TOKEN,
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

  const switchRole = async (targetRole: UserRole): Promise<boolean> => {
    if (!authState.user) {
      console.error("❌ 사용자 정보가 없어서 권한 전환할 수 없습니다");
      return false;
    }

    try {
      console.log("🔄 권한 전환 시작:", authState.user.role, "→", targetRole);
      console.log("🔄 자동 로그인으로 권한 전환");

      // 테스트 계정 정보 (실제 환경에서는 API에서 가져와야 함)
      const testAccounts = {
        MASTER: {
          email: "master@caddiebook.com",
          password: "master123!",
        },
        ADMIN: {
          email: "admin@caddiebook.com",
          password: "admin123!",
        },
      };

      const targetAccount = testAccounts[targetRole];
      if (!targetAccount) {
        console.error("❌ 해당 권한의 계정 정보가 없습니다:", targetRole);
        return false;
      }

      // 현재 사용자 로그아웃
      logout();

      // 잠시 대기 후 자동 로그인
      setTimeout(async () => {
        try {
          console.log("🔄 자동 로그인 시작:", targetAccount.email);

          // API 클라이언트 import (동적 import 사용)
          const { apiClient } = await import("@/shared/lib/api-client");

          // 로그인 API 호출
          const response = await apiClient.post<LoginResponse>(
            "/api/v1/users/auth/login/",
            {
              username: targetAccount.email,
              password: targetAccount.password,
            },
            { skipAuth: true }
          );

          console.log("✅ 자동 로그인 성공:", response);

          // 새로운 사용자 정보 생성
          const newUser: User = {
            id: response.user.id,
            name: response.user.name || response.user.username,
            email: response.user.email,
            role: response.user.role as "MASTER" | "ADMIN",
            golfCourseId: response.user.golf_course_id || undefined,
            created_at: new Date().toISOString(),
          };

          // 자동 로그인 처리
          login(response.access_token, response.refresh_token, newUser);

          console.log("✅ 권한 전환 완료 - 자동 로그인 성공");

          // 페이지 새로고침으로 UI 업데이트
          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.location.reload();
            }
          }, 100);
        } catch (error) {
          console.error("❌ 자동 로그인 실패:", error);
          // 자동 로그인 실패 시 로그인 페이지로 이동
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      }, 500); // 500ms 대기

      return true;
    } catch (error) {
      console.error("❌ 권한 전환 실패:", error);
      return false;
    }
  };

  return {
    ...authState,
    login,
    logout,
    switchRole,
    hasRole,
    hasAnyRole,
  };
};
