// ================================
// 캐디 데이터 포맷팅 유틸리티
// ================================

import type { EmploymentType, Gender, RegistrationStatus } from "../types";

// 전화번호 포맷팅 (010-0000-0000)
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  return phone; // 잘못된 형식은 그대로 반환
};

// 이메일 마스킹 (개인정보 보호)
export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) return email;

  if (localPart.length <= 2) {
    return email; // 너무 짧으면 마스킹하지 않음
  }

  const masked =
    localPart.charAt(0) +
    "*".repeat(localPart.length - 2) +
    localPart.charAt(localPart.length - 1);
  return `${masked}@${domain}`;
};

// 성별 한글 변환
export const formatGender = (gender: Gender): string => {
  return gender === "M" ? "남성" : "여성";
};

// 고용형태 한글 변환
export const formatEmploymentType = (type: EmploymentType): string => {
  const typeMap: Record<EmploymentType, string> = {
    FULL_TIME: "정규직",
    PART_TIME: "시간제",
    CONTRACT: "계약직",
    TEMPORARY: "임시직",
  };

  return typeMap[type] || type;
};

// 등록 상태 한글 변환
export const formatRegistrationStatus = (
  status: RegistrationStatus
): string => {
  const statusMap: Record<RegistrationStatus, string> = {
    PENDING: "승인 대기",
    APPROVED: "승인됨",
    REJECTED: "거부됨",
  };

  return statusMap[status] || status;
};

// 팀장 여부 포맷팅
export const formatTeamLeader = (isTeamLeader: boolean): string => {
  return isTeamLeader ? "팀장" : "일반";
};

// 근무 상태 포맷팅
export const formatDutyStatus = (isOnDuty: boolean): string => {
  return isOnDuty ? "근무 중" : "휴무";
};

// 근무 점수 포맷팅 (색상 클래스 포함)
export const formatWorkScore = (
  score: number
): {
  text: string;
  colorClass: string;
} => {
  let colorClass = "";

  if (score >= 90) {
    colorClass = "text-green-600 font-semibold";
  } else if (score >= 70) {
    colorClass = "text-blue-600";
  } else if (score >= 50) {
    colorClass = "text-yellow-600";
  } else {
    colorClass = "text-red-600 font-semibold";
  }

  return {
    text: `${score}점`,
    colorClass,
  };
};

// 날짜 포맷팅 (한국 형식)
export const formatDate = (
  dateString: string,
  includeTime: boolean = false
): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "잘못된 날짜";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.hour12 = false;
  }

  return date.toLocaleDateString("ko-KR", options);
};

// 상대 시간 포맷팅 (예: "3시간 전", "2일 전")
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
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
    return formatDate(dateString);
  }
};

// 주소 줄임 표시
export const formatAddress = (
  address: string,
  maxLength: number = 30
): string => {
  if (address.length <= maxLength) {
    return address;
  }

  return address.substring(0, maxLength - 3) + "...";
};

// 그룹 정보 포맷팅
export const formatGroupInfo = (
  primaryGroup: number | null,
  primaryGroupOrder: number,
  specialGroup: number | null
): string => {
  const parts: string[] = [];

  if (primaryGroup) {
    parts.push(`${primaryGroup}조`);
    if (primaryGroupOrder > 0) {
      parts.push(`(${primaryGroupOrder}번째)`);
    }
  }

  if (specialGroup) {
    parts.push(`특수반 ${specialGroup}`);
  }

  return parts.length > 0 ? parts.join(" ") : "미배정";
};

// 캐디 카드 요약 정보 포맷팅
export const formatCaddieSummary = (caddie: {
  user_name: string;
  golf_course_name: string;
  employment_type: EmploymentType;
  work_score: number;
  is_on_duty: boolean;
}): string => {
  const parts = [
    caddie.user_name,
    caddie.golf_course_name,
    formatEmploymentType(caddie.employment_type),
    `${caddie.work_score}점`,
    formatDutyStatus(caddie.is_on_duty),
  ];

  return parts.join(" • ");
};

// 남은 휴무일 포맷팅
export const formatRemainingDaysOff = (
  days: number
): {
  text: string;
  colorClass: string;
} => {
  let colorClass = "";
  let text = "";

  if (days <= 0) {
    text = "휴무 없음";
    colorClass = "text-red-600";
  } else if (days <= 3) {
    text = `${days}일 남음`;
    colorClass = "text-yellow-600";
  } else {
    text = `${days}일 남음`;
    colorClass = "text-green-600";
  }

  return { text, colorClass };
};

// 파일 크기 포맷팅
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
