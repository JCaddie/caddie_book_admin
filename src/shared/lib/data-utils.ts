/**
 * 공통 데이터 유틸리티 함수들
 */

// 랜덤 값 선택 유틸리티
export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// 랜덤 범위 값 생성
export const getRandomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 랜덤 날짜 생성 (과거 날짜)
export const getRandomPastDate = (daysAgo: number = 365): string => {
  const now = Date.now();
  const randomTime = Math.random() * daysAgo * 24 * 60 * 60 * 1000;
  return new Date(now - randomTime).toISOString();
};

// 문자열 검색 매칭 함수
export const isMatchingSearch = (text: string, searchTerm: string): boolean => {
  if (!searchTerm.trim()) return true;
  return text.toLowerCase().includes(searchTerm.toLowerCase());
};

// 여러 필드에서 검색어 매칭
export const isMatchingAnyField = <T extends Record<string, unknown>>(
  item: T,
  searchTerm: string,
  searchFields: (keyof T)[]
): boolean => {
  if (!searchTerm.trim()) return true;

  return searchFields.some((field) => {
    const value = item[field];
    if (typeof value === "string") {
      return isMatchingSearch(value, searchTerm);
    }
    return false;
  });
};

// 빈 행 생성 유틸리티
export const createPaddedData = <
  T extends Record<string, unknown> & { id: string }
>(
  data: T[],
  targetCount: number,
  emptyRowTemplate: Omit<T, "id">
): T[] => {
  const paddingCount = Math.max(0, targetCount - data.length);
  const emptyRows = Array.from(
    { length: paddingCount },
    (_, index) =>
      ({
        ...emptyRowTemplate,
        id: `empty-${index}`,
      } as unknown)
  ) as T[];

  return [...data, ...emptyRows];
};

// API 호출 시뮬레이션 지연
export const simulateApiDelay = (ms: number = 1000): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 배열 요소 순환 선택 (인덱스 기반)
export const getCyclicItem = <T>(array: T[], index: number): T => {
  return array[index % array.length];
};

// 고유 ID 생성
export const generateId = (prefix: string = "item"): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
