import { serverApiClient } from "@/shared/lib/server/api-client";
import { buildUrl, GOLF_COURSE_ENDPOINTS } from "./endpoints";
import type {
  GolfCourseDetailResponse,
  GolfCourseListResponse,
} from "../types/api";

interface GetGolfCourseListParams {
  page: number;
  search?: string;
  contract?: string;
  membership_type?: string;
  isActive?: string;
}

/**
 * 서버에서 골프장 목록을 가져오는 함수
 */
export async function getGolfCourseList(
  params: GetGolfCourseListParams
): Promise<GolfCourseListResponse | null> {
  try {
    const queryParams: Record<string, string> = {
      page: params.page.toString(),
      page_size: "20",
    };

    if (params.search) {
      queryParams.search = params.search;
    }
    if (params.contract) {
      queryParams.contract = params.contract;
    }
    if (params.membership_type) {
      queryParams.membership_type = params.membership_type;
    }
    if (params.isActive) {
      queryParams.is_active = params.isActive;
    }

    const url = buildUrl(GOLF_COURSE_ENDPOINTS.LIST, queryParams);
    const response = await serverApiClient.get<GolfCourseListResponse>(url);

    return response;
  } catch (error) {
    console.error("골프장 목록 조회 실패:", error);
    return null;
  }
}

/**
 * 서버에서 골프장 상세 정보를 가져오는 함수
 */
export async function getGolfCourseDetail(
  id: string
): Promise<GolfCourseDetailResponse | null> {
  try {
    const url = GOLF_COURSE_ENDPOINTS.DETAIL(id);
    const response = await serverApiClient.get<GolfCourseDetailResponse>(url);
    return response;
  } catch (error) {
    console.error("골프장 상세 조회 실패:", error);
    return null;
  }
}
