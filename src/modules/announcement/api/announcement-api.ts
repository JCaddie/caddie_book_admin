import { apiClient } from "@/shared/lib/api-client";
import {
  Announcement,
  AnnouncementDetailApiData,
  AnnouncementFilters,
  AnnouncementListApiResponse,
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from "../types";
import { API_ENDPOINTS } from "../constants";

/**
 * 공지사항 목록 조회 API
 */
export const fetchAnnouncements = async (
  filters?: AnnouncementFilters,
  page: number = 1,
  limit: number = 20
): Promise<AnnouncementListApiResponse> => {
  const params = new URLSearchParams();

  // 페이지네이션 파라미터
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  // 필터 파라미터
  if (filters?.searchTerm) {
    params.append("search", filters.searchTerm);
  }
  if (filters?.isPublished !== undefined) {
    params.append("is_published", filters.isPublished.toString());
  }
  if (filters?.category) {
    params.append("category", filters.category);
  }
  if (filters?.priority) {
    params.append("priority", filters.priority);
  }
  if (filters?.isPinned !== undefined) {
    params.append("is_pinned", filters.isPinned.toString());
  }
  if (filters?.startDate) {
    params.append("start_date", filters.startDate);
  }
  if (filters?.endDate) {
    params.append("end_date", filters.endDate);
  }
  if (filters?.authorId) {
    params.append("author_id", filters.authorId);
  }
  if (filters?.type) {
    params.append("type", filters.type);
  }

  const endpoint = `${API_ENDPOINTS.ANNOUNCEMENTS}?${params.toString()}`;

  return apiClient.get<AnnouncementListApiResponse>(endpoint);
};

/**
 * 공지사항 상세 조회 API
 */
export const fetchAnnouncementDetail = async (
  id: string
): Promise<AnnouncementDetailApiData> => {
  return apiClient.get<AnnouncementDetailApiData>(
    API_ENDPOINTS.ANNOUNCEMENT_DETAIL(id)
  );
};

/**
 * 공지사항 생성 API
 */
export const createAnnouncement = async (
  data: CreateAnnouncementData
): Promise<Announcement> => {
  // TODO: 첨부파일 기능 추후 활성화 시 FormData 사용 예정
  // const formData = new FormData();
  // formData.append("title", data.title);
  // formData.append("content", data.content);
  // formData.append("is_published", data.isPublished.toString());

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

  // TODO: 첨부파일 기능 추후 활성화 예정
  // if (data.category) {
  //   formData.append("category", data.category);
  // }
  // if (data.priority) {
  //   formData.append("priority", data.priority);
  // }
  // if (data.isPinned !== undefined) {
  //   formData.append("is_pinned", data.isPinned.toString());
  // }
  // if (data.validFrom) {
  //   formData.append("valid_from", data.validFrom);
  // }
  // if (data.validUntil) {
  //   formData.append("valid_until", data.validUntil);
  // }

  // TODO: 파일 첨부 기능 추후 활성화 예정
  // data.files.forEach((file) => {
  //   formData.append("files", file);
  // });

  // TODO: 첨부파일 기능 활성화 시 postFormData 사용
  // return apiClient.postFormData<Announcement>(API_ENDPOINTS.ANNOUNCEMENTS, formData);
  return apiClient.post<Announcement>(API_ENDPOINTS.ANNOUNCEMENTS, requestData);
};

/**
 * 공지사항 수정 API
 */
export const updateAnnouncement = async (
  id: string,
  data: UpdateAnnouncementData
): Promise<Announcement> => {
  // TODO: 첨부파일 기능 추후 활성화 시 FormData 사용 예정
  // const formData = new FormData();

  const requestData: Record<string, string | boolean | undefined> = {};

  if (data.title !== undefined) {
    requestData.title = data.title;
  }
  if (data.content !== undefined) {
    requestData.content = data.content;
  }
  if (data.isPublished !== undefined) {
    requestData.is_published = data.isPublished;
  }
  if (data.category !== undefined) {
    requestData.category = data.category;
  }
  if (data.priority !== undefined) {
    requestData.priority = data.priority;
  }
  if (data.isPinned !== undefined) {
    requestData.is_pinned = data.isPinned;
  }
  if (data.validFrom !== undefined) {
    requestData.valid_from = data.validFrom;
  }
  if (data.validUntil !== undefined) {
    requestData.valid_until = data.validUntil;
  }

  // TODO: 첨부파일 기능 추후 활성화 예정
  // if (data.title !== undefined) {
  //   formData.append("title", data.title);
  // }
  // if (data.content !== undefined) {
  //   formData.append("content", data.content);
  // }
  // if (data.isPublished !== undefined) {
  //   formData.append("is_published", data.isPublished.toString());
  // }
  // if (data.category !== undefined) {
  //   formData.append("category", data.category);
  // }
  // if (data.priority !== undefined) {
  //   formData.append("priority", data.priority);
  // }
  // if (data.isPinned !== undefined) {
  //   formData.append("is_pinned", data.isPinned.toString());
  // }
  // if (data.validFrom !== undefined) {
  //   formData.append("valid_from", data.validFrom);
  // }
  // if (data.validUntil !== undefined) {
  //   formData.append("valid_until", data.validUntil);
  // }

  // TODO: 새 파일 첨부 기능 추후 활성화 예정
  // if (data.files) {
  //   data.files.forEach((file) => {
  //     formData.append("files", file);
  //   });
  // }

  // TODO: 삭제할 파일 ID들 기능 추후 활성화 예정
  // if (data.removeFileIds && data.removeFileIds.length > 0) {
  //   formData.append("remove_file_ids", JSON.stringify(data.removeFileIds));
  // }

  // TODO: 첨부파일 기능 활성화 시 postFormData 사용
  // return apiClient.postFormData<Announcement>(API_ENDPOINTS.ANNOUNCEMENT_DETAIL(id), formData);
  return apiClient.patch<Announcement>(
    API_ENDPOINTS.ANNOUNCEMENT_DETAIL(id),
    requestData
  );
};

/**
 * 공지사항 삭제 API
 */
export const deleteAnnouncement = async (id: string): Promise<void> => {
  return apiClient.delete<void>(API_ENDPOINTS.ANNOUNCEMENT_DETAIL(id));
};

/**
 * 공지사항 일괄 삭제 API
 */
export const deleteAnnouncements = async (ids: string[]): Promise<void> => {
  return apiClient.post<void>(`${API_ENDPOINTS.ANNOUNCEMENTS}/bulk-delete`, {
    ids,
  });
};

/**
 * 공지사항 게시/게시중단 API
 */
export const publishAnnouncement = async (
  id: string
): Promise<Announcement> => {
  return apiClient.post<Announcement>(API_ENDPOINTS.ANNOUNCEMENT_PUBLISH(id));
};

export const unpublishAnnouncement = async (
  id: string
): Promise<Announcement> => {
  return apiClient.post<Announcement>(API_ENDPOINTS.ANNOUNCEMENT_UNPUBLISH(id));
};
