"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks/use-auth";
import { AUTH_CONSTANTS } from "@/shared/constants/auth";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // 인증된 사용자는 대시보드로 리다이렉트
        router.push(AUTH_CONSTANTS.ROUTES.DASHBOARD);
      } else {
        // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
        router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중이거나 리다이렉트 처리 중
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FEB912] mx-auto mb-4"></div>
        <p className="text-gray-600">
          {isLoading ? "인증 상태 확인 중..." : "페이지 이동 중..."}
        </p>
      </div>
    </div>
  );
}
