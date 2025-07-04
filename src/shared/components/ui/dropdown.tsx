"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  showAddIcon?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Option 1",
  disabled = false,
  className,
  containerClassName,
  showAddIcon = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setHoveredIndex(null);
  };

  // Figma 스펙에 따른 스타일
  const getButtonStyles = () => {
    const baseStyles = [
      "w-full h-10 px-3 border rounded-md transition-colors",
      "text-sm font-medium text-gray-800 text-left",
      "focus:outline-none flex items-center justify-between",
    ];

    if (disabled) {
      baseStyles.push("bg-gray-50 border-gray-300 cursor-not-allowed");
    } else {
      baseStyles.push(
        "bg-white border-gray-300 hover:border-primary-300 cursor-pointer"
      );
    }

    return baseStyles.filter(Boolean).join(" ");
  };

  return (
    <div
      className={["relative", containerClassName].filter(Boolean).join(" ")}
      ref={dropdownRef}
    >
      {/* 드롭다운 버튼 */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={[getButtonStyles(), className].filter(Boolean).join(" ")}
      >
        {/* 좌측 콘텐츠 */}
        <div className="flex items-center gap-2">
          {/* 추가 아이콘 (Figma icon variant) */}
          {showAddIcon && (
            <div className="w-6 h-6 bg-gray-50 border border-gray-300 rounded flex items-center justify-center">
              <Plus size={12} className="text-gray-600" />
            </div>
          )}

          {/* 선택된 옵션 아이콘 */}
          {selectedOption?.icon && (
            <span className="flex-shrink-0">{selectedOption.icon}</span>
          )}

          {/* 선택된 텍스트 또는 플레이스홀더 */}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        {/* 우측 화살표 아이콘 */}
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
        )}
      </button>

      {/* 드롭다운 목록 - Figma open 상태 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option, index) => {
            const isSelected = value === option.value;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={[
                  "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors",
                  "text-sm font-medium",
                  // Figma 스펙: hover는 #F3F3F3, active는 blue
                  isSelected
                    ? "bg-blue-50 text-blue-600"
                    : isHovered
                    ? "bg-gray-100"
                    : "text-gray-800",
                  // 첫 번째와 마지막 아이템 테두리 반지름
                  index === 0 ? "rounded-t-md" : "",
                  index === options.length - 1 ? "rounded-b-md" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* 옵션 아이콘 */}
                {option.icon && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}

                {/* 옵션 텍스트 */}
                <span className="truncate">{option.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
