// 골프장 데이터 변환 및 처리 유틸리티 함수들

import type {
  EditableGolfCourse,
  GolfCourse,
  GolfCourseFilterState,
} from "../types";
import type { GolfCourseDomain } from "../types/domain";

/**
 * 필터 상태를 URL 쿼리 파라미터로 변환
 */
export const filterStateToUrlParams = (
  filters: GolfCourseFilterState
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.contractStatus) params.set("contract", filters.contractStatus);
  if (filters.membershipType)
    params.set("membership_type", filters.membershipType);
  if (filters.isActive) params.set("isActive", filters.isActive);
  if (filters.page > 1) params.set("page", String(filters.page));

  return params;
};

/**
 * URL 쿼리 파라미터를 필터 상태로 변환
 */
export const urlParamsToFilterState = (
  searchParams: URLSearchParams
): GolfCourseFilterState => {
  return {
    search: searchParams.get("search") || "",
    contractStatus: searchParams.get("contract") || "",
    membershipType: searchParams.get("membership_type") || "",
    isActive: searchParams.get("isActive") || "",
    page: Number(searchParams.get("page")) || 1,
  };
};

/**
 * 골프장 목록을 그룹별로 분류
 */
export const groupGolfCoursesByRegion = (
  golfCourses: GolfCourse[]
): Record<string, GolfCourse[]> => {
  return golfCourses.reduce((groups, course) => {
    const region = course.region || "기타";
    if (!groups[region]) {
      groups[region] = [];
    }
    groups[region].push(course);
    return groups;
  }, {} as Record<string, GolfCourse[]>);
};

/**
 * 골프장 목록을 계약 상태별로 분류
 */
export const groupGolfCoursesByContractStatus = (
  golfCourses: GolfCourse[]
): Record<string, GolfCourse[]> => {
  return golfCourses.reduce((groups, course) => {
    const status = course.contractStatus || "미분류";
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(course);
    return groups;
  }, {} as Record<string, GolfCourse[]>);
};

/**
 * 골프장 통계 계산
 */
export const calculateGolfCourseStats = (golfCourses: GolfCourse[]) => {
  const stats = {
    total: golfCourses.length,
    totalCaddies: 0,
    totalFields: 0,
    averageCaddiesPerCourse: 0,
    averageFieldsPerCourse: 0,
    contractStatuses: {} as Record<string, number>,
    membershipTypes: {} as Record<string, number>,
    regions: {} as Record<string, number>,
  };

  golfCourses.forEach((course) => {
    // 총계 계산
    stats.totalCaddies += course.caddies;
    stats.totalFields += course.fields;

    // 계약 상태별 통계
    const contractStatus = course.contractStatus || "미분류";
    stats.contractStatuses[contractStatus] =
      (stats.contractStatuses[contractStatus] || 0) + 1;

    // 회원제 타입별 통계
    const membershipType = course.membershipType || "미분류";
    stats.membershipTypes[membershipType] =
      (stats.membershipTypes[membershipType] || 0) + 1;

    // 지역별 통계
    const region = course.region || "기타";
    stats.regions[region] = (stats.regions[region] || 0) + 1;
  });

  // 평균값 계산
  if (stats.total > 0) {
    stats.averageCaddiesPerCourse =
      Math.round((stats.totalCaddies / stats.total) * 10) / 10;
    stats.averageFieldsPerCourse =
      Math.round((stats.totalFields / stats.total) * 10) / 10;
  }

  return stats;
};

/**
 * 골프장 목록 정렬
 */
export const sortGolfCourses = (
  golfCourses: GolfCourse[],
  sortBy: keyof GolfCourse,
  direction: "asc" | "desc" = "asc"
): GolfCourse[] => {
  return [...golfCourses].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // 숫자 타입 처리
    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    // 문자열 타입 처리
    const aString = String(aValue || "").toLowerCase();
    const bString = String(bValue || "").toLowerCase();

    if (direction === "asc") {
      return aString.localeCompare(bString, "ko-KR");
    } else {
      return bString.localeCompare(aString, "ko-KR");
    }
  });
};

