import React from "react";

export interface EmptyStateProps {
  message?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = "검색된 결과가 없습니다.",
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-md border border-gray-200 p-10 text-center ${className}`}
    >
      <p className="text-sm font-medium text-gray-400">{message}</p>
    </div>
  );
};

export default EmptyState;
