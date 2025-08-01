"use client";

import React, { useState } from "react";
import { Check, Edit3, X } from "lucide-react";
import { Dropdown, Input } from "@/shared/components/ui";

interface EditableAnnouncementFieldProps {
  label: string;
  value: string | number | boolean;
  onSave: (value: string | number | boolean) => Promise<void>;
  type?: "text" | "textarea" | "select" | "checkbox";
  options?: Array<{ value: string | number; label: string }>;
  disabled?: boolean;
  displayValue?: string;
  placeholder?: string;
}

export const EditableAnnouncementField: React.FC<EditableAnnouncementFieldProps> = ({
  label,
  value,
  onSave,
  type = "text",
  options = [],
  disabled = false,
  displayValue,
  placeholder,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    if (disabled) return;
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error("필드 수정 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const renderDisplayValue = () => {
    if (type === "checkbox") {
      return value ? "공개" : "비공개";
    }
    return displayValue || String(value);
  };

  const renderEditField = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            value={editValue as string}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
            disabled={isLoading}
          />
        );
      case "select":
        return (
          <Dropdown
            options={options}
            value={editValue as string}
            onChange={(value) => setEditValue(value)}
            placeholder={placeholder}
            disabled={isLoading}
          />
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={editValue as boolean}
            onChange={(e) => setEditValue(e.target.checked)}
            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            disabled={isLoading}
          />
        );
      default:
        return (
          <Input
            value={editValue as string}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
          />
        );
    }
  };

  return (
    <div className="flex">
      {/* 라벨 */}
      <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
        <span className="text-sm font-bold">{label}</span>
      </div>

      {/* 값 */}
      <div className="flex-1 flex items-center px-4 py-3 group">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
              {renderEditField()}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                title="저장"
              >
                <Check size={16} />
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                title="취소"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-black">{renderDisplayValue()}</span>
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