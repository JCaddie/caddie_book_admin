"use client";

import { useState, useEffect } from "react";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (token: string) => void;
  logout: () => void;
}

// 쿠키 유틸리티 함수들
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  document.cookie = cookieString;
  console.log("쿠키 설정:", cookieString);
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

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // 컴포넌트 마운트 시 쿠키에서 토큰 확인
    const token = getCookie("auth_token");
    console.log("초기 토큰 확인:", token);

    setAuthState({
      isAuthenticated: !!token,
      isLoading: false,
    });
  }, []);

  const login = (token: string) => {
    console.log("로그인 시작, 토큰:", token);
    setCookie("auth_token", token, 7); // 7일간 유효
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
    });
    console.log("로그인 상태 업데이트 완료");
  };

  const logout = () => {
    console.log("로그아웃 시작");
    deleteCookie("auth_token");
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
    });
    console.log("로그아웃 상태 업데이트 완료");
  };

  return {
    ...authState,
    login,
    logout,
  };
};
