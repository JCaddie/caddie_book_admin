"use client";

import { UserRole } from "@/shared/types";
import { useAuth } from "@/shared/hooks/use-auth";

export interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  requiredRoles,
  fallback,
}) => {
  const { user, isLoading, hasRole, hasAnyRole } = useAuth();

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
            이 페이지에 접근하려면 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  // 권한 체크
  let hasPermission = true;

  if (requiredRole) {
    hasPermission = hasRole(requiredRole);
  } else if (requiredRoles && requiredRoles.length > 0) {
    hasPermission = hasAnyRole(requiredRoles);
  }

  // 권한이 없는 경우
  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            접근 권한이 없습니다
          </h2>
          <p className="text-gray-600 mb-4">
            이 페이지에 접근할 권한이 없습니다.
          </p>
          <p className="text-sm text-gray-500">
            현재 권한: {user.role === "DEVELOPER" ? "개발사" : "지점"}
          </p>
        </div>
      </div>
    );
  }

  // 권한이 있는 경우 컨텐츠 렌더링
  return <>{children}</>;
};

export default RoleGuard;
