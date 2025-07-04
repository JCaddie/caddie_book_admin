"use client";

import { AdminLayout } from "@/shared/components/layout";
import { useAuth } from "@/shared/hooks/use-auth";

interface AdminRootLayoutProps {
  children: React.ReactNode;
}

const AdminRootLayout: React.FC<AdminRootLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            로그인이 필요합니다
          </h2>
          <p className="text-gray-600">
            관리자 페이지에 접근하려면 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  return <AdminLayout userRole={user.role}>{children}</AdminLayout>;
};

export default AdminRootLayout;
