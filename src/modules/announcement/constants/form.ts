/**
 * 공지사항 폼 관련 상수
 */

// 폼 입력 제한 규칙
export const ANNOUNCEMENT_FORM_RULES = {
  TITLE_MAX_LENGTH: 200,
  TITLE_MIN_LENGTH: 1,
  CONTENT_MAX_LENGTH: 5000,
  CONTENT_MIN_LENGTH: 1,
  MAX_FILES: 5,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// 폼 에러 메시지
export const ANNOUNCEMENT_FORM_ERRORS = {
  TITLE_REQUIRED: "제목을 입력해주세요.",
  TITLE_TOO_SHORT: "제목은 1자 이상 입력해주세요.",
  TITLE_TOO_LONG: `제목은 ${ANNOUNCEMENT_FORM_RULES.TITLE_MAX_LENGTH}자 이내로 입력해주세요.`,
  CONTENT_REQUIRED: "내용을 입력해주세요.",
  CONTENT_TOO_SHORT: "내용은 1자 이상 입력해주세요.",
  CONTENT_TOO_LONG: `내용은 ${ANNOUNCEMENT_FORM_RULES.CONTENT_MAX_LENGTH}자 이내로 입력해주세요.`,
  FILES_TOO_MANY: `파일은 최대 ${ANNOUNCEMENT_FORM_RULES.MAX_FILES}개까지 업로드할 수 있습니다.`,
  FILE_TOO_LARGE: `파일 크기는 ${
    ANNOUNCEMENT_FORM_RULES.MAX_FILE_SIZE / (1024 * 1024)
  }MB 이하여야 합니다.`,
  FILE_INVALID_TYPE: "허용되지 않는 파일 형식입니다.",
  CATEGORY_REQUIRED: "카테고리를 선택해주세요.",
  PRIORITY_REQUIRED: "우선순위를 선택해주세요.",
  VALID_FROM_INVALID: "유효 시작일이 올바르지 않습니다.",
  VALID_UNTIL_INVALID: "유효 종료일이 올바르지 않습니다.",
  VALID_DATE_RANGE_INVALID: "유효 종료일은 시작일보다 늦어야 합니다.",
} as const;

// 파일 업로드 설정
export const FILE_UPLOAD_CONFIG = {
  ACCEPT_TYPES:
    ".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.rar,.hwp,.txt,.xlsx,.xls,.ppt,.pptx",
  MAX_FILES: ANNOUNCEMENT_FORM_RULES.MAX_FILES,
  MAX_SIZE: ANNOUNCEMENT_FORM_RULES.MAX_FILE_SIZE,
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks for upload
  TIMEOUT: 30000, // 30 seconds
} as const;

// 폼 플레이스홀더 텍스트
export const FORM_PLACEHOLDERS = {
  TITLE: "공지사항 제목을 입력해주세요",
  CONTENT: "공지사항 내용을 입력해주세요",
  VALID_FROM: "유효 시작일을 선택해주세요",
  VALID_UNTIL: "유효 종료일을 선택해주세요",
} as const;

// 폼 라벨 텍스트
export const FORM_LABELS = {
  TITLE: "제목",
  CONTENT: "내용",
  FILES: "첨부파일",
  CATEGORY: "카테고리",
  PRIORITY: "우선순위",
  IS_PUBLISHED: "게시 상태",
  IS_PINNED: "상단 고정",
  VALID_FROM: "유효 시작일",
  VALID_UNTIL: "유효 종료일",
} as const;

// 폼 버튼 텍스트
export const FORM_BUTTONS = {
  SAVE: "저장",
  CANCEL: "취소",
  DELETE: "삭제",
  EDIT: "수정",
  CREATE: "등록",
  PUBLISH: "게시",
  UNPUBLISH: "게시 중단",
  PREVIEW: "미리보기",
} as const;
