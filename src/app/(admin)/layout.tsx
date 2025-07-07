"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/use-auth";
import { AdminLayout } from "@/shared/components/layout";

interface AdminRootLayoutProps {
  children: React.ReactNode;
}

const AdminRootLayout: React.FC<AdminRootLayoutProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  console.log(
    "AdminRootLayout 렌더링 - 로딩:",
    isLoading,
    "인증:",
    isAuthenticated,
    "사용자:",
    user
  );

  // 5초 후에도 로딩 상태면 타임아웃 처리
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        console.log("로딩 타임아웃 - 5초 경과");
        setLoadingTimeout(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoading]);

  // 로딩 중이거나 인증되지 않은 상태일 때
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {loadingTimeout
              ? "로딩이 오래 걸리고 있습니다. 새로고침을 시도해보세요."
              : "로딩 중..."}
          </p>
          {loadingTimeout && (
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              새로고침
            </button>
          )}
        </div>
      </div>
    );
  }

  // 사용자 정보가 없을 때 (이론적으로는 미들웨어에서 차단되어야 함)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            인증 정보를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600">다시 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return <AdminLayout userRole={user.role}>{children}</AdminLayout>;
};

export default AdminRootLayout;
