"use client";

import { AlertTriangle } from "lucide-react";

interface PermissionErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

const PermissionError: React.FC<PermissionErrorProps> = ({
  title = "접근 권한이 없습니다",
  message = "이 작업을 수행할 권한이 없습니다. 관리자에게 문의하세요.",
  onRetry,
  showRetryButton = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>

      <p className="text-gray-600 text-center mb-4 max-w-md">{message}</p>

      {showRetryButton && onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  );
};

export default PermissionError;
