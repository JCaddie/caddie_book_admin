// ================================
// 캐디 데이터 검증 유틸리티
// ================================

import type { EmploymentType, Gender } from "../types";

// 이메일 형식 검증
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 전화번호 형식 검증 (한국 전화번호)
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
  return phoneRegex.test(phone);
};

// 캐디 이름 검증
export const validateCaddieName = (name: string): boolean => {
  // 2자 이상 10자 이하, 한글만 허용
  const nameRegex = /^[가-힣]{2,10}$/;
  return nameRegex.test(name.trim());
};

// 근무 점수 검증
export const validateWorkScore = (score: number): boolean => {
  return score >= 0 && score <= 100 && Number.isInteger(score);
};

// 고용 형태 검증
export const validateEmploymentType = (
  type: string
): type is EmploymentType => {
  const validTypes: EmploymentType[] = [
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "TEMPORARY",
  ];
  return validTypes.includes(type as EmploymentType);
};

// 성별 검증
export const validateGender = (gender: string): gender is Gender => {
  return gender === "M" || gender === "F";
};

// 주소 검증
export const validateAddress = (address: string): boolean => {
  // 최소 5자 이상
  return address.trim().length >= 5;
};

// 캐디 ID 검증 (UUID 형식)
export const validateCaddieId = (id: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// 그룹 ID 검증
export const validateGroupId = (groupId: string | number): boolean => {
  if (typeof groupId === "string") {
    return groupId.trim().length > 0;
  }
  return Number.isInteger(groupId) && groupId > 0;
};

// 캐디 기본 정보 종합 검증
export const validateCaddieBasicInfo = (data: {
  name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
}): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  if (!validateCaddieName(data.name)) {
    errors.name = "이름은 2-10자의 한글만 입력 가능합니다.";
  }

  if (!validateEmail(data.email)) {
    errors.email = "올바른 이메일 형식이 아닙니다.";
  }

  if (!validatePhoneNumber(data.phone)) {
    errors.phone = "전화번호는 010-0000-0000 형식으로 입력해주세요.";
  }

  if (!validateGender(data.gender)) {
    errors.gender = "성별을 선택해주세요.";
  }

  if (!validateAddress(data.address)) {
    errors.address = "주소는 최소 5자 이상 입력해주세요.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 캐디 업무 정보 검증
export const validateCaddieWorkInfo = (data: {
  workScore: number;
  employmentType: string;
  primaryGroup?: string | number;
}): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  if (!validateWorkScore(data.workScore)) {
    errors.workScore = "근무점수는 0-100 사이의 정수여야 합니다.";
  }

  if (!validateEmploymentType(data.employmentType)) {
    errors.employmentType = "올바른 고용형태를 선택해주세요.";
  }

  if (data.primaryGroup && !validateGroupId(data.primaryGroup)) {
    errors.primaryGroup = "올바른 그룹을 선택해주세요.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 일괄 작업 검증
export const validateBulkOperation = (
  selectedIds: string[],
  minCount: number = 1,
  maxCount: number = 50
): {
  isValid: boolean;
  error?: string;
} => {
  if (selectedIds.length < minCount) {
    return {
      isValid: false,
      error: `최소 ${minCount}개 이상 선택해야 합니다.`,
    };
  }

  if (selectedIds.length > maxCount) {
    return {
      isValid: false,
      error: `최대 ${maxCount}개까지만 선택할 수 있습니다.`,
    };
  }

  // 중복 ID 검증
  const uniqueIds = new Set(selectedIds);
  if (uniqueIds.size !== selectedIds.length) {
    return {
      isValid: false,
      error: "중복된 항목이 선택되었습니다.",
    };
  }

  return { isValid: true };
};
