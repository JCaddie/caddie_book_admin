import { serverApiClient } from "./api-client";
import {
  BooleanConstantItem,
  ConstantItem,
  ConstantsApiResponse,
  NumericConstantItem,
} from "@/shared/types/constants";

/**
 * 서버에서 상수 옵션들을 가져오는 함수
 */
export async function getConstantOptions(constantKeys: string[]) {
  try {
    // 기존 API는 모든 상수를 한 번에 가져옴
    const response = await serverApiClient.get<ConstantsApiResponse>(
      "/v1/constants/"
    );

    // 요청된 키들만 필터링
    const constants: Record<string, Array<{ id: string; name: string }>> = {};

    constantKeys.forEach((key) => {
      if (response.data && response.data[key as keyof typeof response.data]) {
        const constantData = response.data[key as keyof typeof response.data];
        // 상수 데이터를 { id, name } 형태로 변환
        constants[key] = constantData.map(
          (item: ConstantItem | NumericConstantItem | BooleanConstantItem) => ({
            id: String(item.id),
            name: item.value,
          })
        );
      }
    });

    return constants;
  } catch (error) {
    console.error("상수 옵션 조회 실패:", error);
    return {};
  }
}
