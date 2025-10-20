import {
  CreateFieldRequest,
  Field,
  FieldDetailApiResponse,
  FieldListApiResponse,
  UpdateFieldRequest,
} from "../types";
import { apiClient } from "@/shared/lib/api-client";

// 필드 목록 조회
export const fetchFields = async ({
  page,
  searchTerm,
}: {
  page: number;
  searchTerm: string;
}): Promise<FieldListApiResponse> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  if (searchTerm) params.append("search", searchTerm);

  return apiClient.get<FieldListApiResponse>(
    `/v1/golf-courses/fields/?${params}`
  );
};

// 필드 상세 조회
export const fetchFieldDetail = async (id: string): Promise<FieldDetailApiResponse> => {
  return apiClient.get<FieldDetailApiResponse>(`/v1/golf-courses/fields/${id}/`);
};

// 필드 생성
export const createField = async (data: CreateFieldRequest): Promise<Field> => {
  return apiClient.post<Field>(`/v1/golf-courses/fields/`, data);
};

// 필드 수정
export const updateField = async (
  id: string,
  data: UpdateFieldRequest
): Promise<Field> => {
  return apiClient.patch<Field>(`/v1/golf-courses/fields/${id}/`, data);
};

// 필드 삭제
export const deleteField = async (id: string): Promise<boolean> => {
  await apiClient.delete(`/v1/golf-courses/fields/${id}/`);
  return true;
};

// 필드 일괄 삭제
export const deleteFieldsBulk = async (ids: string[]): Promise<boolean> => {
  await apiClient.delete(`/v1/golf-courses/fields/bulk_delete/`, {
    body: JSON.stringify({ ids }),
  });
  return true;
};

// 골프장 simple 리스트 조회 (id, name)
export const fetchSimpleGolfCourses = async (): Promise<
  { id: string; name: string }[]
> => {
  const json = await apiClient.get<{ results: { id: string; name: string }[] }>(
    `/v1/golf-courses/simple/`
  );
  return Array.isArray(json.results) ? json.results : [];
};
