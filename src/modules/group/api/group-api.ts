import { apiClient } from "@/shared/lib/api-client";
import {
  CreateGroupRequest,
  CreateGroupResponse,
  GroupListResponse,
} from "../types";

/**
 * 그룹 목록 조회
 */
export const getGroups = async (params?: {
  golf_course?: number;
  group_type?: string;
}): Promise<GroupListResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.golf_course) {
    searchParams.append("golf_course", params.golf_course.toString());
  }

  if (params?.group_type) {
    searchParams.append("group_type", params.group_type);
  }

  const queryString = searchParams.toString();
  const endpoint = `/api/v1/caddie-groups/groups/${
    queryString ? `?${queryString}` : ""
  }`;

  return apiClient.get<GroupListResponse>(endpoint);
};

/**
 * 그룹 생성
 */
export const createGroup = async (
  data: CreateGroupRequest
): Promise<CreateGroupResponse> => {
  return apiClient.post<CreateGroupResponse>(
    "/api/v1/caddie-groups/groups/",
    data
  );
};

/**
 * 그룹 수정
 */
export const updateGroup = async (
  groupId: number,
  data: Partial<CreateGroupRequest>
): Promise<CreateGroupResponse> => {
  return apiClient.patch<CreateGroupResponse>(
    `/api/v1/caddie-groups/groups/${groupId}/`,
    data
  );
};

/**
 * 그룹 삭제
 */
export const deleteGroup = async (groupId: number): Promise<void> => {
  return apiClient.delete(`/api/v1/caddie-groups/groups/${groupId}/`);
};
