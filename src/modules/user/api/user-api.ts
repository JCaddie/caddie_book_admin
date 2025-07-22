import { apiClient } from "@/shared/lib/api-client";
import {
  AdminsApiResponse,
  User,
  UserAssignmentResponse,
  UserDetailApiResponse,
} from "../types";

/**
 * 관리자 사용자 목록 조회 (간소화된 정보)
 */
export const getAdmins = async (): Promise<AdminsApiResponse> => {
  try {
    const response = await apiClient.get<AdminsApiResponse>(
      "/api/v1/auth/admins/"
    );
    return response;
  } catch (error) {
    console.error("관리자 사용자 목록 조회 실패:", error);
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
    const response = await apiClient.post<User>(
      "/api/v1/auth/admins/",
      userData
    );
    return response;
  } catch (error) {
    console.error("사용자 생성 실패:", error);
    throw error;
  }
};

/**
 * 사용자 삭제
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/auth/admins/${userId}/`);
  } catch (error) {
    console.error("사용자 삭제 실패:", error);
    throw error;
  }
};

/**
 * 여러 사용자 일괄 삭제
 */
export const deleteMultipleUsers = async (userIds: string[]): Promise<void> => {
  try {
    // 각 사용자를 개별적으로 삭제
    const deletePromises = userIds.map((userId) => deleteUser(userId));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("여러 사용자 일괄 삭제 실패:", error);
    throw error;
  }
};

/**
 * 사용자 상세 조회
 */
export const getUserDetail = async (userId: string): Promise<User> => {
  try {
    const response = await apiClient.get<UserDetailApiResponse>(
      `/api/v1/auth/admins/${userId}/`
    );
    return response.data;
  } catch (error) {
    console.error("사용자 상세 조회 실패:", error);
    throw error;
  }
};

/**
 * 사용자 정보 수정
 */
export const updateUser = async (
  userId: string,
  userData: {
    name?: string;
    phone?: string;
    email?: string;
    golf_course_id?: string;
  }
): Promise<User> => {
  try {
    const response = await apiClient.patch<UserDetailApiResponse>(
      `/api/v1/auth/admins/${userId}/`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("사용자 정보 수정 실패:", error);
    throw error;
  }
};

/**
 * 사용자 비밀번호 수정
 */
export const updateUserPassword = async (
  userId: string,
  passwordData: {
    password: string;
    password_confirm: string;
  }
): Promise<User> => {
  try {
    const response = await apiClient.patch<UserDetailApiResponse>(
      `/api/v1/auth/admins/${userId}/password/`,
      passwordData
    );
    return response.data;
  } catch (error) {
    console.error("사용자 비밀번호 수정 실패:", error);
    throw error;
  }
};

/**
 * 사용자 배정 정보 조회
 */
export const getUserAssignments = async (
  golfCourseId?: string
): Promise<UserAssignmentResponse> => {
  try {
    let endpoint = "/api/v1/auth/assignment/";

    if (golfCourseId) {
      endpoint += `?golf_course_id=${golfCourseId}`;
    }

    const response = await apiClient.get<UserAssignmentResponse>(endpoint);
    return response;
  } catch (error) {
    console.error("사용자 배정 정보 조회 실패:", error);
    throw error;
  }
};
