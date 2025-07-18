import { FieldListApiResponse } from "../hooks/use-field-list";
import { CreateFieldRequest, Field, UpdateFieldRequest } from "../types";
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

  return apiClient.get<FieldListApiResponse>(`/api/v1/fields/?${params}`);
};

// 필드 상세 조회
export const fetchFieldDetail = async (id: string): Promise<Field> => {
  return apiClient.get<Field>(`/api/v1/fields/${id}/`);
};

// 필드 생성
export const createField = async (data: CreateFieldRequest): Promise<Field> => {
  return apiClient.post<Field>(`/api/v1/fields/`, data);
};

// 필드 수정
export const updateField = async (
  id: string,
  data: UpdateFieldRequest
): Promise<Field> => {
  return apiClient.patch<Field>(`/api/v1/fields/${id}/`, data);
};

// 필드 삭제
export const deleteField = async (id: string): Promise<boolean> => {
  await apiClient.delete(`/api/v1/fields/${id}/`);
  return true;
};

// 골프장 simple 리스트 조회 (id, name)
export const fetchSimpleGolfCourses = async (): Promise<
  { id: string; name: string }[]
> => {
  const json = await apiClient.get<{ results: { id: string; name: string }[] }>(
    `/api/v1/golf-courses/simple/`
  );
  return Array.isArray(json.results) ? json.results : [];
};
