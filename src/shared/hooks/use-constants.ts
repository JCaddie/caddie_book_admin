import { useQuery } from "@tanstack/react-query";
import { constantsApi } from "@/shared/lib/constants-api";
import {
  BooleanConstantItem,
  ConstantCategory,
  ConstantItem,
  NumericConstantItem,
} from "@/shared/types/constants";

// 모든 상수 아이템 타입의 유니온
type AnyConstantItem = ConstantItem | NumericConstantItem | BooleanConstantItem;

/**
 * 백엔드 상수값들을 조회하는 훅
 */
export const useConstants = () => {
  const query = useQuery({
    queryKey: ["constants"],
    queryFn: async () => {
      const response = await constantsApi.getConstants();
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1시간 캐시
    gcTime: 1000 * 60 * 60 * 24, // 24시간 가비지 컬렉션
  });

  return {
    constants: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * 특정 카테고리의 상수값을 조회하는 훅
 */
export const useConstantsByCategory = (category: ConstantCategory) => {
  const { constants, isLoading, isError, error } = useConstants();

  const categoryConstants = constants?.[category] || [];

  return {
    constants: categoryConstants,
    isLoading,
    isError,
    error,
  };
};

/**
 * 상수값에서 id로 value를 찾는 유틸리티 훅
 */
export const useConstantValue = () => {
  const { constants } = useConstants();

  const getValueById = (
    category: ConstantCategory,
    id: string | number | boolean
  ): string => {
    if (!constants) return "";

    const categoryConstants = constants[category];
    const item = categoryConstants.find(
      (item: AnyConstantItem) => item.id === id
    );
    return item?.value || "";
  };

  const getIdByValue = (
    category: ConstantCategory,
    value: string
  ): string | number | boolean | undefined => {
    if (!constants) return undefined;

    const categoryConstants = constants[category];
    const item = categoryConstants.find(
      (item: AnyConstantItem) => item.value === value
    );
    return item?.id;
  };

  return {
    getValueById,
    getIdByValue,
  };
};

/**
 * 드롭다운이나 셀렉트에서 사용할 수 있는 옵션 형태로 변환하는 훅
 */
export const useConstantOptions = (category: ConstantCategory) => {
  const { constants, isLoading, isError } = useConstants();

  const options =
    constants?.[category]?.map((item: AnyConstantItem) => ({
      label: item.value,
      value: item.id,
    })) || [];

  return {
    options,
    isLoading,
    isError,
  };
};

/**
 * 자주 사용되는 상수들을 위한 전용 훅들
 */

// 사용자 역할 상수
export const useUserRoleConstants = () => {
  return useConstantsByCategory("user_roles");
};

// 성별 상수
export const useGenderConstants = () => {
  return useConstantsByCategory("genders");
};

// 고용 형태 상수
export const useEmploymentTypeConstants = () => {
  return useConstantsByCategory("employment_types");
};

// 계약 상태 상수
export const useContractStatusConstants = () => {
  return useConstantsByCategory("contract_statuses");
};

// 카트 상태 상수
export const useCartStatusConstants = () => {
  return useConstantsByCategory("cart_statuses");
};

// 배터리 레벨 상수
export const useBatteryLevelConstants = () => {
  return useConstantsByCategory("battery_levels");
};

// 휴무 요청 상태 상수
export const useDayOffRequestStatusConstants = () => {
  return useConstantsByCategory("day_off_request_statuses");
};

// 근무표 상태 상수
export const useWorkScheduleStatusConstants = () => {
  return useConstantsByCategory("work_schedule_statuses");
};