/**
 * 골프장 목록 필터링
 */
export const filterGolfCourses = (
  golfCourses: GolfCourse[],
  filters: Partial<GolfCourseFilterState>
): GolfCourse[] => {
  return golfCourses.filter((course) => {
    // 검색어 필터
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchableText = `${course.name} ${course.region}`.toLowerCase();
      if (!searchableText.includes(searchLower)) {
        return false;
      }
    }

    // 계약 상태 필터
    if (
      filters.contractStatus &&
      course.contractStatus !== filters.contractStatus
    ) {
      return false;
    }

    // 회원제 타입 필터
    if (
      filters.membershipType &&
      course.membershipType !== filters.membershipType
    ) {
      return false;
    }

    return true;
  });
};

/**
 * 골프장 데이터 중복 제거
 */
export const deduplicateGolfCourses = (
  golfCourses: GolfCourse[]
): GolfCourse[] => {
  const seen = new Set<string>();
  return golfCourses.filter((course) => {
    if (seen.has(course.id)) {
      return false;
    }
    seen.add(course.id);
    return true;
  });
};

/**
 * 골프장 검색 키워드 하이라이트
 */
export const highlightSearchTerms = (
  text: string,
  searchTerm: string
): string => {
  if (!searchTerm) return text;

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return text.replace(regex, "<mark>$1</mark>");
};

/**
 * 골프장 데이터 병합
 */
export const mergeGolfCourseData = (
  existing: EditableGolfCourse,
  updates: Partial<EditableGolfCourse>
): EditableGolfCourse => {
  return {
    ...existing,
    ...updates,
    representative: {
      ...existing.representative,
      ...(updates.representative || {}),
    },
    manager: {
      ...existing.manager,
      ...(updates.manager || {}),
    },
  };
};

/**
 * 골프장 데이터 깊은 복사
 */
export const cloneGolfCourseData = (
  golfCourse: EditableGolfCourse
): EditableGolfCourse => {
  return {
    ...golfCourse,
    representative: { ...golfCourse.representative },
    manager: { ...golfCourse.manager },
  };
};

/**
 * 도메인 모델을 표시용 모델로 변환
 */
export const domainToDisplayModel = (domain: GolfCourseDomain): GolfCourse => {
  return {
    id: domain.id,
    no: 0, // 이 값은 테이블 렌더링 시 동적으로 설정됨
    name: domain.name,
    region: domain.region,
    contractStatus: domain.contractStatus,
    phone: domain.phone,
    membershipType: domain.membershipType,
    caddies: domain.operationStats.totalCaddies,
    fields: domain.operationStats.fieldCount,
  };
};

/**
 * 골프장 데이터 검증 (기본 유효성 검사)
 */
export const isValidGolfCourseData = (
  golfCourse: Partial<EditableGolfCourse>
): boolean => {
  return !!(
    golfCourse.name &&
    golfCourse.region &&
    golfCourse.address &&
    golfCourse.contractStatus &&
    golfCourse.membershipType
  );
};

/**
 * 빈 골프장 데이터 생성
 */
export const createEmptyGolfCourseData = (): EditableGolfCourse => {
  return {
    id: "",
    name: "",
    region: "",
    address: "",
    contractStatus: "",
    membershipType: "",
    phone: "",
    isActive: true,
    representative: {
      name: "",
      contact: "",
      email: "",
    },
    manager: {
      name: "",
      contact: "",
      email: "",
    },
  };
};

/**
 * 골프장 데이터 요약 정보 생성
 */
export const createGolfCourseSummary = (
  golfCourse: GolfCourse | GolfCourseDomain
) => {
  const isGolfCourse = "caddies" in golfCourse;

  return {
    id: golfCourse.id,
    name: golfCourse.name,
    region: golfCourse.region,
    totalCaddies: isGolfCourse
      ? golfCourse.caddies
      : golfCourse.operationStats.totalCaddies,
    fieldCount: isGolfCourse
      ? golfCourse.fields
      : golfCourse.operationStats.fieldCount,
    contractStatus: golfCourse.contractStatus,
    membershipType: golfCourse.membershipType,
  };
};
