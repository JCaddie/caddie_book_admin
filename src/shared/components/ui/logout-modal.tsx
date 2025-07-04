"use client";

import { useEffect } from "react";
import Button from "./button";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            로그아웃 확인
          </h3>
          <p className="text-gray-600">정말로 로그아웃 하시겠습니까?</p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button onClick={onClose} variant="secondary" size="md">
            취소
          </Button>
          <Button
            onClick={onConfirm}
            variant="primary"
            size="md"
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            로그아웃
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
