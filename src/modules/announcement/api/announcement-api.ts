import { apiClient } from "@/shared/lib/api-client";
import type {
  Announcement,
  AnnouncementDetailApiData,
  AnnouncementFilters,
  AnnouncementListApiResponse,
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from "../types";
import { ANNOUNCEMENT_CONSTANTS } from "../constants";
import { createApiParams } from "../utils/api-params-builder";
import { transformAnnouncementDetailApiData } from "../utils/data-transform";

/**
 * 공지사항 목록 조회 API
 */
export const fetchAnnouncements = async (
  filters?: AnnouncementFilters,
  page: number = 1,
  limit: number = ANNOUNCEMENT_CONSTANTS.UI.PAGE_SIZE
): Promise<AnnouncementListApiResponse> => {
  // API 파라미터 빌더 사용
  const queryString = createApiParams()
    .withPagination(page, limit)
    .withFilters(filters)
    .toString();

  const endpoint = `${ANNOUNCEMENT_CONSTANTS.API.ENDPOINTS.ANNOUNCEMENTS}?${queryString}`;

  // 개발 환경에서 검색 파라미터 로그 출력
  if (process.env.NODE_ENV === "development") {
    console.log(`🔍 검색 필터:`, filters);
    console.log(`📄 페이지 정보: ${page}페이지, ${limit}개씩`);
  }

  return apiClient.get<AnnouncementListApiResponse>(endpoint);
};

/**
 * 공지사항 상세 조회 API
 */
export const fetchAnnouncementDetail = async (
  id: string
): Promise<AnnouncementDetailApiData> => {
  return apiClient.get<AnnouncementDetailApiData>(
    ANNOUNCEMENT_CONSTANTS.API.ENDPOINTS.ANNOUNCEMENT_DETAIL(id)
  );
};

/**
 * 공지사항 생성 API
 */
export const createAnnouncement = async (
  data: CreateAnnouncementData
): Promise<Announcement> => {
  // camelCase to snake_case 변환
  const requestData = {
    title: data.title,
    content: data.content,
    is_published: data.isPublished,
    ...(data.category && { category: data.category }),
    ...(data.priority && { priority: data.priority }),
    ...(data.isPinned !== undefined && { is_pinned: data.isPinned }),
    ...(data.validFrom && { valid_from: data.validFrom }),
    ...(data.validUntil && { valid_until: data.validUntil }),
  };

  const response = await apiClient.post<AnnouncementDetailApiData>(
    ANNOUNCEMENT_CONSTANTS.API.ENDPOINTS.ANNOUNCEMENTS,
    requestData
  );

  // 응답 데이터를 프론트엔드 형식으로 변환
  return transformAnnouncementDetailApiData(response);
};

/**
 * 공지사항 수정 API
 */
export const updateAnnouncement = async (
  id: string,
  data: UpdateAnnouncementData
): Promise<Announcement> => {
  // camelCase to snake_case 변환 (정의된 값만)
  const requestData: Record<string, string | boolean | undefined> = {};

  if (data.title !== undefined) requestData.title = data.title;
  if (data.content !== undefined) requestData.content = data.content;
  if (data.isPublished !== undefined)
    requestData.is_published = data.isPublished;
  if (data.category !== undefined) requestData.category = data.category;
  if (data.priority !== undefined) requestData.priority = data.priority;
  if (data.isPinned !== undefined) requestData.is_pinned = data.isPinned;
  if (data.validFrom !== undefined) requestData.valid_from = data.validFrom;
  if (data.validUntil !== undefined) requestData.valid_until = data.validUntil;

  const response = await apiClient.patch<AnnouncementDetailApiData>(
    ANNOUNCEMENT_CONSTANTS.API.ENDPOINTS.ANNOUNCEMENT_DETAIL(id),
    requestData
  );

  // 응답 데이터를 프론트엔드 형식으로 변환
  return transformAnnouncementDetailApiData(response);
};

/**
 * 공지사항 삭제 API
 */
export const deleteAnnouncement = async (id: string): Promise<void> => {
  return apiClient.delete<void>(
    ANNOUNCEMENT_CONSTANTS.API.ENDPOINTS.ANNOUNCEMENT_DETAIL(id)
  );
};

/**
 * 공지사항 일괄 삭제 API
 */
export const deleteAnnouncements = async (ids: string[]): Promise<void> => {
  return apiClient.deleteWithBody<void>(
    `${ANNOUNCEMENT_CONSTANTS.API.ENDPOINTS.ANNOUNCEMENTS}bulk-delete`,
    { ids }
  );
};

/**
 * 공지사항 게시 API
 */
export const publishAnnouncement = async (
  id: string
): Promise<Announcement> => {
  const response = await apiClient.post<AnnouncementDetailApiData>(
    ANNOUNCEMENT_CONSTANTS.API.ENDPOINTS.ANNOUNCEMENT_PUBLISH(id)
  );

  return transformAnnouncementDetailApiData(response);
};

/**
 * 공지사항 게시 중단 API
 */
export const unpublishAnnouncement = async (
  id: string
): Promise<Announcement> => {
  const response = await apiClient.post<AnnouncementDetailApiData>(
    ANNOUNCEMENT_CONSTANTS.API.ENDPOINTS.ANNOUNCEMENT_UNPUBLISH(id)
  );

  return transformAnnouncementDetailApiData(response);
};
