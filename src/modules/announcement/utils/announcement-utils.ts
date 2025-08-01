/**
 * 공지사항 유틸리티 함수들 (리팩토링된 버전)
 *
 * @deprecated 이 파일은 리팩토링을 위해 분리되었습니다.
 * 새로운 파일들을 사용하세요:
 * - announcement-filters.ts: 필터링 및 정렬
 * - table-helpers.ts: 테이블 관련 유틸리티
 * - announcement-helpers.ts: 통계 및 기타 헬퍼
 */

// 기존 함수들을 새로운 파일들에서 재export
export {
  filterAnnouncements,
  sortAnnouncements,
  searchAnnouncements,
} from "./announcement-filters";

export {
  addNumberToAnnouncements,
  createEmptyRows,
  isEmptyRow,
  isValidAnnouncement,
} from "./table-helpers";

export {
  calculateAnnouncementStats,
  isValidAnnouncementId,
  createAnnouncementSlug,
} from "./announcement-helpers";
