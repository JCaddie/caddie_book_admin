"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Search from "./search";
import Button from "./button";

interface SearchWithButtonProps {
  placeholder?: string;
  buttonText?: string;
  disabled?: boolean;
  searchParam?: string; // URL 파라미터 키 (기본값: "search")
  onClear?: () => void;
  // 커스텀 검색 핸들러 관련 props
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (searchTerm: string) => void;
}

const SearchWithButton: React.FC<SearchWithButtonProps> = ({
  placeholder = "검색어 입력",
  buttonText = "검색",
  disabled = false,
  searchParam = "search",
  onClear,
  value,
  onChange,
  onSearch,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 현재 검색어 가져오기 (커스텀 핸들러가 없을 때만)
  const currentSearchTerm = !onSearch
    ? searchParams.get(searchParam) || ""
    : "";

  // 로컬 입력 상태 (커스텀 핸들러가 있으면 외부 value 사용)
  const [inputValue, setInputValue] = useState(value || currentSearchTerm);

  // 외부에서 전달된 value가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // URL 파라미터가 변경되면 로컬 상태 업데이트 (커스텀 핸들러가 없을 때만)
  useEffect(() => {
    if (!onSearch) {
      setInputValue(currentSearchTerm);
    }
  }, [currentSearchTerm, onSearch]);

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // 외부 onChange 핸들러가 있으면 호출
    if (onChange) {
      onChange(e);
    }
  };

  // 검색 실행 핸들러
  const handleSearch = () => {
    if (disabled) return;

    if (onSearch) {
      // 커스텀 검색 핸들러가 있으면 사용
      onSearch(inputValue.trim());
    } else {
      // 기본 URL 파라미터 기반 검색
      const params = new URLSearchParams(Array.from(searchParams.entries()));

      if (inputValue.trim()) {
        // 검색어가 있으면 검색 파라미터 설정
        params.set(searchParam, inputValue.trim());
      } else {
        // 검색어가 없으면 검색 파라미터 제거 (모든 데이터 조회)
        params.delete(searchParam);
      }

      // 검색 시 페이지를 1로 리셋
      params.set("page", "1");

      router.push(`?${params.toString()}`);
    }
  };

  // 클리어 핸들러
  const handleClear = () => {
    setInputValue("");

    if (onClear) {
      // 외부 onClear 핸들러가 있으면 호출
      onClear();
    } else {
      // 기본 URL 파라미터 기반 클리어
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.delete(searchParam);
      params.set("page", "1");

      router.push(`?${params.toString()}`);
    }

    // 외부 onChange 핸들러가 있으면 빈 값으로 호출
    if (onChange) {
      const event = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  // Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2">
      <Search
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClear={handleClear}
        placeholder={placeholder}
        className="flex-[2] min-w-[300px]"
        disabled={disabled}
      />
      <Button
        onClick={handleSearch}
        disabled={disabled}
        className="px-4 py-2 whitespace-nowrap flex-shrink-0"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default SearchWithButton;
