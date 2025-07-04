"use client";

import React, { useState, forwardRef } from "react";
import { Search as SearchIcon, X } from "lucide-react";

interface SearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  onClear?: () => void;
  containerClassName?: string;
}

const Search = forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      onClear,
      containerClassName,
      value,
      onChange,
      placeholder = "검색...",
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.toString().length > 0;

    const handleClear = () => {
      if (onChange) {
        // Create a synthetic event for clear action
        const syntheticEvent = {
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
      onClear?.();
    };

    return (
      <div
        className={[
          "relative flex items-center bg-white border rounded-md transition-colors",
          // Figma 스펙: 8px 12px padding, 40px height
          "h-10 px-3",
          // 테두리 색상: 기본 #E3E3E3, 포커스/활성 시 primary
          isFocused || hasValue ? "border-primary" : "border-gray-300",
          containerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* 검색 아이콘 - 24px */}
        <SearchIcon size={24} className="text-gray-400 mr-2 flex-shrink-0" />

        {/* 입력 필드 */}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={[
            "flex-1 bg-transparent border-0 outline-none",
            // Figma 스펙: Pretendard 500 14px
            "text-sm font-medium text-gray-900 placeholder-gray-400",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {/* 클리어 버튼 - 16px, 값이 있을 때만 표시 */}
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }
);

Search.displayName = "Search";

export default Search;
