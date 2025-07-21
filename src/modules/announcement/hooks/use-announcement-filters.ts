import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AnnouncementFilters } from "../types";

/**
 * 공지사항 필터 관리 훅
 * URL 파라미터와 동기화된 필터 상태를 관리합니다.
 */
export const useAnnouncementFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 필터 값 추출
  const filters = useMemo((): AnnouncementFilters => {
    return {
      searchTerm: searchParams.get("search") || "",
      isPublished: searchParams.get("is_published")
        ? searchParams.get("is_published") === "true"
        : undefined,
      category:
        (searchParams.get("category") as AnnouncementFilters["category"]) ||
        undefined,
      priority:
        (searchParams.get("priority") as AnnouncementFilters["priority"]) ||
        undefined,
      isPinned: searchParams.get("is_pinned")
        ? searchParams.get("is_pinned") === "true"
        : undefined,
      startDate: searchParams.get("start_date") || undefined,
      endDate: searchParams.get("end_date") || undefined,
      authorId: searchParams.get("author_id") || undefined,
      type:
        (searchParams.get("type") as AnnouncementFilters["type"]) || undefined,
    };
  }, [searchParams]);

  // 현재 페이지 번호
  const currentPage = useMemo(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page, 10) : 1;
  }, [searchParams]);

  // URL 파라미터 업데이트 함수
  const updateUrlParams = useCallback(
    (newParams: Record<string, string>, removeParams?: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      // 새 파라미터 추가/업데이트
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // 제거할 파라미터들
      removeParams?.forEach((key) => {
        params.delete(key);
      });

      const newUrl = params.toString() ? `?${params.toString()}` : "";
      router.push(newUrl);
    },
    [router, searchParams]
  );

  // 필터 업데이트 함수
  const updateFilters = useCallback(
    (newFilters: Partial<AnnouncementFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };

      // URL 파라미터 생성
      const params: Record<string, string> = {};
      if (updatedFilters.searchTerm) params.search = updatedFilters.searchTerm;
      if (updatedFilters.isPublished !== undefined) {
        params.is_published = updatedFilters.isPublished.toString();
      }
      if (updatedFilters.category) params.category = updatedFilters.category;
      if (updatedFilters.priority) params.priority = updatedFilters.priority;
      if (updatedFilters.isPinned !== undefined) {
        params.is_pinned = updatedFilters.isPinned.toString();
      }
      if (updatedFilters.startDate)
        params.start_date = updatedFilters.startDate;
      if (updatedFilters.endDate) params.end_date = updatedFilters.endDate;
      if (updatedFilters.authorId) params.author_id = updatedFilters.authorId;
      if (updatedFilters.type) params.type = updatedFilters.type;

      updateUrlParams(params, ["page"]); // 필터 변경 시 첫 페이지로
    },
    [filters, updateUrlParams]
  );

  // 개별 필터 업데이트 함수들
  const updateSearchTerm = useCallback(
    (searchTerm: string) => {
      updateFilters({ searchTerm });
    },
    [updateFilters]
  );

  const updateIsPublished = useCallback(
    (isPublished: boolean | undefined) => {
      updateFilters({ isPublished });
    },
    [updateFilters]
  );

  const updateCategory = useCallback(
    (category: AnnouncementFilters["category"]) => {
      updateFilters({ category });
    },
    [updateFilters]
  );

  const updatePriority = useCallback(
    (priority: AnnouncementFilters["priority"]) => {
      updateFilters({ priority });
    },
    [updateFilters]
  );

  // 페이지 변경 함수
  const handlePageChange = useCallback(
    (page: number) => {
      updateUrlParams({ page: page.toString() });
    },
    [updateUrlParams]
  );

  // 필터 초기화 함수
  const clearFilters = useCallback(() => {
    router.push(window.location.pathname);
  }, [router]);

  return {
    // 상태
    filters,
    currentPage,

    // 업데이트 함수들
    updateFilters,
    updateSearchTerm,
    updateIsPublished,
    updateCategory,
    updatePriority,
    handlePageChange,
    clearFilters,
  };
};
