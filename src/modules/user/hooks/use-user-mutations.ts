import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkDeleteAdmins, createAdmin } from "../api/user-api";
import { BulkDeleteAdminsRequest, CreateAdminRequest } from "../types";
// import {
//   deleteUser,
//   updateUser,
//   updateUserPassword,
// } from "../api/user-api";

/**
 * 어드민 생성 mutation 훅
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAdminRequest) => {
      const response = await createAdmin(data);

      // API 응답이 실패인 경우 에러 던지기
      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: () => {
      // 관리자 목록 쿼리 무효화하여 재페치 (새로운 쿼리 키 사용)
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      console.error("어드민 생성 중 오류 발생:", error);
    },
  });
};

/**
 * 단일 사용자 삭제 mutation 훅 (임시 주석 처리)
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      throw new Error("사용자 삭제 기능이 아직 구현되지 않았습니다.");
    },
    onSuccess: () => {
      // 관리자 목록 쿼리 무효화하여 재페치
      queryClient.invalidateQueries({ queryKey: ADMIN_LIST_QUERY_KEY });
    },
    onError: (error) => {
      console.error("사용자 삭제 중 오류 발생:", error);
    },
  });
};

/**
 * 여러 어드민 삭제 mutation 훅
 */
export const useDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkDeleteAdminsRequest) => {
      const response = await bulkDeleteAdmins(data);

      // API 응답이 실패인 경우 에러 던지기
      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: () => {
      // 관리자 목록 쿼리 무효화하여 재페치
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      console.error("어드민 삭제 중 오류 발생:", error);
    },
  });
};

/**
 * 사용자 기본 정보 수정 mutation 훅 (임시 주석 처리)
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      throw new Error("사용자 정보 수정 기능이 아직 구현되지 않았습니다.");
    },
    onSuccess: () => {
      // 관리자 목록 쿼리 무효화하여 재페치
      queryClient.invalidateQueries({ queryKey: ADMIN_LIST_QUERY_KEY });
    },
    onError: (error) => {
      console.error("사용자 정보 수정 중 오류 발생:", error);
    },
  });
};

/**
 * 사용자 비밀번호 수정 mutation 훅 (임시 주석 처리)
 */
export const useUpdateUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      throw new Error("사용자 비밀번호 수정 기능이 아직 구현되지 않았습니다.");
    },
    onSuccess: () => {
      // 개별 사용자 상세 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["admin-detail"],
      });
    },
    onError: (error) => {
      console.error("사용자 비밀번호 수정 중 오류 발생:", error);
    },
  });
};
