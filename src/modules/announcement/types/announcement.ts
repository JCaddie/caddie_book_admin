/**
 * 공지사항 모듈 타입 통합 export
 *
 * 모든 타입들이 분리된 파일들로 이동되었으며,
 * 이 파일은 하위 호환성을 위해 모든 타입을 re-export합니다.
 */

// 기본 타입들
export type {
  BaseAnnouncement,
  Announcement,
  AnnouncementFile,
  AnnouncementStatus,
  AnnouncementCategory,
  AnnouncementPriority,
  AnnouncementType,
} from "./base";

// API 관련 타입들
export type {
  AnnouncementApiData,
  AnnouncementDetailApiData,
  AnnouncementListApiResponse,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  BulkDeleteRequest,
  AnnouncementFilters,
  AnnouncementSort,
} from "./api";

// 폼 및 UI 관련 타입들
export type {
  AnnouncementFormMode,
  AnnouncementFormData,
  AnnouncementFormErrors,
  CreateAnnouncementData,
  UpdateAnnouncementData,
  AnnouncementWithNo,
  AnnouncementSelection,
  AnnouncementPagination,
  AnnouncementLoadingState,
} from "./form";

/**
 * 레거시 호환성을 위한 타입들
 * @deprecated 새 코드에서는 분리된 타입 파일을 직접 import해서 사용하세요
 */

// 파일 업로드 상태 타입 (향후 피처 플래그로 제어)
export type FileUploadStatus = "pending" | "uploading" | "success" | "error";

// 업로드된 파일 타입 (향후 피처 플래그로 제어)
export interface UploadedFile {
  file: File;
  id: string;
  status: FileUploadStatus;
  progress?: number;
  error?: string;
}

// 기존 파일 타입 (향후 피처 플래그로 제어)
export interface ExistingFile {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  url: string;
  uploadedAt: string;
}
