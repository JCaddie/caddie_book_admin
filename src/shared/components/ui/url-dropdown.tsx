"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface URLDropdownProps {
  options: DropdownOption[];
  value?: string;
  paramName: string; // URL 파라미터 이름
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  ariaLabel?: string;
}

const URLDropdown: React.FC<URLDropdownProps> = ({
  options,
  value,
  paramName,
  placeholder = "선택하세요",
  disabled = false,
  className,
  containerClassName,
  ariaLabel,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

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

  // 드롭다운 열릴 때 위치 계산 (fixed)
  useEffect(() => {
    if (isOpen && dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4, // 약간의 여백
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelect = (optionValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (optionValue) {
      params.set(paramName, optionValue);
    } else {
      params.delete(paramName);
    }

    // 필터 변경 시 페이지를 1로 리셋
    if (params.has("page")) {
      params.set("page", "1");
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    router.push(newUrl);
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
    <div className={`relative ${containerClassName || ""}`}>
      <button
        ref={dropdownButtonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`${getButtonStyles()} ${className || ""}`}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`w-full px-3 py-2 text-sm text-left transition-colors ${
                hoveredIndex === index
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-800 hover:bg-gray-50"
              } ${
                option.value === value ? "bg-primary-100 text-primary-700" : ""
              }`}
              role="option"
              aria-selected={option.value === value}
            >
              <div className="flex items-center gap-2">
                {option.icon && <span>{option.icon}</span>}
                <span>{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default URLDropdown;
