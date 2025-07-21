import {
  Announcement,
  AnnouncementApiData,
  AnnouncementDetailApiData,
  AnnouncementListApiResponse,
} from "../types";

/**
 * 백엔드 API 데이터를 프론트엔드 Announcement 형태로 변환
 */
export const transformAnnouncementApiData = (
  apiData: AnnouncementApiData
): Announcement => {
  return {
    id: apiData.id,
    title: apiData.title,
    content: "", // API에서 제공되지 않음 (상세 조회에서만 제공)
    views: apiData.views,
    isPublished: apiData.is_published,
    publishedAt: apiData.is_published ? apiData.created_at : undefined,
    files: [], // TODO: 추후 파일 기능 활성화 시 추가
    createdAt: apiData.created_at,
    updatedAt: apiData.created_at, // API에서 제공되지 않으므로 created_at 사용
    authorId: "", // API에서 제공되지 않음
    authorName: apiData.author_name,
  };
};

/**
 * 백엔드 상세 API 데이터를 프론트엔드 Announcement 형태로 변환
 */
export const transformAnnouncementDetailApiData = (
  apiData: AnnouncementDetailApiData
): Announcement => {
  return {
    id: apiData.id,
    title: apiData.title,
    content: apiData.content,
    views: apiData.views,
    isPublished: apiData.is_published,
    publishedAt: apiData.is_published ? apiData.created_at : undefined,
    files: [], // TODO: 추후 파일 기능 활성화 시 추가
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
    authorId: apiData.author,
    authorName: apiData.author_name,
  };
};

/**
 * 백엔드 목록 API 응답을 프론트엔드 형태로 변환
 */
export const transformAnnouncementListResponse = (
  apiResponse: AnnouncementListApiResponse
) => {
  return {
    items: apiResponse.results.map(transformAnnouncementApiData),
    totalCount: apiResponse.count,
    currentPage: apiResponse.page,
    pageSize: apiResponse.page_size,
    totalPages: apiResponse.total_pages,
    hasMore: apiResponse.page < apiResponse.total_pages,
  };
};
