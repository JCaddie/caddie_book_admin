"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks/use-auth";
import { DeleteConfirmationModal } from "@/shared/components/ui";
import { AUTH_CONSTANTS } from "@/shared/constants/auth";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleMyInfo = () => {
    // 내 정보 페이지로 이동
    // TODO: 내 정보 페이지로 라우팅
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
    // 로그아웃 후 로그인 페이지로 리디렉션
    router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
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
                {user?.role === "DEVELOPER" ? "개발사 관리자" : "골프장 관리자"}
              </p>
            </div>
          </div>
        </div>

        {/* 우측 - 내 정보, 로그아웃 */}
        <div className="flex items-center" style={{ gap: "24px" }}>
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
      <DeleteConfirmationModal
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
