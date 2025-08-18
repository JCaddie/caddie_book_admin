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
        item.request_reason,
        item.notes,
        item.process_notes,
      ].filter(Boolean); // null/undefined 값 제거

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
    sickLeaveRequest: data.filter(
      (item) => item.status === "SICK_LEAVE_REQUEST"
    ).length,
    approved: data.filter(
      (item) => item.process_result === "APPROVED" || item.status === "approved"
    ).length,
    rejected: data.filter(
      (item) => item.process_result === "REJECTED" || item.status === "rejected"
    ).length,
    pending: data.filter(
      (item) => item.process_result === "PENDING" || item.status === "reviewing"
    ).length,
  };
};

// ================================
// 포맷팅 유틸리티
// ================================

/**
 * 처리 결과를 한글로 변환
 */
export const formatProcessResult = (result: string): string => {
  switch (result) {
    case "APPROVED":
      return "승인";
    case "REJECTED":
      return "반려";
    case "PENDING":
      return "대기";
    default:
      return result;
  }
};

/**
 * 처리 결과에 따른 색상 클래스 반환
 */
export const getProcessResultColor = (result: string): string => {
  switch (result) {
    case "APPROVED":
      return "text-green-600";
    case "REJECTED":
      return "text-red-600";
    case "PENDING":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
};

/**
 * 상태를 한글로 변환
 */
export const formatStatus = (status: string): string => {
  switch (status) {
    case "SICK_LEAVE_REQUEST":
      return "병가 신청";
    case "APPROVED":
      return "승인";
    case "REJECTED":
      return "반려";
    case "reviewing":
      return "검토 중";
    case "approved":
      return "승인";
    case "rejected":
      return "반려";
    default:
      return status;
  }
};
