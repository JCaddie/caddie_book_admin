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

  // URL 파라미터 변경 시 입력값 동기화
  useEffect(() => {
    setInputValue(currentSearchTerm);
  }, [currentSearchTerm]);

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 검색 실행 핸들러
  const handleSearch = () => {
    if (disabled) return;

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
  };

  // 클리어 핸들러
  const handleClear = () => {
    setInputValue("");

    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete(searchParam);
    params.set("page", "1");

    router.push(`?${params.toString()}`);

    onClear?.();
  };

  // Enter 키 핸들러
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-2 w-[340px]">
      <Search
        value={inputValue}
        onChange={handleInputChange}
        onClear={handleClear}
        placeholder={placeholder}
        className="w-[180px]"
        onKeyPress={handleKeyPress}
        disabled={disabled}
      />
      <Button
        variant="primary"
        size="md"
        onClick={handleSearch}
        disabled={disabled}
        className="w-24"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default SearchWithButton;
