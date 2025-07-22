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
}

const SearchWithButton: React.FC<SearchWithButtonProps> = ({
  placeholder = "검색어 입력",
  buttonText = "검색",
  disabled = false,
  searchParam = "search",
  onClear,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 현재 검색어 가져오기
  const currentSearchTerm = searchParams.get(searchParam) || "";

  // 로컬 입력 상태
  const [inputValue, setInputValue] = useState(currentSearchTerm);

  // URL 파라미터가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    setInputValue(currentSearchTerm);
  }, [currentSearchTerm]);

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 검색 실행 핸들러
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (inputValue.trim()) {
      params.set(searchParam, inputValue.trim());
    } else {
      params.delete(searchParam);
    }

    // 검색 시 페이지를 1로 리셋 (page 파라미터가 있는 경우)
    if (params.has("page")) {
      params.set("page", "1");
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      handleSearch();
    }
  };

  // 검색 초기화 핸들러
  const handleClear = () => {
    setInputValue("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete(searchParam);

    // 검색 초기화 시 페이지를 1로 리셋
    if (params.has("page")) {
      params.set("page", "1");
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    router.push(newUrl);

    // 외부 클리어 핸들러 호출
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <Search
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClear={handleClear}
        placeholder={placeholder}
        className="flex-[2] min-w-[300px]" // Increased width
        disabled={disabled}
      />
      <Button
        onClick={handleSearch}
        disabled={disabled}
        className="px-4 py-2 whitespace-nowrap flex-shrink-0" // Prevent shrinking
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default SearchWithButton;
