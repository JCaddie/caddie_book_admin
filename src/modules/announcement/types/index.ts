/**
 * 공지사항 모듈 타입 메인 export
 *
 * 분리된 타입 파일들을 모두 re-export하여
 * 하위 호환성을 유지하면서 새로운 구조를 지원합니다.
 */

// 새로운 분리된 타입들
export type * from "./base";
export type * from "./api";
export type * from "./form";

// 기존 통합 파일 (하위 호환성)
export type * from "./announcement";
