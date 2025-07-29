// ================================
// 캐디 데이터 변환 유틸리티
// ================================

import type {
  Caddie,
  CaddieFilters,
  CaddieSelection,
  EditableCaddie,
  EmploymentType,
} from "../types";

// 필터 조건에 따른 캐디 목록 필터링
export const filterCaddies = (
  caddies: Caddie[],
  filters: CaddieFilters
): Caddie[] => {
  return caddies.filter((caddie) => {
    // 검색어 필터링 (이름, 이메일, 전화번호)
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const name = caddie.user_name?.toLowerCase() || "";
      const email = caddie.user_email?.toLowerCase() || "";
      const phone = caddie.user_phone?.toLowerCase() || "";

      if (
        !name.includes(searchTerm) &&
        !email.includes(searchTerm) &&
        !phone.includes(searchTerm)
      ) {
        return false;
      }
    }

    // 그룹 필터링
    if (filters.selectedGroup && filters.selectedGroup !== "") {
      if (String(caddie.primary_group) !== filters.selectedGroup) {
        return false;
      }
    }

    // 특수반 필터링
    if (filters.selectedSpecialTeam && filters.selectedSpecialTeam !== "") {
      if (String(caddie.special_group) !== filters.selectedSpecialTeam) {
        return false;
      }
    }

    // 골프장 필터링
    if (filters.selectedGolfCourseId && filters.selectedGolfCourseId !== "") {
      if (caddie.golf_course_name !== filters.selectedGolfCourseId) {
        return false;
      }
    }

    return true;
  });
};

// 캐디 목록 정렬
export const sortCaddies = (
  caddies: Caddie[],
  sortBy: keyof Caddie,
  sortOrder: "asc" | "desc" = "asc"
): Caddie[] => {
  return [...caddies].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    // null/undefined 처리
    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return sortOrder === "asc" ? 1 : -1;
    if (valueB == null) return sortOrder === "asc" ? -1 : 1;

    // 문자열 비교
    if (typeof valueA === "string" && typeof valueB === "string") {
      const strA = valueA.toLowerCase();
      const strB = valueB.toLowerCase();

      if (strA < strB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (strA > strB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    }

    // 숫자 비교
    if (typeof valueA === "number" && typeof valueB === "number") {
      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    }

    // 기타 타입은 문자열로 변환해서 비교
    const strA = String(valueA).toLowerCase();
    const strB = String(valueB).toLowerCase();

    if (strA < strB) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (strA > strB) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });
};

// 캐디 데이터를 편집 가능한 형태로 변환
export const transformCaddieToEditable = (caddie: Caddie): EditableCaddie => {
  return {
    id: caddie.id,
    name: caddie.user_name,
    gender: caddie.gender,
    employmentType: caddie.employment_type,
    golfCourse: caddie.golf_course_name,
    workScore: caddie.work_score,
    isTeamLeader: caddie.is_team_leader,
    primaryGroup: String(caddie.primary_group || ""),
    specialGroups: String(caddie.special_group || ""),
    phone: caddie.user_phone,
    email: caddie.user_email,
    address: caddie.address,
  };
};

// 편집 가능한 형태를 API 요청 형태로 변환
export const transformEditableToApiRequest = (
  editable: Partial<EditableCaddie>
): Record<string, unknown> => {
  const apiData: Record<string, unknown> = {};

  if (editable.name !== undefined) {
    apiData.user_name = editable.name;
  }

  if (editable.gender !== undefined) {
    apiData.gender = editable.gender;
  }

  if (editable.employmentType !== undefined) {
    apiData.employment_type = editable.employmentType;
  }

  if (editable.workScore !== undefined) {
    apiData.work_score = editable.workScore;
  }

  if (editable.isTeamLeader !== undefined) {
    apiData.is_team_leader = editable.isTeamLeader;
  }

  if (editable.primaryGroup !== undefined && editable.primaryGroup !== "") {
    apiData.primary_group = parseInt(editable.primaryGroup);
  }

  if (editable.specialGroups !== undefined && editable.specialGroups !== "") {
    apiData.special_group = parseInt(editable.specialGroups);
  }

  if (editable.phone !== undefined) {
    apiData.user_phone = editable.phone;
  }

  if (editable.email !== undefined) {
    apiData.user_email = editable.email;
  }

  if (editable.address !== undefined) {
    apiData.address = editable.address;
  }

  return apiData;
};

