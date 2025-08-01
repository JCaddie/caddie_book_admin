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
    content: apiData.content,
    views: apiData.views,
    isPublished: apiData.is_published,
    publishedAt: apiData.is_published ? apiData.created_at : undefined,
    files: [], // TODO: 추후 파일 기능 활성화 시 추가
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
    authorId: apiData.author,
    authorName: apiData.author_name,
    golfCourseId: apiData.golf_course,
    golfCourseName: apiData.golf_course_name,
    targetGroup: apiData.target_group,
    announcementType: apiData.announcement_type,
    announcementTypeDisplay: apiData.announcement_type_display,
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
    golfCourseId: apiData.golf_course,
    golfCourseName: apiData.golf_course_name,
    targetGroup: apiData.target_group,
    announcementType: apiData.announcement_type,
    announcementTypeDisplay: apiData.announcement_type_display,
  };
};

/**
 * 백엔드 목록 API 응답을 프론트엔드 형태로 변환
 */
export const transformAnnouncementListResponse = (
  apiResponse: AnnouncementListApiResponse
) => {
  return {
    items: apiResponse.data.results.map(transformAnnouncementApiData),
    totalCount: apiResponse.data.count,
    currentPage: apiResponse.data.page,
    pageSize: apiResponse.data.page_size,
    totalPages: apiResponse.data.total_pages,
    hasMore: apiResponse.data.page < apiResponse.data.total_pages,
  };
};
