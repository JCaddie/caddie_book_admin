import { AnnouncementFormData, AnnouncementFormErrors } from "../types";
import {
  ANNOUNCEMENT_FORM_ERRORS,
  ANNOUNCEMENT_FORM_RULES,
} from "../constants";

/**
 * 공지사항 폼 데이터 유효성 검사
 * @param formData - 검사할 폼 데이터
 * @returns 검사 결과 객체 { isValid, errors }
 */
export const validateAnnouncementForm = (
  formData: AnnouncementFormData
): { isValid: boolean; errors: AnnouncementFormErrors } => {
  const errors: AnnouncementFormErrors = {};

  // 제목 검사
  if (!formData.title?.trim()) {
    errors.title = ANNOUNCEMENT_FORM_ERRORS.TITLE_REQUIRED;
  } else if (formData.title.length > ANNOUNCEMENT_FORM_RULES.TITLE_MAX_LENGTH) {
    errors.title = ANNOUNCEMENT_FORM_ERRORS.TITLE_TOO_LONG;
  }

  // 내용 검사
  if (!formData.content?.trim()) {
    errors.content = ANNOUNCEMENT_FORM_ERRORS.CONTENT_REQUIRED;
  } else if (
    formData.content.length > ANNOUNCEMENT_FORM_RULES.CONTENT_MAX_LENGTH
  ) {
    errors.content = ANNOUNCEMENT_FORM_ERRORS.CONTENT_TOO_LONG;
  }

  // 파일 개수 검사
  if (
    formData.files &&
    formData.files.length > ANNOUNCEMENT_FORM_RULES.MAX_FILES
  ) {
    errors.files = ANNOUNCEMENT_FORM_ERRORS.FILES_TOO_MANY;
  }

  // 파일 크기 검사
  if (formData.files) {
    const oversizedFile = formData.files.find(
      (file) => file.size > ANNOUNCEMENT_FORM_RULES.MAX_FILE_SIZE
    );
    if (oversizedFile) {
      errors.files = ANNOUNCEMENT_FORM_ERRORS.FILE_TOO_LARGE;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * 개별 파일 유효성 검사
 * @param file - 검사할 파일
 * @returns 에러 메시지 (유효한 경우 null)
 */
export const validateFile = (file: File): string | null => {
  if (file.size > ANNOUNCEMENT_FORM_RULES.MAX_FILE_SIZE) {
    return ANNOUNCEMENT_FORM_ERRORS.FILE_TOO_LARGE;
  }
  return null;
};

/**
 * 제목 실시간 유효성 검사
 * @param title - 검사할 제목
 * @returns 에러 메시지 (유효한 경우 null)
 */
export const validateTitle = (title: string): string | null => {
  if (!title?.trim()) {
    return ANNOUNCEMENT_FORM_ERRORS.TITLE_REQUIRED;
  }
  if (title.length > ANNOUNCEMENT_FORM_RULES.TITLE_MAX_LENGTH) {
    return ANNOUNCEMENT_FORM_ERRORS.TITLE_TOO_LONG;
  }
  return null;
};

/**
 * 내용 실시간 유효성 검사
 * @param content - 검사할 내용
 * @returns 에러 메시지 (유효한 경우 null)
 */
export const validateContent = (content: string): string | null => {
  if (!content?.trim()) {
    return ANNOUNCEMENT_FORM_ERRORS.CONTENT_REQUIRED;
  }
  if (content.length > ANNOUNCEMENT_FORM_RULES.CONTENT_MAX_LENGTH) {
    return ANNOUNCEMENT_FORM_ERRORS.CONTENT_TOO_LONG;
  }
  return null;
};
