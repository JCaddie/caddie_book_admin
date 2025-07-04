"use client";

import { useState, useEffect } from "react";
import { AuthUser, UserRole } from "@/shared/types";

// 테스트 계정 데이터
const TEST_ACCOUNTS = [
  {
    id: "1",
    name: "개발사 관리자",
    email: "dev@example.com",
    password: "dev123",
    role: "DEVELOPER" as UserRole,
    golfCourseId: undefined,
  },
  {
    id: "2",
    name: "골프장 관리자",
    email: "golf@example.com",
    password: "golf123",
    role: "BRANCH" as UserRole,
    golfCourseId: "golf-course-1",
  },
];

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 페이지 로드 시 저장된 인증 정보 확인
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("auth-user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    // 테스트 계정 확인
    const account = TEST_ACCOUNTS.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (account) {
      const authUser: AuthUser = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        golfCourseId: account.golfCourseId,
      };

      setUser(authUser);

      // 브라우저에 저장
      if (typeof window !== "undefined") {
        localStorage.setItem("auth-user", JSON.stringify(authUser));
        localStorage.setItem("auth-token", `mock-token-${account.id}`);
      }

      setIsLoading(false);
      return { success: true, message: "로그인 성공" };
    } else {
      setIsLoading(false);
      return {
        success: false,
        message: "이메일 또는 비밀번호가 잘못되었습니다.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    // 실제로는 토큰 제거
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("auth-user");
      // 로그인 페이지로 리다이렉트
      window.location.href = "/login";
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
    login,
    logout,
    testAccounts: TEST_ACCOUNTS.map((acc) => ({
      email: acc.email,
      password: acc.password,
      role: acc.role,
      name: acc.name,
    })),
  };
};
