/**
 * 공통 포맷팅 유틸리티 함수들
 */

// 날짜 포맷팅 함수
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 간단한 날짜 포맷팅 (시간 제외)
export const formatDateOnly = (dateString: string | Date): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// 숫자 포맷팅 함수 (천 단위 콤마)
export const formatNumber = (value: number | string): string => {
  if (value === null || value === undefined || value === "") return "";

  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);

  return num.toLocaleString();
};

// 조회수 포맷팅 (특별한 표시 없이 단순 숫자)
export const formatViews = (views: number): string => {
  return formatNumber(views);
};

// 전화번호 포맷팅
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "";

  // 숫자만 추출
  const numbers = phone.replace(/\D/g, "");

  if (numbers.length === 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  } else if (numbers.length === 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }

  return phone;
};

// 문자열 줄임 처리
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// 안전한 문자열 변환
export const safeString = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};
