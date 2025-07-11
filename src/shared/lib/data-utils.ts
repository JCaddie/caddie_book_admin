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

// 문자열 검색 매칭 함수
export const isMatchingSearch = (text: string, searchTerm: string): boolean => {
  if (!searchTerm.trim()) return true;
  return text.toLowerCase().includes(searchTerm.toLowerCase());
};

// 필터링 헬퍼 함수
export const isMatchingAnyField = <T extends Record<string, unknown>>(
  record: T,
  searchTerm: string,
  searchFields: (keyof T)[]
): boolean => {
  if (!searchTerm) return true;

  const lowerSearchTerm = searchTerm.toLowerCase();
  return searchFields.some((field) => {
    const value = record[field];
    return (
      typeof value === "string" && value.toLowerCase().includes(lowerSearchTerm)
    );
  });
};

// 날짜 관련 헬퍼 함수
export const getRandomDate = (maxDaysAgo: number): Date => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * maxDaysAgo);
  const randomDate = new Date(now);
  randomDate.setDate(now.getDate() - daysAgo);
  return randomDate;
};

export const getRandomPastDate = (maxDaysAgo: number): string => {
  return getRandomDate(maxDaysAgo).toISOString();
};

// 배열 관련 헬퍼 함수
export const getCyclicItem = <T>(array: T[], index: number): T => {
  return array[index % array.length];
};

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// API 호출 시뮬레이션 지연
export const simulateApiDelay = (ms: number = 1000): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 고유 ID 생성
export const generateId = (prefix: string = "item"): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
