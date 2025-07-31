"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/shared/components/ui";

interface SpecialGroupDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupName: string;
  isLoading?: boolean;
}

const SpecialGroupDeleteModal: React.FC<SpecialGroupDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  groupName,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-xl shadow-xl flex flex-col"
        style={{ width: "400px" }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">특수반 삭제</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6 space-y-4">
          {/* 경고 아이콘 */}
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>

          {/* 메시지 */}
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-900">
              특수반을 삭제하시겠습니까?
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-red-600">
                &quot;{groupName}&quot;
              </span>{" "}
              특수반을 삭제하면 복원할 수 없습니다.
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isLoading ? "삭제 중..." : "삭제"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpecialGroupDeleteModal;
