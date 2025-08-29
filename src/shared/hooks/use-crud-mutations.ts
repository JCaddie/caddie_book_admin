import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useMutationError } from "./use-query-error";

/**
 * CRUD 뮤테이션 설정
 */
export interface UseCrudMutationsConfig<TData, TCreateData, TUpdateData> {
  // 캐시 키
  cacheKeys: {
    list: string;
    detail?: string;
  };

  // API 함수들
  createFn?: (data: TCreateData) => Promise<TData>;
  updateFn?: (id: string, data: TUpdateData) => Promise<TData>;
  deleteFn?: (id: string) => Promise<void>;
  bulkDeleteFn?: (ids: string[]) => Promise<void>;

  // 성공 콜백
  onSuccess?: {
    create?: (data: TData) => void;
    update?: (data: TData) => void;
    delete?: () => void;
    bulkDelete?: () => void;
  };

  // 에러 콜백
  onError?: {
    create?: (error: Error) => void;
    update?: (error: Error) => void;
    delete?: (error: Error) => void;
    bulkDelete?: (error: Error) => void;
  };
}

/**
 * CRUD 뮤테이션 반환 타입
 */
export interface UseCrudMutationsReturn<TData, TCreateData, TUpdateData> {
  // Create
  create: {
    mutate: (data: TCreateData) => Promise<TData>;
    isLoading: boolean;
    error: string | null;
  };

  // Update
  update: {
    mutate: (params: { id: string; data: TUpdateData }) => Promise<TData>;
    isLoading: boolean;
    error: string | null;
  };

  // Delete
  delete: {
    mutate: (id: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
  };

  // Bulk Delete
  bulkDelete: {
    mutate: (ids: string[]) => Promise<void>;
    isLoading: boolean;
    error: string | null;
  };
}

/**
 * CRUD 뮤테이션을 위한 공통 훅
 */
export function useCrudMutations<TData, TCreateData, TUpdateData>(
  config: UseCrudMutationsConfig<TData, TCreateData, TUpdateData>
): UseCrudMutationsReturn<TData, TCreateData, TUpdateData> {
  const {
    cacheKeys,
    createFn,
    updateFn,
    deleteFn,
    bulkDeleteFn,
    onSuccess,
    onError,
  } = config;

  const queryClient = useQueryClient();

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: createFn!,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.list] });
      onSuccess?.create?.(data);
    },
    onError: (error: Error) => {
      onError?.create?.(error);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUpdateData }) =>
      updateFn!(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.list] });
      if (cacheKeys.detail) {
        queryClient.invalidateQueries({
          queryKey: [cacheKeys.detail, variables.id],
        });
      }
      onSuccess?.update?.(data);
    },
    onError: (error: Error) => {
      onError?.update?.(error);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteFn!,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.list] });
      if (cacheKeys.detail) {
        queryClient.removeQueries({ queryKey: [cacheKeys.detail, id] });
      }
      onSuccess?.delete?.();
    },
    onError: (error: Error) => {
      onError?.delete?.(error);
    },
  });

  // Bulk Delete Mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteFn!,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.list] });
      onSuccess?.bulkDelete?.();
    },
    onError: (error: Error) => {
      onError?.bulkDelete?.(error);
    },
  });

  return {
    create: {
      mutate: async (data: TCreateData) => {
        if (!createFn) throw new Error("Create function not provided");
        return createMutation.mutateAsync(data);
      },
      isLoading: createMutation.isPending,
      error: useMutationError(createMutation.error, "create"),
    },
    update: {
      mutate: async (params: { id: string; data: TUpdateData }) => {
        if (!updateFn) throw new Error("Update function not provided");
        return updateMutation.mutateAsync(params);
      },
      isLoading: updateMutation.isPending,
      error: useMutationError(updateMutation.error, "update"),
    },
    delete: {
      mutate: async (id: string) => {
        if (!deleteFn) throw new Error("Delete function not provided");
        return deleteMutation.mutateAsync(id);
      },
      isLoading: deleteMutation.isPending,
      error: useMutationError(deleteMutation.error, "delete"),
    },
    bulkDelete: {
      mutate: async (ids: string[]) => {
        if (!bulkDeleteFn) throw new Error("Bulk delete function not provided");
        return bulkDeleteMutation.mutateAsync(ids);
      },
      isLoading: bulkDeleteMutation.isPending,
      error: useMutationError(bulkDeleteMutation.error, "delete"),
    },
  };
}
