import { serverApiClient } from "@/shared/lib/server/api-client";
import { WORK_API_ENDPOINTS } from "./work-api";

/**
 * 서버에서 근무 상세 데이터를 가져오는 함수
 */
export async function getWorkDetailData(golfCourseId: string, date?: string) {
  try {
    const formattedDate = date || new Date().toISOString().split("T")[0];

    const response = await serverApiClient.get(
      `${WORK_API_ENDPOINTS.DAILY_SCHEDULES}${golfCourseId}/${formattedDate}/`
    );

    return response;
  } catch (error) {
    console.error("근무 상세 데이터 조회 실패:", error);
    return null;
  }
}

/**
 * 서버에서 근무 목록을 가져오는 함수
 */
export async function getWorkList(params: {
  page?: number;
  search?: string;
  golf_course?: string;
}) {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.golf_course) searchParams.set("golf_course", params.golf_course);

    const response = await serverApiClient.get(
      `${WORK_API_ENDPOINTS.SCHEDULES}?${searchParams.toString()}`
    );

    return response;
  } catch (error) {
    console.error("근무 목록 조회 실패:", error);
    return null;
  }
}
