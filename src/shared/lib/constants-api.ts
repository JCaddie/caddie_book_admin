import { apiClient } from "./api-client";
import { ConstantsApiResponse } from "@/shared/types/constants";

/**
 * 백엔드에서 상수값들을 조회하는 API
 */
export const constantsApi = {
  /**
   * 모든 상수값 조회
   */
  getConstants: async (): Promise<ConstantsApiResponse> => {
    return await apiClient.get<ConstantsApiResponse>("/api/v1/constants/");
  },
};
