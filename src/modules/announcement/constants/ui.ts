/**
 * 공지사항 UI 관련 상수
 */

// 페이지네이션 설정
export const PAGINATION_CONFIG = {
  PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  MAX_PAGE_SIZE: 100,
} as const;

// 테이블 컬럼 너비
export const ANNOUNCEMENT_COLUMN_WIDTHS = {
  no: 80,
  title: 400,
  category: 120,
  priority: 100,
  views: 100,
  isPublished: 120,
  isPinned: 80,
  createdAt: 120,
  updatedAt: 120,
  author: 100,
} as const;

// 검색 설정
export const SEARCH_CONFIG = {
  PLACEHOLDER: "공지사항 제목을 검색해주세요",
  MIN_LENGTH: 1,
  MAX_LENGTH: 100,
  DEBOUNCE_DELAY: 300,
} as const;

// 상태 표시 텍스트
export const STATUS_TEXT = {
  PUBLISHED: "게시됨",
  UNPUBLISHED: "게시 안함",
  DRAFT: "임시저장",
  ARCHIVED: "보관됨",
  PINNED: "고정됨",
  UNPINNED: "고정 해제",
} as const;

// 카테고리 표시 텍스트
export const CATEGORY_TEXT = {
  general: "일반",
  system: "시스템",
  maintenance: "점검",
  event: "이벤트",
  notice: "공지",
  urgent: "긴급",
} as const;

// 우선순위 표시 텍스트
export const PRIORITY_TEXT = {
  low: "낮음",
  normal: "보통",
  high: "높음",
  urgent: "긴급",
} as const;

// 우선순위 색상
export const PRIORITY_COLORS = {
  low: "text-gray-500",
  normal: "text-blue-600",
  high: "text-orange-600",
  urgent: "text-red-600",
} as const;

// 카테고리 색상
export const CATEGORY_COLORS = {
  general: "bg-gray-100 text-gray-800",
  system: "bg-blue-100 text-blue-800",
  maintenance: "bg-yellow-100 text-yellow-800",
  event: "bg-green-100 text-green-800",
  notice: "bg-purple-100 text-purple-800",
  urgent: "bg-red-100 text-red-800",
} as const;

// 빈 상태 메시지
export const EMPTY_STATE = {
  NO_ANNOUNCEMENTS: "공지사항이 없습니다",
  NO_SEARCH_RESULTS: "검색 결과가 없습니다",
  NO_FILTERED_RESULTS: "필터 조건에 맞는 공지사항이 없습니다",
  LOADING: "공지사항을 불러오는 중...",
} as const;

// 확인 메시지
export const CONFIRMATION_MESSAGES = {
  DELETE_SINGLE: "이 공지사항을 삭제하시겠습니까?",
  DELETE_MULTIPLE: "선택한 공지사항을 삭제하시겠습니까?",
  PUBLISH: "공지사항을 게시하시겠습니까?",
  UNPUBLISH: "공지사항을 게시 중단하시겠습니까?",
  PIN: "공지사항을 상단에 고정하시겠습니까?",
  UNPIN: "공지사항 고정을 해제하시겠습니까?",
  DISCARD_CHANGES: "변경사항을 취소하시겠습니까?",
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  CREATED: "공지사항이 생성되었습니다.",
  UPDATED: "공지사항이 수정되었습니다.",
  DELETED: "공지사항이 삭제되었습니다.",
  PUBLISHED: "공지사항이 게시되었습니다.",
  UNPUBLISHED: "공지사항 게시가 중단되었습니다.",
  PINNED: "공지사항이 상단에 고정되었습니다.",
  UNPINNED: "공지사항 고정이 해제되었습니다.",
  BULK_DELETED: "선택한 공지사항이 삭제되었습니다.",
} as const;

// 로딩 텍스트
export const LOADING_TEXT = {
  FETCHING: "공지사항을 불러오는 중...",
  CREATING: "공지사항을 생성하는 중...",
  UPDATING: "공지사항을 수정하는 중...",
  DELETING: "공지사항을 삭제하는 중...",
  PUBLISHING: "공지사항을 게시하는 중...",
  UNPUBLISHING: "공지사항 게시를 중단하는 중...",
  UPLOADING: "파일을 업로드하는 중...",
} as const;

// 액션 버튼 텍스트
export const ACTION_BUTTONS = {
  CREATE: "생성",
  EDIT: "수정",
  DELETE: "삭제",
  PUBLISH: "게시",
  UNPUBLISH: "게시 중단",
  PIN: "고정",
  UNPIN: "고정 해제",
  PREVIEW: "미리보기",
  DUPLICATE: "복제",
  EXPORT: "내보내기",
  IMPORT: "가져오기",
  REFRESH: "새로고침",
} as const;
