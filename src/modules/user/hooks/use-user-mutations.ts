import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  deleteUsers,
  updateUser,
  updateUserPassword,
} from "../api/user-api";
import { ADMIN_LIST_QUERY_KEY } from "./use-admin-list";

/**
 * 사용자 생성 mutation 훅
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // 관리자 목록 쿼리 무효화하여 재페치
      queryClient.invalidateQueries({ queryKey: ADMIN_LIST_QUERY_KEY });
    },
    onError: (error) => {
      console.error("사용자 생성 중 오류 발생:", error);
    },
  });
};

/**
 * 단일 사용자 삭제 mutation 훅
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
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
 * 여러 사용자 삭제 mutation 훅
 */
export const useDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUsers,
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
 * 사용자 기본 정보 수정 mutation 훅
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: Partial<{
        username: string;
        name: string;
        phone: string;
        email: string;
        golf_course_id: string;
      }>;
    }) => updateUser(userId, userData),
    onSuccess: (data, variables) => {
      // 관리자 목록 쿼리 무효화하여 재페치
      queryClient.invalidateQueries({ queryKey: ADMIN_LIST_QUERY_KEY });
      // 개별 사용자 상세 쿼리도 무효화
      queryClient.invalidateQueries({
        queryKey: ["admin-detail", variables.userId],
      });
    },
    onError: (error) => {
      console.error("사용자 정보 수정 중 오류 발생:", error);
    },
  });
};

/**
 * 사용자 비밀번호 수정 mutation 훅
 */
export const useUpdateUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      passwordData,
    }: {
      userId: string;
      passwordData: {
        password: string;
        password_confirm: string;
      };
    }) => updateUserPassword(userId, passwordData),
    onSuccess: (data, variables) => {
      // 개별 사용자 상세 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["admin-detail", variables.userId],
      });
    },
    onError: (error) => {
      console.error("사용자 비밀번호 수정 중 오류 발생:", error);
    },
  });
};