// 선택된 캐디들의 통계 계산
export const calculateCaddieStats = (caddies: Caddie[]) => {
  if (caddies.length === 0) {
    return {
      total: 0,
      averageWorkScore: 0,
      onDutyCount: 0,
      teamLeaderCount: 0,
      employmentTypeStats: {},
      genderStats: { M: 0, F: 0 },
    };
  }

  const stats = {
    total: caddies.length,
    averageWorkScore: 0,
    onDutyCount: 0,
    teamLeaderCount: 0,
    employmentTypeStats: {} as Record<EmploymentType, number>,
    genderStats: { M: 0, F: 0 },
  };

  let totalWorkScore = 0;

  caddies.forEach((caddie) => {
    // 근무 점수 합계
    totalWorkScore += caddie.work_score;

    // 근무 중인 캐디 수
    if (caddie.is_on_duty) {
      stats.onDutyCount++;
    }

    // 팀장 수
    if (caddie.is_team_leader) {
      stats.teamLeaderCount++;
    }

    // 고용형태별 통계
    const empType = caddie.employment_type;
    stats.employmentTypeStats[empType] =
      (stats.employmentTypeStats[empType] || 0) + 1;

    // 성별 통계
    if (caddie.gender === "M" || caddie.gender === "F") {
      stats.genderStats[caddie.gender]++;
    }
  });

  // 평균 근무 점수 계산
  stats.averageWorkScore = Math.round(totalWorkScore / caddies.length);

  return stats;
};

// 페이지네이션 적용
export const paginateCaddies = (
  caddies: Caddie[],
  page: number,
  pageSize: number
): {
  data: Caddie[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
} => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = caddies.slice(startIndex, endIndex);
  const totalPages = Math.ceil(caddies.length / pageSize);

  return {
    data,
    totalPages,
    currentPage: page,
    totalItems: caddies.length,
  };
};

// 캐디 선택 상태 업데이트
export const updateCaddieSelection = (
  currentSelection: CaddieSelection,
  selectedRowKeys: string[],
  allCaddies: Caddie[]
): CaddieSelection => {
  const selectedRows = allCaddies.filter((caddie) =>
    selectedRowKeys.includes(caddie.id)
  );

  return {
    selectedRowKeys,
    selectedRows,
  };
};

// 캐디 목록을 CSV 형태로 변환
export const transformCaddiesToCSV = (caddies: Caddie[]): string => {
  const headers = [
    "ID",
    "이름",
    "성별",
    "고용형태",
    "골프장",
    "전화번호",
    "이메일",
    "주소",
    "근무점수",
    "팀장여부",
    "주그룹",
    "특수반",
    "근무상태",
    "등록상태",
    "남은휴무일",
    "생성일시",
  ];

  const rows = caddies.map((caddie) => [
    caddie.id,
    caddie.user_name,
    caddie.gender === "M" ? "남성" : "여성",
    caddie.employment_type,
    caddie.golf_course_name,
    caddie.user_phone,
    caddie.user_email,
    caddie.address,
    caddie.work_score,
    caddie.is_team_leader ? "팀장" : "일반",
    caddie.primary_group || "미배정",
    caddie.special_group || "없음",
    caddie.is_on_duty ? "근무 중" : "휴무",
    caddie.registration_status,
    caddie.remaining_days_off,
    caddie.created_at,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  return csvContent;
};

// 캐디 데이터 유효성 확인
export const validateCaddieData = (
  caddie: Partial<Caddie>
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!caddie.user_name || caddie.user_name.trim().length === 0) {
    errors.push("이름이 필요합니다.");
  }

  if (
    !caddie.user_email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(caddie.user_email)
  ) {
    errors.push("올바른 이메일 형식이 아닙니다.");
  }

  if (
    !caddie.user_phone ||
    !/^01[0-9]-\d{3,4}-\d{4}$/.test(caddie.user_phone)
  ) {
    errors.push("올바른 전화번호 형식이 아닙니다.");
  }

  if (!caddie.gender || !["M", "F"].includes(caddie.gender)) {
    errors.push("성별을 선택해주세요.");
  }

  if (
    caddie.work_score !== undefined &&
    (caddie.work_score < 0 || caddie.work_score > 100)
  ) {
    errors.push("근무점수는 0-100 사이여야 합니다.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 빈 캐디 객체 생성 (새 캐디 등록용)
export const createEmptyCaddie = (): Partial<EditableCaddie> => {
  return {
    name: "",
    gender: "M",
    employmentType: "FULL_TIME",
    golfCourse: "",
    workScore: 0,
    isTeamLeader: false,
    primaryGroup: "",
    specialGroups: "",
    phone: "",
    email: "",
    address: "",
  };
};
