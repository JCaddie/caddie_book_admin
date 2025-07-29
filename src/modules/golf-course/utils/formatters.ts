// 골프장 관련 데이터 포맷팅 함수들

/**
 * 전화번호 포맷팅 (하이픈 추가)
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "";

  // 숫자만 추출
  const numbers = phone.replace(/\D/g, "");

  // 길이에 따라 포맷팅
  if (numbers.length === 11 && numbers.startsWith("010")) {
    // 010-1234-5678
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  } else if (numbers.length === 10 && numbers.startsWith("02")) {
    // 02-1234-5678
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else if (numbers.length === 11 && !numbers.startsWith("010")) {
    // 031-123-4567
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  } else if (numbers.length === 10) {
    // 031-123-4567
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }

  return phone; // 포맷팅할 수 없는 경우 원본 반환
};

/**
 * 이메일 마스킹 (개인정보 보호)
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes("@")) return email;

  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) return email;

  const maskedLocal =
    localPart[0] +
    "*".repeat(localPart.length - 2) +
    localPart[localPart.length - 1];
  return `${maskedLocal}@${domain}`;
};

/**
 * 전화번호 마스킹 (개인정보 보호)
 */
export const maskPhoneNumber = (phone: string): string => {
  if (!phone) return "";

  const formatted = formatPhoneNumber(phone);
  const parts = formatted.split("-");

  if (parts.length === 3) {
    return `${parts[0]}-****-${parts[2]}`;
  }

  return phone;
};

/**
 * 숫자를 한국어 단위로 포맷팅
 */
export const formatNumberWithUnit = (num: number): string => {
  if (num >= 10000) {
    const man = Math.floor(num / 10000);
    const remainder = num % 10000;
    if (remainder === 0) {
      return `${man}만`;
    } else {
      return `${man}만 ${remainder.toLocaleString()}`;
    }
  }
  return num.toLocaleString();
};

/**
 * 날짜를 상대적 시간으로 포맷팅
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "방금 전";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return date.toLocaleDateString("ko-KR");
  }
};

/**
 * 계약 상태에 따른 색상 클래스 반환
 */
export const getContractStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "active":
    case "계약 중":
      return "text-green-600 bg-green-50";
    case "expired":
    case "계약 만료":
      return "text-red-600 bg-red-50";
    case "pending":
    case "계약 대기":
      return "text-yellow-600 bg-yellow-50";
    case "terminated":
    case "계약 해지":
      return "text-gray-600 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

/**
 * 활성 상태에 따른 색상 클래스 반환
 */
export const getActiveStatusColor = (isActive: boolean): string => {
  return isActive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
};

/**
 * 회원제 타입에 따른 아이콘 반환
 */
export const getMembershipTypeIcon = (type: string): string => {
  switch (type.toLowerCase()) {
    case "membership":
    case "회원제":
      return "👥";
    case "public":
    case "퍼블릭":
      return "🌐";
    default:
      return "🏌️";
  }
};

/**
 * 골프장 정보 요약 포맷팅
 */
export const formatGolfCourseSummary = (data: {
  name: string;
  region: string;
  totalCaddies: number;
  fieldCount: number;
}): string => {
  return `${data.name} (${data.region}) - 캐디 ${formatNumberWithUnit(
    data.totalCaddies
  )}명, 필드 ${data.fieldCount}개`;
};

/**
 * 운영 현황 수치 포맷팅
 */
export const formatOperationStat = (
  value: number,
  unit: string = ""
): string => {
  const formatted = formatNumberWithUnit(value);
  return unit ? `${formatted}${unit}` : formatted;
};

/**
 * 주소를 짧게 요약
 */
export const summarizeAddress = (
  address: string,
  maxLength: number = 30
): string => {
  if (!address) return "";
  if (address.length <= maxLength) return address;

  return `${address.slice(0, maxLength - 3)}...`;
};

/**
 * 파일 크기 포맷팅
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * URL 슬러그 생성 (골프장명 → URL 친화적 문자열)
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // 특수문자 제거
    .replace(/\s+/g, "-") // 공백을 하이픈으로
    .replace(/-+/g, "-"); // 연속 하이픈 제거
};
