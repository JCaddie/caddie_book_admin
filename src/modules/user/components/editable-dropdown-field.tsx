"use client";

import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Button, Dropdown } from "@/shared/components/ui";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface EditableDropdownFieldProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  isLoading?: boolean;
  hideLabel?: boolean;
  optionsLoading?: boolean;
}

export const EditableDropdownField: React.FC<EditableDropdownFieldProps> = ({
  label,
  value,
  options,
  onSave,
  placeholder = "선택하세요",
  isLoading = false,
  hideLabel = false,
  optionsLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);

  // value prop이 변경되면 내부 상태 동기화
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const originalOption = options.find((option) => option.value === value);

  const handleEdit = () => {
    if (!isLoading && !optionsLoading) {
      setIsEditing(true);
      setSelectedValue(value);
    }
  };

  const handleCancel = () => {
    setSelectedValue(value);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await onSave(selectedValue);
      setIsEditing(false);
    } catch (error) {
      console.error("저장 실패:", error);
      // 에러 발생 시 원래 값으로 복원
      setSelectedValue(value);
    }
  };

  const handleDropdownChange = (newValue: string) => {
    setSelectedValue(newValue);
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter") {
      handleSave();
    }
  };

  const renderDisplayContent = () => {
    if (optionsLoading) {
      return <span className="text-gray-400">로딩 중...</span>;
    }

    return (
      <span className="text-sm text-black">
        {originalOption?.label || placeholder}
      </span>
    );
  };

  const renderEditContent = () => {
    return (
      <div className="w-full" onKeyDown={handleKeyDown}>
        <Dropdown
          options={options}
          value={selectedValue}
          onChange={handleDropdownChange}
          placeholder={placeholder}
          disabled={isLoading || optionsLoading}
          className="h-8"
          containerClassName="w-full"
        />
      </div>
    );
  };

  if (isEditing) {
    return (
      <div className="w-full">
        {!hideLabel && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          {renderEditContent()}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isLoading || optionsLoading}
              className="w-8 h-8 p-0 border-green-300 text-green-600 hover:bg-green-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check size={16} />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-8 h-8 p-0 border-red-300 text-red-600 hover:bg-red-50"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full cursor-pointer"
      onClick={handleEdit}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!hideLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        className={`min-h-[32px] flex items-center transition-colors ${
          isHovered && !isLoading && !optionsLoading
            ? "bg-gray-50 rounded px-2"
            : "px-2"
        }`}
      >
        {renderDisplayContent()}
        {isHovered && !isLoading && !optionsLoading && (
          <span className="ml-2 text-xs text-gray-400">클릭하여 수정</span>
        )}
      </div>
    </div>
  );
};
