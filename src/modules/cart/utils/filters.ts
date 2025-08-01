import { Cart, CartFilters } from "../types";
import { isMatchingAnyField } from "@/shared/lib/data-utils";

/**
 * 카트 필터링
 */
export const filterCarts = (carts: Cart[], filters: CartFilters): Cart[] => {
  return carts.filter((cart) => {
    // 검색어 필터
    const searchFields: (keyof Cart)[] = [
      "name",
      "location",
      "golfCourseName",
      "managerName",
    ];
    const matchesSearch = isMatchingAnyField(
      cart,
      filters.searchTerm,
      searchFields
    );

    // 상태 필터
    const matchesStatus = !filters.status || cart.status === filters.status;

    // 골프장 필터
    const matchesGolfCourse =
      !filters.golfCourseId || cart.golfCourseName === filters.golfCourseId;

    // 필드 필터
    const matchesField = !filters.fieldId || cart.location === filters.fieldId;

    return matchesSearch && matchesStatus && matchesGolfCourse && matchesField;
  });
};
