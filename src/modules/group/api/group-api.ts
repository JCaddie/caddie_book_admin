import { apiClient } from "@/shared/lib/api-client";
import {
  AssignPrimaryRequest,
  AssignPrimaryResponse,
  CreateGroupRequest,
  CreateGroupResponse,
  GroupListResponse,
  ReorderRequest,
  ReorderResponse,
  RemovePrimaryRequest,
  RemovePrimaryResponse,
} from "../types/group-status";

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

/**
 * 조 배정 API
 */
export const assignPrimaryGroup = async (
  groupId: number,
  data: AssignPrimaryRequest
): Promise<AssignPrimaryResponse> => {
  return apiClient.put<AssignPrimaryResponse>(
    `/api/v1/caddie-groups/groups/${groupId}/assign_primary/`,
    data
  );
};

/**
 * 조 순서 변경 API
 */
export const reorderPrimaryGroup = async (
  groupId: number,
  data: ReorderRequest
): Promise<ReorderResponse> => {
  return apiClient.patch<ReorderResponse>(
    `/api/v1/caddie-groups/groups/${groupId}/reorder_primary/`,
    data
  );
};

/**
 * 조 배정 해제 API
 */
export const removePrimaryGroup = async (
  groupId: number,
  data: RemovePrimaryRequest
): Promise<RemovePrimaryResponse> => {
  return apiClient.deleteWithBody<RemovePrimaryResponse>(
    `/api/v1/caddie-groups/groups/${groupId}/remove_primary/`,
    data
  );
};
