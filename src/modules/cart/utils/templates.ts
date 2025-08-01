import { Cart, CartDetail } from "../types";

/**
 * 빈 카트 행 템플릿 생성
 */
export const createEmptyCartTemplate = (): Omit<Cart, "id"> => ({
  no: 0,
  name: "",
  status: "대기",
  location: "",
  golfCourseName: "",
  managerName: "",
  batteryLevel: 0,
  batteryStatus: "",
  isAvailable: false,
  createdAt: "",
  updatedAt: "",
  isEmpty: true,
});

/**
 * 카트 상세 정보 기본 템플릿 생성
 */
export const createCartDetailTemplate = (cartId: string): CartDetail => {
  return {
    id: cartId,
    name: "",
    status: "대기",
    location: "",
    managerName: "",
    golfCourseName: "",
    golfCourseId: "",
    batteryLevel: 0,
    batteryStatus: "",
    isAvailable: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
