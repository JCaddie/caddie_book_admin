"use client";

import React from "react";
import { Trash2 } from "lucide-react";

export interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  selectedCount?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "text" | "icon" | "button";
  showCount?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  disabled = false,
  selectedCount = 0,
  className = "",
  size = "md",
  variant = "text",
  showCount = true,
}) => {
  const isDisabled = disabled || selectedCount === 0;

  // 크기별 스타일
  const sizeStyles = {
    sm: {
      icon: 14,
      text: "text-xs",
      padding: "p-1",
    },
    md: {
      icon: 16,
      text: "text-[13px]",
      padding: "p-2",
    },
    lg: {
      icon: 18,
      text: "text-sm",
      padding: "p-3",
    },
  };

  const currentSize = sizeStyles[size];

  // 변형별 기본 스타일
  const getVariantStyles = () => {
    const baseStyles = [
      "flex items-center gap-2 font-medium transition-colors",
      currentSize.text,
    ];

    if (variant === "text") {
      return [
        ...baseStyles,
        isDisabled
          ? "text-black opacity-60 cursor-not-allowed"
          : "text-black hover:text-red-600 cursor-pointer",
      ];
    }

    if (variant === "icon") {
      return [
        ...baseStyles,
        currentSize.padding,
        "rounded-md",
        isDisabled
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-600 hover:text-red-600 hover:bg-red-50 cursor-pointer",
      ];
    }

    if (variant === "button") {
      return [
        ...baseStyles,
        "px-4 py-2 rounded-md border",
        isDisabled
          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 cursor-pointer",
      ];
    }

    return baseStyles;
  };

  const handleClick = () => {
    if (!isDisabled) {
      onClick();
    }
  };

  const renderContent = () => {
    if (variant === "icon") {
      return <Trash2 size={currentSize.icon} />;
    }

    return (
      <>
        <Trash2 size={currentSize.icon} />
        <span>
          삭제
          {showCount && selectedCount > 0 && ` (${selectedCount})`}
        </span>
      </>
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={[...getVariantStyles(), className].join(" ")}
      aria-label={`${selectedCount}개 항목 삭제`}
    >
      {renderContent()}
    </button>
  );
};

export default DeleteButton;
