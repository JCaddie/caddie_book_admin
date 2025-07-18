"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/shared/components/ui";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // value prop이 변경되면 내부 상태 동기화
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const currentOption = options.find(
    (option) => option.value === selectedValue
  );
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
    setIsDropdownOpen(false);
  };

  const handleSave = async () => {
    try {
      await onSave(selectedValue);
      setIsEditing(false);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("저장 실패:", error);
      // 에러 발생 시 원래 값으로 복원
      setSelectedValue(value);
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    setIsDropdownOpen(false);
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && !isDropdownOpen) {
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
      <div className="relative w-full" ref={dropdownRef}>
        {/* 드롭다운 버튼 */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || optionsLoading}
          className="w-full h-8 px-3 border border-gray-300 rounded-md bg-white text-left text-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
        >
          <span className="truncate">
            {currentOption?.label || placeholder}
          </span>
          {isDropdownOpen ? (
            <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
          )}
        </button>

        {/* 드롭다운 목록 */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {optionsLoading ? (
              <div className="px-3 py-2 text-sm text-gray-400">로딩 중...</div>
            ) : options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">
                선택 가능한 옵션이 없습니다
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                    selectedValue === option.value
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-900"
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        )}
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
