import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUsers, updateUser } from "../api/user-api";
import { User } from "../types";
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
 * 사용자 삭제 mutation 훅
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
 * 사용자 정보 수정 mutation 훅
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: Partial<User>;
    }) => updateUser(userId, userData),
    onSuccess: () => {
      // 관리자 목록 쿼리 무효화하여 재페치
      queryClient.invalidateQueries({ queryKey: ADMIN_LIST_QUERY_KEY });
    },
    onError: (error) => {
      console.error("사용자 정보 수정 중 오류 발생:", error);
    },
  });
};
