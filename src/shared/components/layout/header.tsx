"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks/use-auth";
import { ConfirmationModal } from "@/shared/components/ui";
import { UserRole } from "@/shared/types";

const Header: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleMyInfo = () => {
    // 내 정보 페이지로 이동
    router.push("/users/me");
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
    // 로그아웃 후 로그인 페이지로 리디렉션
    router.push("/login");
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const handleRoleSwitch = (targetRole: UserRole) => {
    switchRole(targetRole);
    // 권한 전환 시 페이지 전체 리프레시
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <>
      <header
        className="w-full bg-white border-b flex items-center justify-between px-9"
        style={{ height: "72px", borderBottomColor: "#DDDDDD" }}
      >
        {/* 좌측 - 사용자 정보 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <p className="text-gray-900 font-medium text-sm">{user?.name}</p>
              <p className="text-gray-500 text-xs">
                {user?.role === "MASTER" ? "마스터 관리자" : "골프장 관리자"}
              </p>
            </div>
          </div>
        </div>

        {/* 우측 - 권한 전환, 내 정보, 로그아웃 */}
        <div className="flex items-center" style={{ gap: "24px" }}>
          {/* 권한 전환 버튼 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRoleSwitch("MASTER")}
              disabled={user?.role === "MASTER"}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                user?.role === "MASTER"
                  ? "bg-[#FEB912] text-white cursor-default"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              개발사
            </button>
            <button
              onClick={() => handleRoleSwitch("ADMIN")}
              disabled={user?.role === "ADMIN"}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                user?.role === "ADMIN"
                  ? "bg-[#FEB912] text-white cursor-default"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              관리자
            </button>
          </div>

          <button
            onClick={handleMyInfo}
            className="text-black font-medium text-lg hover:text-gray-600 transition-colors cursor-pointer"
          >
            내 정보
          </button>
          <button
            onClick={handleLogout}
            className="text-black font-medium text-lg hover:text-gray-600 transition-colors cursor-pointer"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* 로그아웃 확인 모달 */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="로그아웃 하시겠습니까?"
        message="현재 세션이 종료되고 로그인 페이지로 이동합니다."
        confirmText="로그아웃"
        cancelText="취소"
      />
    </>
  );
};

export default Header;
