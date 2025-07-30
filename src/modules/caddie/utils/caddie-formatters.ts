// ================================
// 캐디 관련 공통 포맷터 함수들
// ================================

import type { Caddie } from "../types";

/**
 * 성별 표시 포맷터
 */
export const formatGender = (gender: string): string => {
  const genderMap: Record<string, string> = {
    M: "남",
    F: "여",
  };
  return genderMap[gender] || gender;
};

/**
 * 고용형태 표시 포맷터
 */
export const formatEmploymentType = (employmentType: string): string => {
  const typeMap: Record<string, string> = {
    FULL_TIME: "정규직",
    PART_TIME: "시간제",
    CONTRACT: "계약직",
    TEMPORARY: "임시직",
  };
  return typeMap[employmentType] || employmentType;
};

/**
 * 등록 상태 표시 포맷터
 */
export const formatRegistrationStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "승인 대기",
    APPROVED: "승인됨",
    REJECTED: "거절됨",
  };
  return statusMap[status] || status;
};

/**
 * 팀장 여부 표시 포맷터
 */
export const formatTeamLeader = (isTeamLeader: boolean): string => {
  return isTeamLeader ? "팀장" : "일반";
};

/**
 * 그룹 표시 포맷터
 */
export const formatGroup = (
  groupId: number | null,
  groupOrder?: number
): string => {
  if (!groupId) return "-";
  const baseText = `그룹 ${groupId}`;
  return groupOrder ? `${baseText} (순서: ${groupOrder})` : baseText;
};

/**
 * 특수반 표시 포맷터
 */
export const formatSpecialGroup = (
  groupId: number | null,
  groupOrder?: number
): string => {
  if (!groupId) return "-";
  const baseText = `특수반 ${groupId}`;
  return groupOrder ? `${baseText} (순서: ${groupOrder})` : baseText;
};

/**
 * 전화번호 포맷터
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "-";

  // 숫자만 추출
  const cleaned = phone.replace(/\D/g, "");

  // 한국 전화번호 포맷 (010-1234-5678)
  if (cleaned.length === 11 && cleaned.startsWith("010")) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }

  // 일반 전화번호 포맷 (02-1234-5678)
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};

/**
 * 날짜 포맷터 (한국어)
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\./g, ".")
      .replace(/\s/g, "");
  } catch {
    return dateString;
  }
};

/**
 * 근무점수 포맷터
 */
export const formatWorkScore = (score: number): string => {
  return score.toString();
};

/**
 * 근무 상태 포맷터
 */
export const formatDutyStatus = (isOnDuty: boolean): string => {
  return isOnDuty ? "근무중" : "휴무";
};

/**
 * 캐디 요약 정보 포맷터
 */
export const formatCaddieSummary = (caddie: Caddie): string => {
  const parts = [
    caddie.user_name,
    formatGender(caddie.gender),
    formatEmploymentType(caddie.employment_type),
    caddie.golf_course_name,
  ];

  return parts.filter(Boolean).join(" · ");
};

/**
 * 등록 상태별 CSS 클래스 반환
 */
export const getRegistrationStatusClass = (status: string): string => {
  const classMap: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  return classMap[status] || "bg-gray-100 text-gray-800";
};
