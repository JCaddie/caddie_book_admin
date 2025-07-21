import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Announcement,
  AnnouncementFilters,
  AnnouncementSelection,
  AnnouncementWithNo,
  CreateAnnouncementData,
} from "../types";
import { ANNOUNCEMENT_CONSTANTS } from "../constants";
import {
  addNumberToAnnouncements,
  isValidAnnouncement,
  transformAnnouncementListResponse,
} from "../utils";
import {
  deleteAnnouncements,
  fetchAnnouncements,
} from "../api/announcement-api";

interface UseAnnouncementListReturn {
  // 데이터
  data: AnnouncementWithNo[];
  totalCount: number;
  realDataCount: number;

  // 페이지네이션
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;

  // 필터
  filters: AnnouncementFilters;
  updateSearchTerm: (searchTerm: string) => void;
  updateIsPublished: (isPublished: boolean | undefined) => void;
  updateFilters: (filters: Partial<AnnouncementFilters>) => void;

  // 선택
  selection: AnnouncementSelection;
  updateSelection: (
    selectedRowKeys: string[],
    selectedRows: Announcement[]
  ) => void;
  clearSelection: () => void;

  // 액션
  deleteSelectedAnnouncements: () => Promise<void>;
  createNewAnnouncement: (data: CreateAnnouncementData) => Promise<void>;

  // 상태
  isDeleting: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * 공지사항 리스트 관리를 위한 커스텀 훅
 */
export const useAnnouncementList = (): UseAnnouncementListReturn => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 현재 페이지와 필터 정보 추출
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // 필터 상태
  const [filters, setFilters] = useState<AnnouncementFilters>({
    searchTerm: searchParams.get("search") || "",
    isPublished: searchParams.get("is_published")
      ? searchParams.get("is_published") === "true"
      : undefined,
  });

  // 선택 상태
  const [selection, setSelection] = useState<AnnouncementSelection>({
    selectedRowKeys: [],
    selectedRows: [],
  });

  // 삭제 로딩 상태
  const [isDeleting, setIsDeleting] = useState(false);

  // 에러 관리
  const [error, setError] = useState<string | null>(null);

  // URL 파라미터 업데이트 함수
  const updateUrlParams = useCallback(
    (params: Record<string, string>, resetParams?: string[]) => {
      const newSearchParams = new URLSearchParams(searchParams);

      // 리셋할 파라미터들 제거
      resetParams?.forEach((param) => newSearchParams.delete(param));

      // 새 파라미터들 추가/업데이트
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      });

      router.push(`?${newSearchParams.toString()}`);
    },
    [router, searchParams]
  );

  // API 데이터 조회
  const { data: apiResponse, error: queryError } = useQuery({
    queryKey: ["announcements", currentPage, filters],
    queryFn: () =>
      fetchAnnouncements(
        filters,
        currentPage,
        ANNOUNCEMENT_CONSTANTS.PAGE_SIZE
      ),
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  // 필터 업데이트 함수
  const updateFilters = useCallback(
    (newFilters: Partial<AnnouncementFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);

      // URL 파라미터 업데이트
      const params: Record<string, string> = {};
      if (updatedFilters.searchTerm) params.search = updatedFilters.searchTerm;
      if (updatedFilters.isPublished !== undefined) {
        params.is_published = updatedFilters.isPublished.toString();
      }

      updateUrlParams(params, ["page"]); // 필터 변경 시 첫 페이지로
    },
    [filters, updateUrlParams]
  );

  // 데이터 처리 (백엔드 응답을 프론트엔드 형태로 변환)
  const transformedData = apiResponse
    ? transformAnnouncementListResponse(apiResponse)
    : null;
  const announcements = transformedData?.items || [];
  const totalCount = transformedData?.totalCount || 0;
  const totalPages = transformedData?.totalPages || 0;

  // 번호가 추가된 현재 페이지 데이터
  const currentDataWithNo = useMemo(() => {
    return addNumberToAnnouncements(
      announcements,
      currentPage,
      ANNOUNCEMENT_CONSTANTS.PAGE_SIZE
    );
  }, [announcements, currentPage]);

  // 필터 업데이트 함수들
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

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (page: number) => {
      updateUrlParams({ page: page.toString() });
    },
    [updateUrlParams]
  );

  // 선택 관련 함수들
  const updateSelection = useCallback(
    (selectedRowKeys: string[], selectedRows: Announcement[]) => {
      // 유효한 행만 선택되도록 필터링
      const validRows = selectedRows.filter((row) => {
        // AnnouncementWithNo 타입으로 캐스팅해서 유효성 검사
        const rowWithNo = row as AnnouncementWithNo;
        return isValidAnnouncement(rowWithNo);
      });
      const validKeys = validRows.map((row) => row.id);

      setSelection({ selectedRowKeys: validKeys, selectedRows: validRows });
    },
    []
  );

  const clearSelection = useCallback(() => {
    setSelection({ selectedRowKeys: [], selectedRows: [] });
  }, []);

  // 선택된 공지사항 삭제
  const deleteSelectedAnnouncements = useCallback(async () => {
    if (selection.selectedRows.length === 0) return;

    setIsDeleting(true);
    setError(null);

    try {
      const ids = selection.selectedRowKeys;
      await deleteAnnouncements(ids);

      // 성공 후 캐시 무효화 및 선택 상태 초기화
      await queryClient.invalidateQueries({ queryKey: ["announcements"] });
      clearSelection();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "공지사항 삭제 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [
    selection.selectedRows,
    selection.selectedRowKeys,
    clearSelection,
    queryClient,
  ]);

  // 새 공지사항 생성
  const createNewAnnouncement = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_announcementData: CreateAnnouncementData) => {
      setError(null);

      try {
        // 실제로는 별도 훅에서 처리하므로 여기서는 캐시 무효화만
        await queryClient.invalidateQueries({ queryKey: ["announcements"] });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "공지사항 생성 중 오류가 발생했습니다.";
        setError(errorMessage);
        throw err;
      }
    },
    [queryClient]
  );

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 쿼리 에러를 로컬 에러로 설정
  if (queryError && !error) {
    setError(
      queryError instanceof Error
        ? queryError.message
        : "데이터를 불러오는 중 오류가 발생했습니다."
    );
  }

  return {
    // 데이터
    data: currentDataWithNo,
    totalCount,
    realDataCount: announcements.length,

    // 페이지네이션
    currentPage,
    totalPages,
    handlePageChange,

    // 필터
    filters,
    updateSearchTerm,
    updateIsPublished,
    updateFilters,

    // 선택
    selection,
    updateSelection,
    clearSelection,

    // 액션
    deleteSelectedAnnouncements,
    createNewAnnouncement,

    // 상태
    isDeleting,
    error,
    clearError,
  };
};
