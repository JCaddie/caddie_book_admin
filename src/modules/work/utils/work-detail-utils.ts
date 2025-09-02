import { CaddieData, Field, PersonnelFilter } from "../types";

// ================================
// 날짜 관련 유틸리티
// ================================

// 날짜 포맷팅 함수
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekDay = weekDays[date.getDay()];

  return `${year}.${month}.${day}.(${weekDay})`;
};

// API용 날짜 포맷팅
export const formatDateForApi = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// 현재 날짜 가져오기
export const getCurrentDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// 날짜 유효성 검사
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// ================================
// 캐디 데이터 관련 유틸리티
// ================================

// 캐디 데이터 필터링 함수
export const filterCaddies = (
  caddies: CaddieData[],
  filters: PersonnelFilter
): CaddieData[] => {
  return caddies.filter((caddie) => {
    const statusMatch =
      !filters.status ||
      filters.status === "전체" ||
      caddie.status === filters.status;
    const groupMatch =
      !filters.group ||
      filters.group === "전체" ||
      `${caddie.group}조` === filters.group;
    const badgeMatch =
      !filters.badge ||
      filters.badge === "전체" ||
      caddie.badge === filters.badge;

    return statusMatch && groupMatch && badgeMatch;
  });
};

// 캐디 데이터 정렬 함수
export const sortCaddies = (caddies: CaddieData[]): CaddieData[] => {
  return [...caddies].sort((a, b) => {
    // 그룹 순서로 먼저 정렬
    if (a.group !== b.group) {
      return a.group - b.group;
    }
    // 그룹 내에서는 순서로 정렬
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    // 마지막으로 이름으로 정렬
    return a.name.localeCompare(b.name);
  });
};

// 캐디 데이터 검색 함수
export const searchCaddies = (
  caddies: CaddieData[],
  searchTerm: string
): CaddieData[] => {
  if (!searchTerm.trim()) return caddies;

  const term = searchTerm.toLowerCase();
  return caddies.filter(
    (caddie) =>
      caddie.name.toLowerCase().includes(term) ||
      caddie.groupName?.toLowerCase().includes(term) ||
      caddie.badge.toLowerCase().includes(term)
  );
};

// ================================
// 스타일 관련 유틸리티
// ================================

// 특수 배지 스타일 가져오기
export const getSpecialBadgeStyle = (specialBadge?: string) => {
  switch (specialBadge) {
    case "조첫":
      return { bg: "#E3E3E3", text: "#2F78FF" };
    case "스페어":
      return { bg: "#E3E3E3", text: "#83BF50" };
    default:
      return null;
  }
};

// 캐디 카드 스타일 가져오기
export const getCaddieCardStyle = (caddie: CaddieData): string => {
  // 스페어 상태일 때 우선 적용
  if (caddie.isSpare) {
    return "shadow-[0_0_4px_2px_rgba(34,197,94,0.35)] border-[#22C55E]";
  }

  // 일반 상태별 스타일
  switch (caddie.status) {
    case "휴무":
      return "shadow-[0_0_4px_2px_rgba(255,0,0,0.25)]";
    case "배치완료":
      return "shadow-[0_0_4px_2px_rgba(254,185,18,0.35)]";
    case "근무":
      return "shadow-[0_0_4px_2px_rgba(0,255,0,0.25)]";
    default:
      return "";
  }
};

// 상태별 색상 가져오기
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "근무":
      return "text-green-600";
    case "휴무":
      return "text-red-600";
    case "배치완료":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
};

// ================================
// 필드 관련 유틸리티
// ================================

// 필드 정렬 함수
export const sortFields = (fields: Field[]): Field[] => {
  return [...fields].sort((a, b) => a.id - b.id);
};

// 활성 필드만 필터링
export const getActiveFields = (fields: Field[]): Field[] => {
  return fields.filter((field) => field.id > 0);
};

// ================================
// 시간 관련 유틸리티
// ================================

// 시간 문자열을 분으로 변환
export const timeStringToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

// 분을 시간 문자열로 변환
export const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

// 시간 간격 계산
export const calculateTimeInterval = (
  startTime: string,
  endTime: string
): number => {
  const start = timeStringToMinutes(startTime);
  const end = timeStringToMinutes(endTime);
  return end - start;
};

// ================================
// 검증 관련 유틸리티
// ================================

// 캐디 데이터 검증
export const validateCaddieData = (caddie: Partial<CaddieData>): string[] => {
  const errors: string[] = [];

  if (!caddie.name?.trim()) {
    errors.push("캐디 이름은 필수입니다.");
  }

  if (caddie.group === undefined || caddie.group < 0) {
    errors.push("그룹 번호는 0 이상이어야 합니다.");
  }

  return errors;
};

// 필드 데이터 검증
export const validateFieldData = (field: Partial<Field>): string[] => {
  const errors: string[] = [];

  if (!field.name?.trim()) {
    errors.push("필드 이름은 필수입니다.");
  }

  if (field.id === undefined || field.id < 0) {
    errors.push("필드 ID는 0 이상이어야 합니다.");
  }

  return errors;
};
