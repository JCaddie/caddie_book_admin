"use client";

import { useState } from "react";
import { useAuth } from "@/shared/hooks/use-auth";
import LogoutModal from "@/shared/components/ui/logout-modal";

const Header: React.FC = () => {
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleMyInfo = () => {
    // 내 정보 페이지로 이동
    console.log("내 정보 클릭");
    // TODO: 내 정보 페이지로 라우팅
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
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
        {/* 좌측 - Admin 텍스트 */}
        <div className="flex items-center">
          <span className="text-black font-medium text-lg">Admin</span>
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
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Header;
