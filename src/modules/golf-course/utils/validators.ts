// 골프장 관련 데이터 유효성 검사 함수들

import type { EditableGolfCourse, GolfCourseFormErrors } from "../types";

/**
 * 이메일 형식 검증
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 전화번호 형식 검증 (한국 형식)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // 010-1234-5678, 02-123-4567, 031-123-4567 등의 형식
  const phoneRegex = /^(\d{2,3})-?(\d{3,4})-?(\d{4})$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * 사업자등록번호 형식 검증
 */
export const isValidBusinessNumber = (number: string): boolean => {
  const businessRegex = /^\d{3}-?\d{2}-?\d{5}$/;
  return businessRegex.test(number.replace(/\s/g, ""));
};

/**
 * 골프장명 유효성 검사
 */
export const validateGolfCourseName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return "골프장명을 입력해주세요.";
  }
  if (name.trim().length < 2) {
    return "골프장명은 2글자 이상 입력해주세요.";
  }
  if (name.trim().length > 50) {
    return "골프장명은 50글자 이하로 입력해주세요.";
  }
  return null;
};

/**
 * 지역 유효성 검사
 */
export const validateRegion = (region: string): string | null => {
  if (!region || region.trim().length === 0) {
    return "지역을 입력해주세요.";
  }
  if (region.trim().length < 2) {
    return "지역은 2글자 이상 입력해주세요.";
  }
  return null;
};

/**
 * 주소 유효성 검사
 */
export const validateAddress = (address: string): string | null => {
  if (!address || address.trim().length === 0) {
    return "주소를 입력해주세요.";
  }
  if (address.trim().length < 5) {
    return "주소는 5글자 이상 입력해주세요.";
  }
  return null;
};

/**
 * 전화번호 유효성 검사
 */
export const validatePhone = (phone: string): string | null => {
  if (!phone || phone.trim().length === 0) {
    return null; // 선택적 필드
  }
  if (!isValidPhoneNumber(phone)) {
    return "올바른 전화번호 형식이 아닙니다. (예: 02-1234-5678)";
  }
  return null;
};

/**
 * 이메일 유효성 검사
 */
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim().length === 0) {
    return null; // 선택적 필드
  }
  if (!isValidEmail(email)) {
    return "올바른 이메일 형식이 아닙니다.";
  }
  return null;
};

/**
 * 연락처 정보 유효성 검사
 */
export const validateContact = (contact: string): string | null => {
  if (!contact || contact.trim().length === 0) {
    return null; // 선택적 필드
  }
  if (!isValidPhoneNumber(contact)) {
    return "올바른 연락처 형식이 아닙니다. (예: 010-1234-5678)";
  }
  return null;
};

/**
 * 이름 유효성 검사
 */
export const validateName = (
  name: string,
  fieldName: string
): string | null => {
  if (!name || name.trim().length === 0) {
    return null; // 선택적 필드
  }
  if (name.trim().length < 2) {
    return `${fieldName}은(는) 2글자 이상 입력해주세요.`;
  }
  if (name.trim().length > 20) {
    return `${fieldName}은(는) 20글자 이하로 입력해주세요.`;
  }
  return null;
};

/**
 * 골프장 폼 전체 유효성 검사
 */
export const validateGolfCourseForm = (
  formData: EditableGolfCourse
): GolfCourseFormErrors => {
  const errors: GolfCourseFormErrors = {};

  // 기본 정보 검증
  const nameError = validateGolfCourseName(formData.name);
  if (nameError) errors.name = nameError;

  const regionError = validateRegion(formData.region);
  if (regionError) errors.region = regionError;

  const addressError = validateAddress(formData.address);
  if (addressError) errors.address = addressError;

  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;

  // 대표자 정보 검증
  const representativeErrors: GolfCourseFormErrors["representative"] = {};
  const repNameError = validateName(formData.representative.name, "대표자명");
  if (repNameError) representativeErrors.name = repNameError;

  const repContactError = validateContact(formData.representative.contact);
  if (repContactError) representativeErrors.contact = repContactError;

  const repEmailError = validateEmail(formData.representative.email);
  if (repEmailError) representativeErrors.email = repEmailError;

  if (Object.keys(representativeErrors).length > 0) {
    errors.representative = representativeErrors;
  }

  // 매니저 정보 검증
  const managerErrors: GolfCourseFormErrors["manager"] = {};
  const managerNameError = validateName(formData.manager.name, "매니저명");
  if (managerNameError) managerErrors.name = managerNameError;

  const managerContactError = validateContact(formData.manager.contact);
  if (managerContactError) managerErrors.contact = managerContactError;

  const managerEmailError = validateEmail(formData.manager.email);
  if (managerEmailError) managerErrors.email = managerEmailError;

  if (Object.keys(managerErrors).length > 0) {
    errors.manager = managerErrors;
  }

  return errors;
};

/**
 * 폼 유효성 검사 결과 확인
 */
export const hasValidationErrors = (errors: GolfCourseFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * 특정 필드의 에러 메시지 가져오기
 */
export const getFieldError = (
  errors: GolfCourseFormErrors,
  fieldPath: string
): string | undefined => {
  const keys = fieldPath.split(".");
  let current: unknown = errors;

  for (const key of keys) {
    if (typeof current === "object" && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
};
