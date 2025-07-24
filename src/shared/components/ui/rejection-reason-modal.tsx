"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "./button";

export interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  placeholder?: string;
}

const RejectionReasonModal: React.FC<RejectionReasonModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "거절 사유 입력",
  message = "거절 사유를 입력해주세요.",
  confirmText = "거절",
  cancelText = "취소",
  isLoading = false,
  placeholder = "거절 사유를 입력하세요...",
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading && reason.trim()) {
      onConfirm(reason.trim());
      setReason(""); // 입력값 초기화
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
      setReason(""); // 입력값 초기화
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-xl max-w-md w-full mx-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">{message}</p>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            style={{ minHeight: "128px" }}
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <Button
            variant="secondary"
            size="md"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RejectionReasonModal;
