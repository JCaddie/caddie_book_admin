"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface UseUrlSearchParamsProps {
  searchKey?: string;
  initialSearchTerm?: string;
  onSearchChange?: (searchTerm: string) => void;
}

export const useUrlSearchParams = ({
  searchKey = "search",
  initialSearchTerm = "",
  onSearchChange,
}: UseUrlSearchParamsProps = {}) => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // URL에서 검색 파라미터 읽기
  useEffect(() => {
    const urlSearchTerm = searchParams.get(searchKey);
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
      onSearchChange?.(urlSearchTerm);
    }
  }, [searchParams, searchKey, onSearchChange]);

  // 검색어 변경 핸들러
  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    onSearchChange?.(newSearchTerm);
  };

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
  };
};
