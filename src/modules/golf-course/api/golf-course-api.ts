import {
  EditableGolfCourse,
  GolfCourseDetail,
  GolfCourseFilters,
  GolfCourseListResponse,
} from "../types/golf-course";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  if (filters.membershipType)
    params.append("membership_type", filters.membershipType);
  // 기타 필터도 필요시 추가

  const res = await fetch(`${API_BASE_URL}/api/v1/golf-courses/?${params}`);
  if (!res.ok) throw new Error("골프장 데이터를 불러오지 못했습니다.");
  return res.json();
};

export const fetchGolfCourseDetail = async (
  id: string
): Promise<GolfCourseDetail> => {
  const res = await fetch(`${API_BASE_URL}/api/v1/golf-courses/${id}/`);
  if (!res.ok) throw new Error("골프장 상세 정보를 불러오지 못했습니다.");
  return res.json();
};

export const updateGolfCourse = async (
  id: string,
  data: Partial<GolfCourseDetail> | Partial<EditableGolfCourse>
): Promise<GolfCourseDetail> => {
  const res = await fetch(`${API_BASE_URL}/api/v1/golf-courses/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("골프장 정보를 수정하지 못했습니다.");
  return res.json();
};
