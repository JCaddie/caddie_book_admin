import { FieldListApiResponse } from "../hooks/use-field-list";
import { CreateFieldRequest, FieldData, UpdateFieldRequest } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  const res = await fetch(`${API_BASE_URL}/api/v1/fields/?${params}`);
  if (!res.ok) throw new Error("필드 데이터를 불러오지 못했습니다.");
  return res.json();
};

// 필드 상세 조회
export const fetchFieldDetail = async (id: string): Promise<FieldData> => {
  const res = await fetch(`${API_BASE_URL}/api/v1/fields/${id}/`);
  if (!res.ok) throw new Error("필드 상세 정보를 불러오지 못했습니다.");
  return res.json();
};

// 필드 생성
export const createField = async (
  data: CreateFieldRequest
): Promise<FieldData> => {
  const res = await fetch(`${API_BASE_URL}/api/v1/fields/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("필드 등록에 실패했습니다.");
  return res.json();
};

// 필드 수정
export const updateField = async (
  id: string,
  data: UpdateFieldRequest
): Promise<FieldData> => {
  const res = await fetch(`${API_BASE_URL}/api/v1/fields/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("필드 정보를 수정하지 못했습니다.");
  return res.json();
};

// 필드 삭제
export const deleteField = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/api/v1/fields/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("필드 삭제에 실패했습니다.");
  return true;
};

// 골프장 simple 리스트 조회 (id, name)
export const fetchSimpleGolfCourses = async (): Promise<
  { id: string; name: string }[]
> => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${API_BASE_URL}/api/v1/golf-courses/simple/`);
  if (!res.ok) throw new Error("골프장 목록을 불러오지 못했습니다.");
  const json = await res.json();
  return Array.isArray(json.results) ? json.results : [];
};
