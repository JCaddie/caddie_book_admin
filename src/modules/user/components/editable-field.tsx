"use client";

import React, { useState } from "react";
import { Check, Edit2, X } from "lucide-react";
import { Button, Input } from "@/shared/components/ui";

export interface EditableFieldProps {
  label: string;
  value: string;
  type?: "text" | "email" | "tel" | "password";
  placeholder?: string;
  isLoading?: boolean;
  onSave: (value: string) => Promise<void>;
  disabled?: boolean;
  hideLabel?: boolean;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  type = "text",
  placeholder,
  isLoading = false,
  onSave,
  disabled = false,
  hideLabel = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setEditValue(value);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (editValue.trim() === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("필드 저장 중 오류:", error);
      // 에러 발생 시 편집 모드 유지
    } finally {
      setIsSaving(false);
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
    <div className="space-y-2">
      {!hideLabel && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isSaving}
            containerClassName="flex-1"
            autoFocus
          />

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || editValue.trim() === ""}
            loading={isSaving}
            className="px-3"
          >
            <Check size={16} />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleCancel}
            disabled={isSaving}
            className="px-3"
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between group">
          <div className="flex-1">
            {type === "password" ? (
              <span className="text-gray-900">••••••••</span>
            ) : (
              <span className="text-gray-900">{value || "-"}</span>
            )}
          </div>

          {!disabled && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEdit}
              disabled={isLoading}
              className="opacity-0 group-hover:opacity-100 transition-opacity px-3"
            >
              <Edit2 size={16} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
