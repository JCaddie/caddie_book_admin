"use client";

import React from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "삭제할까요?",
  message = "삭제 시 복원이 불가합니다.",
  confirmText = "확인",
  cancelText = "취소",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-md border border-gray-100 shadow-lg"
        style={{
          width: "332px",
          padding: "24px",
          boxShadow: "0px 1px 8px 1px rgba(99, 108, 132, 0.1)",
        }}
      >
        {/* 모달 내용 */}
        <div className="flex flex-col gap-6">
          {/* 제목과 메시지 */}
          <div
            className="flex flex-col items-center gap-4"
            style={{ width: "284px" }}
          >
            {/* 제목 */}
            <h2
              className="text-center font-bold"
              style={{
                fontSize: "16px",
                lineHeight: "1.5em",
                color: "rgba(0, 0, 0, 0.8)",
              }}
            >
              {title}
            </h2>

            {/* 메시지 */}
            <p
              className="text-center font-medium"
              style={{
                fontSize: "13px",
                lineHeight: "1.8461538461538463em",
                color: "rgba(0, 0, 0, 0.6)",
              }}
            >
              {message}
            </p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-6" style={{ width: "284px" }}>
            {/* 취소 버튼 */}
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 h-10 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{
                backgroundColor: "#FAFAFA",
                borderColor: "#DDDDDD",
              }}
            >
              <span
                className="font-medium"
                style={{
                  fontSize: "13px",
                  lineHeight: "1.8461538461538463em",
                  color: "rgba(0, 0, 0, 0.8)",
                }}
              >
                {cancelText}
              </span>
            </button>

            {/* 확인 버튼 */}
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="h-10 rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              style={{
                width: "130px",
                backgroundColor: "#FEB912",
                boxShadow: "0px 2px 8px 2px rgba(254, 185, 18, 0.42)",
              }}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span
                  className="font-medium"
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.8461538461538463em",
                    color: "#FFFFFF",
                  }}
                >
                  {confirmText}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
