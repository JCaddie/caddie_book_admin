import { apiClient } from "@/shared/lib/api-client";
import { User } from "../types";

/**
 * API 응답 타입 정의
 */
export interface AdminsApiResponse {
  success: boolean;
  message: string;
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: User[];
}

/**
 * 관리자 사용자 목록 조회
 */
export const getAdmins = async (): Promise<AdminsApiResponse> => {
  try {
    console.log("🔄 관리자 사용자 목록 조회 시작");
    const response = await apiClient.get<AdminsApiResponse>(
      "/api/v1/auth/admins/"
    );
    console.log("✅ 관리자 사용자 목록 조회 성공:", response);
    return response;
  } catch (error) {
    console.error("❌ 관리자 사용자 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 사용자 생성
 */
export const createUser = async (userData: {
  username: string;
  password: string;
  password_confirm: string;
  name: string;
  phone: string;
  email: string;
  golf_course_id: string;
}): Promise<User> => {
  try {
    console.log("🔄 사용자 생성 시작:", userData);
    const response = await apiClient.post<User>(
      "/api/v1/auth/admins/",
      userData
    );
    console.log("✅ 사용자 생성 성공:", response);
    return response;
  } catch (error) {
    console.error("❌ 사용자 생성 실패:", error);
    throw error;
  }
};

/**
 * 단일 사용자 삭제
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    console.log("🔄 사용자 삭제 시작:", userId);
    await apiClient.delete(`/api/v1/auth/admins/${userId}/`);
    console.log("✅ 사용자 삭제 성공");
  } catch (error) {
    console.error("❌ 사용자 삭제 실패:", error);
    throw error;
  }
};

/**
 * 여러 사용자 일괄 삭제 (실제 API 사용)
 */
export const deleteUsers = async (userIds: string[]): Promise<void> => {
  try {
    console.log("🔄 여러 사용자 일괄 삭제 시작:", userIds);

    await apiClient.delete("/api/v1/auth/admins/bulk_delete/", {
      body: JSON.stringify({ ids: userIds }),
    });

    console.log("✅ 모든 사용자 삭제 성공");
  } catch (error) {
    console.error("❌ 사용자 삭제 실패:", error);
    throw error;
  }
};

/**
 * 사용자 상세 정보 조회
 */
export const getUserDetail = async (userId: string): Promise<User> => {
  try {
    console.log("🔄 사용자 상세 조회 시작:", userId);
    const response = await apiClient.get<User>(
      `/api/v1/auth/admins/${userId}/`
    );
    console.log("✅ 사용자 상세 조회 성공:", response);
    return response;
  } catch (error) {
    console.error("❌ 사용자 상세 조회 실패:", error);
    throw error;
  }
};

/**
 * 사용자 정보 수정
 */
export const updateUser = async (
  userId: string,
  userData: Partial<{
    username: string;
    name: string;
    phone: string;
    email: string;
  }>
): Promise<User> => {
  try {
    console.log("🔄 사용자 정보 수정 시작:", userId, userData);
    const response = await apiClient.patch<User>(
      `/api/v1/auth/admins/${userId}/`,
      userData
    );
    console.log("✅ 사용자 정보 수정 성공:", response);
    return response;
  } catch (error) {
    console.error("❌ 사용자 정보 수정 실패:", error);
    throw error;
  }
};
