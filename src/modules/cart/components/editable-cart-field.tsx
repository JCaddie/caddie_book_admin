"use client";

import React, { useState } from "react";
import { Check, Edit3, X } from "lucide-react";

interface EditableCartFieldProps {
  label: string;
  value: string | number;
  onSave: (value: string | number) => Promise<void>;
  type?: "text" | "select";
  options?: Array<{ value: string | number; label: string }>;
  disabled?: boolean;
  displayValue?: string; // 표시용 값 (select 타입에서 사용)
}

export const EditableCartField: React.FC<EditableCartFieldProps> = ({
  label,
  value,
  onSave,
  type = "text",
  options = [],
  disabled = false,
  displayValue,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setEditValue(value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error("필드 저장 중 오류:", error);
      // 에러 발생 시 원래 값으로 복원
      setEditValue(value);
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

  return (
    <div className="flex">
      <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
        <span className="text-sm font-bold">{label}</span>
      </div>
      <div className="flex-1 flex items-center px-4 py-3 group">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            {type === "text" ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                disabled={isLoading}
                autoFocus
              />
            ) : (
              <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                disabled={isLoading}
                autoFocus
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handleSave}
              disabled={isLoading}
              className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
              title="저장"
            >
              <Check size={16} />
            </button>

            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
              title="취소"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-black">{displayValue || value}</span>
            {!disabled && (
              <button
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity"
                title="편집"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
