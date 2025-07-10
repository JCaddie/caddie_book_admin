/**
 * 공지사항 모듈 상수 통합 export
 */

// 폼 관련 상수
export * from "./form";

// UI 관련 상수
export * from "./ui";

// API 관련 상수
export * from "./api";

// 레거시 호환을 위한 통합 상수 (deprecated)
export const ANNOUNCEMENT_CONSTANTS = {
  PAGE_SIZE: 20,
  MAX_TITLE_LENGTH: 200,
  MAX_CONTENT_LENGTH: 5000,
  DEFAULT_SEARCH_PLACEHOLDER: "공지사항 제목을 검색해주세요",
  EMPTY_STATE_MESSAGE: "공지사항이 없습니다",
  LOADING_MESSAGE: "공지사항을 불러오는 중...",
  DELETE_CONFIRMATION: "선택한 공지사항을 삭제하시겠습니까?",
  BULK_DELETE_CONFIRMATION: "개의 공지사항을 삭제하시겠습니까?",
  PUBLISH_CONFIRMATION: "공지사항을 게시하시겠습니까?",
  UNPUBLISH_CONFIRMATION: "공지사항을 게시 중단하시겠습니까?",
} as const;

// 레거시 호환을 위한 컬럼 너비 (deprecated)
export const ANNOUNCEMENT_COLUMN_WIDTHS = {
  no: 80,
  title: 300,
  views: 100,
  createdAt: 170,
  updatedAt: 170,
} as const;

// 레거시 호환을 위한 폼 규칙 (deprecated)
export const ANNOUNCEMENT_FORM_RULES = {
  TITLE_MAX_LENGTH: 200,
  CONTENT_MAX_LENGTH: 5000,
  MAX_FILES: 5,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// 레거시 호환을 위한 폼 에러 (deprecated)
export const ANNOUNCEMENT_FORM_ERRORS = {
  TITLE_REQUIRED: "제목을 입력해주세요.",
  TITLE_TOO_LONG: "제목은 200자 이내로 입력해주세요.",
  CONTENT_REQUIRED: "내용을 입력해주세요.",
  CONTENT_TOO_LONG: "내용은 5000자 이내로 입력해주세요.",
  FILES_TOO_MANY: "파일은 최대 5개까지 업로드할 수 있습니다.",
  FILE_TOO_LARGE: "파일 크기는 10MB 이하여야 합니다.",
} as const;

// 레거시 호환을 위한 파일 업로드 설정 (deprecated)
export const FILE_UPLOAD_CONFIG = {
  ACCEPT_TYPES:
    ".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.rar,.hwp,.txt,.xlsx,.xls,.ppt,.pptx",
  MAX_FILES: 5,
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// 레거시 호환을 위한 CRUD 에러 (deprecated)
export const ANNOUNCEMENT_CRUD_ERRORS = {
  FETCH_DETAIL_FAILED: "공지사항을 불러오는 중 오류가 발생했습니다.",
  CREATE_FAILED: "공지사항 생성 중 오류가 발생했습니다.",
  UPDATE_FAILED: "공지사항 수정 중 오류가 발생했습니다.",
  DELETE_FAILED: "공지사항 삭제 중 오류가 발생했습니다.",
} as const;

// 레거시 호환을 위한 메시지 (deprecated)
export const ANNOUNCEMENT_MESSAGES = {
  SUCCESS: {
    CREATED: "공지사항이 성공적으로 생성되었습니다.",
    UPDATED: "공지사항이 성공적으로 수정되었습니다.",
    DELETED: "공지사항이 성공적으로 삭제되었습니다.",
    PUBLISHED: "공지사항이 게시되었습니다.",
    UNPUBLISHED: "공지사항 게시가 중단되었습니다.",
  },
  ERROR: {
    LOAD_FAILED: "공지사항을 불러오는데 실패했습니다.",
    CREATE_FAILED: "공지사항 생성에 실패했습니다.",
    UPDATE_FAILED: "공지사항 수정에 실패했습니다.",
    DELETE_FAILED: "공지사항 삭제에 실패했습니다.",
    PUBLISH_FAILED: "공지사항 게시에 실패했습니다.",
    UNPUBLISH_FAILED: "공지사항 게시 중단에 실패했습니다.",
  },
} as const;
