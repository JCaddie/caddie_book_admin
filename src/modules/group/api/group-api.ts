import { apiClient } from "@/shared/lib/api-client";
import {
  AddGroupMemberRequest,
  AddGroupMemberResponse,
  AssignPrimaryRequest,
  AssignPrimaryResponse,
  CreateGroupRequest,
  CreateGroupResponse,
  GroupListResponse,
  RemoveGroupMemberRequest,
  RemoveGroupMemberResponse,
  RemovePrimaryRequest,
  RemovePrimaryResponse,
  ReorderGroupMemberRequest,
  ReorderGroupMemberResponse,
  ReorderRequest,
  ReorderResponse,
} from "../types/group-status";
import { GolfCourseGroupStatusListResponse } from "@/modules/golf-course/types/api";
import { CaddieAssignmentOverviewResponse } from "@/modules/user/types/user";

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
    "/api/v1/golf-courses/groups/",
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
    `/api/v1/golf-courses/groups/${groupId}/`,
    data
  );
};

/**
 * 그룹 삭제
 */
export const deleteGroup = async (groupId: number): Promise<void> => {
  return apiClient.delete(`/api/v1/golf-courses/groups/${groupId}/`);
};

/**
 * 그룹 멤버 추가 API
 */
export const addGroupMember = async (
  groupId: string,
  data: AddGroupMemberRequest
): Promise<AddGroupMemberResponse> => {
  return apiClient.post<AddGroupMemberResponse>(
    `/api/v1/golf-courses/groups/${groupId}/members/`,
    data
  );
};

/**
 * 조 배정 API (Deprecated - addGroupMember 사용 권장)
 * @deprecated 새로운 addGroupMember 함수 사용을 권장합니다
 */
export const assignPrimaryGroup = async (
  groupId: number,
  data: AssignPrimaryRequest
): Promise<AssignPrimaryResponse> => {
  return apiClient.put<AssignPrimaryResponse>(
    `/api/v1/caddie-groups/assignments/${groupId}/assign_primary/`,
    data
  );
};

/**
 * 그룹 멤버 순서 변경 API
 */
export const reorderGroupMember = async (
  groupId: string,
  data: ReorderGroupMemberRequest
): Promise<ReorderGroupMemberResponse> => {
  return apiClient.put<ReorderGroupMemberResponse>(
    `/api/v1/golf-courses/groups/${groupId}/members/`,
    data
  );
};

/**
 * 조 순서 변경 API (Deprecated - reorderGroupMember 사용 권장)
 * @deprecated 새로운 reorderGroupMember 함수 사용을 권장합니다
 */
export const reorderPrimaryGroup = async (
  groupId: number,
  data: ReorderRequest
): Promise<ReorderResponse> => {
  return apiClient.patch<ReorderResponse>(
    `/api/v1/caddie-groups/assignments/${groupId}/reorder_primary/`,
    data
  );
};

/**
 * 그룹 멤버 제거 API
 */
export const removeGroupMember = async (
  groupId: string,
  data: RemoveGroupMemberRequest
): Promise<RemoveGroupMemberResponse> => {
  return apiClient.deleteWithBody<RemoveGroupMemberResponse>(
    `/api/v1/golf-courses/groups/${groupId}/members/`,
    data
  );
};

/**
 * 조 배정 해제 API (Deprecated - removeGroupMember 사용 권장)
 * @deprecated 새로운 removeGroupMember 함수 사용을 권장합니다
 */
export const removePrimaryGroup = async (
  groupId: number,
  data: RemovePrimaryRequest
): Promise<RemovePrimaryResponse> => {
  return apiClient.deleteWithBody<RemovePrimaryResponse>(
    `/api/v1/caddie-groups/assignments/${groupId}/remove_primary/`,
    data
  );
};

/**
 * 골프장별 그룹 현황 조회 API (Overview) - 목록용
 */
export const getGroupAssignmentOverview = async ({
  page = 1,
  searchTerm,
}: {
  page?: number;
  searchTerm?: string;
} = {}): Promise<GolfCourseGroupStatusListResponse> => {
  const params = new URLSearchParams();

  params.append("page", page.toString());

  if (searchTerm) {
    params.append("search", searchTerm);
  }

  const queryString = params.toString();
  const endpoint = `/api/v1/golf-courses/group-overview/${
    queryString ? `?${queryString}` : ""
  }`;

  return apiClient.get<GolfCourseGroupStatusListResponse>(endpoint);
};

/**
 * 특정 골프장의 그룹 상태 조회 API (상세용)
 */
export const getGolfCourseGroupStatus = async (
  golfCourseId: string,
  groupType?: "PRIMARY" | "SPECIAL"
): Promise<CaddieAssignmentOverviewResponse> => {
  const searchParams = new URLSearchParams();

  if (groupType) {
    searchParams.append("group_type", groupType);
  }

  const queryString = searchParams.toString();
  const endpoint = `/api/v1/golf-courses/${golfCourseId}/group-status/${
    queryString ? `?${queryString}` : ""
  }`;

  return apiClient.get<CaddieAssignmentOverviewResponse>(endpoint);
};
