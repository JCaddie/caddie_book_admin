"use client";

import React, { useState } from "react";
import { Check, Edit2, X } from "lucide-react";
import { Button } from "../ui";

// ================================
// 타입 정의
// ================================

export interface EditableFieldOption {
  value: string;
  label: string;
}

export interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  type?: "text" | "email" | "phone" | "number" | "select";
  options?: EditableFieldOption[];
  placeholder?: string;
  disabled?: boolean;
  hideLabel?: boolean;
  className?: string;
  validation?: (value: string) => string | null;
}

// ================================
// 컴포넌트
// ================================

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onSave,
  type = "text",
  options = [],
  placeholder,
  disabled = false,
  hideLabel = false,
  className = "",
  validation,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    if (disabled) return;
    setEditValue(value);
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (editValue.trim() === value) {
      setIsEditing(false);
      return;
    }

    // 유효성 검사
    if (validation) {
      const validationError = validation(editValue.trim());
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSave(editValue.trim());
      setIsEditing(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const getInputType = () => {
    switch (type) {
      case "email":
        return "email";
      case "phone":
        return "tel";
      case "number":
        return "number";
      default:
        return "text";
    }
  };

  const getDisplayValue = () => {
    if (type === "select" && options.length > 0) {
      const option = options.find((opt) => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {!hideLabel && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {isEditing ? (
        <div className="space-y-2">
          {type === "select" ? (
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={getInputType()}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              저장
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              취소
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between group">
          <div className="flex-1">
            <span className="text-gray-900">
              {getDisplayValue() || placeholder || "입력되지 않음"}
            </span>
          </div>
          {!disabled && (
            <button
              onClick={handleEdit}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
              title="편집"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
