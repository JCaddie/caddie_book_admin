"use client";

import React, { forwardRef, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  onClear?: () => void;
  containerClassName?: string;
  showVisibilityToggle?: boolean;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      onClear,
      containerClassName,
      showVisibilityToggle = false,
      type: propType = "text",
      value,
      onChange,
      placeholder,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const hasValue = value && value.toString().length > 0;

    const type = showVisibilityToggle
      ? showPassword
        ? "text"
        : "password"
      : propType;

    const handleClear = () => {
      if (onChange) {
        const syntheticEvent = {
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
      onClear?.();
    };

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    // Figma 스펙에 따른 상태별 스타일
    const getInputStyles = () => {
      const baseStyles = [
        "w-full h-10 px-3 border rounded-md transition-colors",
        "text-sm font-medium text-gray-900 placeholder-gray-400",
        "focus:outline-none",
      ];

      if (disabled) {
        baseStyles.push("bg-gray-50 border-gray-300 cursor-not-allowed");
      } else if (error) {
        baseStyles.push(
          "bg-white border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        );
      } else if (isFocused || hasValue) {
        baseStyles.push(
          "bg-white border-primary focus:border-primary focus:ring-1 focus:ring-primary/20"
        );
      } else {
        baseStyles.push("bg-white border-gray-300 hover:border-primary-300");
      }

      return baseStyles.filter(Boolean).join(" ");
    };

    return (
      <div
        className={["space-y-2", containerClassName].filter(Boolean).join(" ")}
      >
        {/* 라벨 - Figma 스펙: Pretendard 500 14px */}
        {label && (
          <label className="block text-sm font-medium text-gray-800">
            {label}
          </label>
        )}

        {/* 입력 필드 컨테이너 */}
        <div className="relative">
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={[getInputStyles(), className].filter(Boolean).join(" ")}
            {...props}
          />

          {/* 우측 아이콘들 */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* 비밀번호 표시/숨김 토글 */}
            {showVisibilityToggle && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}

            {/* 클리어 버튼 - 값이 있고 활성 상태일 때만 표시 */}
            {hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* 에러 메시지 - Figma 스펙: Pretendard 400 11px */}
        {error && <p className="text-xs text-red-500 font-normal">{error}</p>}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
