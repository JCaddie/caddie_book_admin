import { CaddieData, PersonnelFilter } from "../types";

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

// 캐디 데이터 필터링 함수
export const filterCaddies = (
  caddies: CaddieData[],
  filters: PersonnelFilter
): CaddieData[] => {
  return caddies.filter((caddie) => {
    const statusMatch =
      filters.status === "전체" || caddie.status === filters.status;
    const groupMatch =
      filters.group === "전체" || `${caddie.group}조` === filters.group;
    const badgeMatch =
      filters.badge === "전체" || caddie.badge === filters.badge;

    return statusMatch && groupMatch && badgeMatch;
  });
};

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
export const getCaddieCardStyle = (status: string): string => {
  switch (status) {
    case "휴무":
      return "shadow-[0_0_4px_2px_rgba(255,0,0,0.25)]";
    case "배치완료":
      return "shadow-[0_0_4px_2px_rgba(254,185,18,0.35)]";
    default:
      return "";
  }
};
