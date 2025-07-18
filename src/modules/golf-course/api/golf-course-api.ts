import {
  EditableGolfCourse,
  GolfCourseDetail,
  GolfCourseFilters,
  GolfCourseListResponse,
} from "../types/golf-course";
import { apiClient } from "@/shared/lib/api-client";

export const fetchGolfCourses = async ({
  page,
  searchTerm,
  filters,
}: {
  page: number;
  searchTerm: string;
  filters: GolfCourseFilters;
}): Promise<GolfCourseListResponse> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  if (searchTerm) params.append("search", searchTerm);
  if (filters.contract) params.append("contract_status", filters.contract);
  if (filters.membership_type)
    params.append("membership_type", filters.membership_type);
  if (filters.field_count) params.append("field_count", filters.field_count);
  // 기타 필터도 필요시 추가

  return apiClient.get<GolfCourseListResponse>(
    `/api/v1/golf-courses/?${params}`
  );
};

export const fetchGolfCourseDetail = async (
  id: string
): Promise<GolfCourseDetail> => {
  return apiClient.get<GolfCourseDetail>(`/api/v1/golf-courses/${id}/`);
};

export const updateGolfCourse = async (
  id: string,
  data: Partial<GolfCourseDetail> | Partial<EditableGolfCourse>
): Promise<GolfCourseDetail> => {
  return apiClient.patch<GolfCourseDetail>(`/api/v1/golf-courses/${id}/`, data);
};

export async function deleteGolfCourse(id: string) {
  await apiClient.delete(`/api/v1/golf-courses/${id}/`);
  return true;
}
