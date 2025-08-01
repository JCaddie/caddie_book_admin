import {
  ApiCartData,
  ApiCartDetailResponse,
  ApiCartHistoryItem,
  ApiCartStatus,
  Cart,
  CartDetail,
  CartHistoryItem,
  CartStatus,
} from "../types";

// ===================== API 매핑 함수들 =====================

/**
 * API 카트 상태를 UI 카트 상태로 변환
 */
export const mapApiStatusToCartStatus = (
  apiStatus: ApiCartStatus
): CartStatus => {
  switch (apiStatus) {
    case "available":
      return "대기";
    case "in_use":
      return "사용중";
    case "maintenance":
      return "점검중";
    default:
      return "대기";
  }
};

/**
 * UI 카트 상태를 API 카트 상태로 변환
 */
export const mapCartStatusToApiStatus = (
  cartStatus: CartStatus
): ApiCartStatus => {
  switch (cartStatus) {
    case "대기":
      return "available";
    case "사용중":
      return "in_use";
    case "점검중":
    case "고장":
    case "사용불가":
      return "maintenance";
    default:
      return "available";
  }
};

/**
 * API 카트 데이터를 UI Cart 타입으로 변환
 */
export const mapApiCartToCart = (
  apiCart: ApiCartData,
  index: number = 0
): Cart => {
  return {
    id: apiCart.id,
    no: index + 1, // 순서 번호는 별도로 처리
    name: apiCart.name,
    status: apiCart.status_display, // status_display를 그대로 사용
    location: "일반", // API에 필드 정보가 없으므로 기본값
    golfCourseName: apiCart.golf_course.name,
    managerName: apiCart.current_caddie?.name || "미배정",
    batteryLevel: apiCart.battery_level,
    batteryStatus: apiCart.battery_status,
    isAvailable: apiCart.is_available,
    createdAt: apiCart.created_at || new Date().toISOString(),
    updatedAt: apiCart.updated_at || new Date().toISOString(),
  };
};

/**
 * API 카트 배열을 UI Cart 배열로 변환
 */
export const mapApiCartsToCartList = (apiCarts: ApiCartData[]): Cart[] => {
  return apiCarts.map((apiCart, index) => mapApiCartToCart(apiCart, index));
};

/**
 * API 카트 상세 응답을 UI CartDetail 타입으로 변환
 */
export const mapApiCartDetailToCartDetail = (
  apiCartDetailResponse: ApiCartDetailResponse
): CartDetail => {
  const apiCartDetail = apiCartDetailResponse.data;

  return {
    id: apiCartDetail.id,
    name: apiCartDetail.name,
    status: apiCartDetail.status_display, // status_display를 그대로 사용
    location: apiCartDetail.location || "", // location 필드 직접 사용
    managerName: apiCartDetail.manager?.name || "미배정",
    managerId: apiCartDetail.manager?.id,
    golfCourseName: apiCartDetail.golf_course.name,
    golfCourseId: apiCartDetail.golf_course.id,
    batteryLevel: apiCartDetail.battery_level,
    batteryStatus: apiCartDetail.battery_status,
    isAvailable: apiCartDetail.is_available,
    createdAt: apiCartDetail.created_at,
    updatedAt: apiCartDetail.updated_at,
  };
};

/**
 * API 카트 이력 아이템을 UI CartHistoryItem으로 변환
 */
export const mapApiCartHistoryToCartHistory = (
  apiHistory: ApiCartHistoryItem,
  index: number = 0
): CartHistoryItem => {
  return {
    id: apiHistory.id,
    no: index + 1,
    caddieName: apiHistory.caddie.name,
    caddieRole: apiHistory.caddie.role_display,
    usageDate: apiHistory.usage_date,
    startTime: apiHistory.start_time,
    endTime: apiHistory.end_time,
    duration: apiHistory.duration,
    isOngoing: apiHistory.is_ongoing,
    notes: apiHistory.notes || "",
    createdAt: apiHistory.created_at,
  };
};

/**
 * API 카트 이력 배열을 UI CartHistoryItem 배열로 변환
 */
export const mapApiCartHistoriesToCartHistories = (
  apiHistories: ApiCartHistoryItem[]
): CartHistoryItem[] => {
  return apiHistories.map((apiHistory, index) =>
    mapApiCartHistoryToCartHistory(apiHistory, index)
  );
};
