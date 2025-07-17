import { UserRole } from "@/shared/types/user";

// 역할 매핑
export const ROLE_LABELS: Record<UserRole, string> = {
  MASTER: "마스터",
  ADMIN: "관리자",
  DEV: "개발자",
};

// 페이지네이션 상수
export const ITEMS_PER_PAGE = 20;

// 필터 옵션
export const ROLE_FILTER_OPTIONS = [
  { value: "", label: "권한" },
  { value: "MASTER", label: "마스터" },
  { value: "ADMIN", label: "관리자" },
];

// UI 상수
export const USER_TABLE_CONFIG = {
  containerWidth: "auto" as const,
  layout: "flexible" as const,
  className: "border-gray-200",
};
