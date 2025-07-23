import { DayOffRequest, DayOffRequestType, DayOffStatus } from "../types";

// ================================
// 필터링 유틸리티
// ================================

/**
 * 휴무 신청 데이터를 필터링
 */
export const filterDayOffRequests = (
  data: DayOffRequest[],
  filters: {
    request_type?: DayOffRequestType | "";
    status?: DayOffStatus | "";
    searchTerm?: string;
  }
): DayOffRequest[] => {
  return data.filter((item) => {
    // 신청구분 필터
    if (filters.request_type && item.request_type !== filters.request_type) {
      return false;
    }

    // 상태 필터
    if (filters.status && item.status !== filters.status) {
      return false;
    }

    // 검색어 필터
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const searchableFields = [
        item.caddie_name,
        item.reason,
        item.golf_course_name,
      ];

      return searchableFields.some((field) =>
        field.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });
};

// ================================
// 정렬 유틸리티
// ================================

/**
 * 휴무 신청 데이터를 날짜순으로 정렬
 */
export const sortDayOffRequestsByDate = (
  data: DayOffRequest[],
  order: "asc" | "desc" = "desc"
): DayOffRequest[] => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
};

// ================================
// 통계 유틸리티
// ================================

/**
 * 휴무 신청 통계 계산
 */
export const calculateDayOffStats = (data: DayOffRequest[]) => {
  return {
    total: data.length,
    reviewing: data.filter((item) => item.status === "reviewing").length,
    approved: data.filter((item) => item.status === "approved").length,
    rejected: data.filter((item) => item.status === "rejected").length,
  };
};
