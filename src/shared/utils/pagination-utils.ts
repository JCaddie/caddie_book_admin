/**
 * 페이지네이션된 데이터에 번호를 추가하는 유틸리티
 */
export const addNumberToItems = <T extends Record<string, any>>(
  items: T[],
  currentPage: number,
  itemsPerPage: number,
  totalCount?: number
): (T & { no: number })[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;

  return items.map((item, index) => ({
    ...item,
    no: startIndex + index + 1,
  }));
};

/**
 * 역순 번호 매기기 (최신 순)
 */
export const addReverseNumberToItems = <T extends Record<string, any>>(
  items: T[],
  currentPage: number,
  itemsPerPage: number,
  totalCount: number
): (T & { no: number })[] => {
  const startIndex = totalCount - (currentPage - 1) * itemsPerPage;

  return items.map((item, index) => ({
    ...item,
    no: startIndex - index,
  }));
};

/**
 * 페이지네이션 메타데이터 타입
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * 페이지네이션 메타데이터 생성
 */
export const createPaginationMeta = (
  currentPage: number,
  totalCount: number,
  itemsPerPage: number
): PaginationMeta => {
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return {
    currentPage,
    totalPages,
    totalCount,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};
