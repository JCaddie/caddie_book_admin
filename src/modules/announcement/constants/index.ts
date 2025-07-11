/**
 * 공지사항 모듈 상수 통합 export
 */

// 폼 관련 상수
export * from "./form";

// UI 관련 상수
export * from "./ui";

// API 관련 상수
export * from "./api";

// 기본 상수들
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
