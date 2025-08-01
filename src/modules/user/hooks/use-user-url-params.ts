import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface UserUrlParams {
  search: string;
  role: string;
  page: number;
}

export const useUserUrlParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 값 추출
  const params = useMemo(() => ({
    search: searchParams.get("search") || "",
    role: searchParams.get("role") || "",
    page: parseInt(searchParams.get("page") || "1", 10),
  }), [searchParams]);

  // URL 파라미터 업데이트 함수
  const updateParams = useCallback((updates: Partial<UserUrlParams>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });

    // 페이지가 변경되면 1페이지로 리셋
    if (updates.search !== undefined || updates.role !== undefined) {
      newSearchParams.set("page", "1");
    }

    const newUrl = `/users?${newSearchParams.toString()}`;
    router.push(newUrl);
  }, [router, searchParams]);

  // 검색어 업데이트
  const setSearch = useCallback((search: string) => {
    updateParams({ search });
  }, [updateParams]);

  // 역할 필터 업데이트
  const setRole = useCallback((role: string) => {
    updateParams({ role });
  }, [updateParams]);

  // 페이지 업데이트
  const setPage = useCallback((page: number) => {
    updateParams({ page });
  }, [updateParams]);

  return {
    params,
    setSearch,
    setRole,
    setPage,
    updateParams,
  };
}; 