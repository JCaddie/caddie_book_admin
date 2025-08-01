/**
 * 공지사항 액션 관리 훅 (리팩토링된 버전)
 *
 * @deprecated 이 파일은 리팩토링을 위해 분리되었습니다.
 * 새로운 훅들을 사용하세요:
 * - use-announcement-create.ts: 생성 액션
 * - use-announcement-update.ts: 수정 액션
 * - use-announcement-delete.ts: 삭제 액션
 * - use-announcement-publish.ts: 게시/게시중단 액션
 */

import { useAnnouncementCreate } from "./use-announcement-create";
import { useAnnouncementUpdate } from "./use-announcement-update";
import { useAnnouncementDelete } from "./use-announcement-delete";
import { useAnnouncementPublish } from "./use-announcement-publish";

/**
 * 통합된 공지사항 액션 관리 훅
 * 모든 CRUD 액션을 하나의 훅으로 제공합니다.
 */
export const useAnnouncementActions = () => {
  const createHook = useAnnouncementCreate();
  const updateHook = useAnnouncementUpdate();
  const deleteHook = useAnnouncementDelete();
  const publishHook = useAnnouncementPublish();

  // 에러 상태 통합
  const error =
    createHook.error ||
    updateHook.error ||
    deleteHook.error ||
    publishHook.error;

  // 로딩 상태 통합
  const isLoading =
    createHook.isLoading ||
    updateHook.isLoading ||
    deleteHook.isLoading ||
    publishHook.isLoading;

  // 에러 초기화 통합
  const clearError = () => {
    createHook.clearError();
    updateHook.clearError();
    deleteHook.clearError();
    publishHook.clearError();
  };

  return {
    // 액션 함수들
    createAnnouncement: createHook.createAnnouncement,
    updateAnnouncement: updateHook.updateAnnouncement,
    deleteAnnouncement: deleteHook.deleteAnnouncement,
    deleteSelectedAnnouncements: deleteHook.deleteSelectedAnnouncements,
    publishAnnouncement: publishHook.publishAnnouncement,
    unpublishAnnouncement: publishHook.unpublishAnnouncement,

    // 상태
    error,
    clearError,
    isLoading,

    // 개별 로딩 상태
    isCreating: createHook.isLoading,
    isUpdating: updateHook.isLoading,
    isDeleting: deleteHook.isLoading,
    isPublishing: publishHook.isLoading,
  };
};
