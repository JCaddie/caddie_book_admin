/**
 * 사용자 데이터 변환 유틸리티
 */

import { User, UserListApiResponse } from "../types";

/**
 * API 응답을 사용자 목록으로 변환
 */
export function transformUserListResponse(apiResponse: UserListApiResponse): {
  users: User[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
} {
  const { data } = apiResponse;

  return {
    users: data.results,
    totalCount: data.count,
    totalPages: data.total_pages,
    currentPage: data.page,
  };
}

/**
 * 사용자 목록에 번호 추가
 */
export function addNumberToUsers(
  users: User[],
  currentPage: number,
  pageSize: number
): User[] {
  return users.map((user, index) => ({
    ...user,
    no: (currentPage - 1) * pageSize + index + 1,
  }));
}

/**
 * 사용자 검색
 */
export function searchUsers(users: User[], searchTerm: string): User[] {
  if (!searchTerm.trim()) {
    return users;
  }

  const term = searchTerm.toLowerCase().trim();

  return users.filter((user) => {
    return (
      user.username.toLowerCase().includes(term) ||
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phone.toLowerCase().includes(term) ||
      user.role_display.toLowerCase().includes(term)
    );
  });
}

/**
 * 사용자 역할별 필터링
 */
export function filterUsersByRole(users: User[], role: string): User[] {
  if (!role || role === "ALL") {
    return users;
  }

  return users.filter((user) => user.role === role);
}

/**
 * 사용자 정렬
 */
export function sortUsers(
  users: User[],
  sortField: keyof User = "created_at",
  sortOrder: "asc" | "desc" = "desc"
): User[] {
  return [...users].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === "asc" ? comparison : -comparison;
    }

    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      const comparison = Number(aValue) - Number(bValue);
      return sortOrder === "asc" ? comparison : -comparison;
    }

    return 0;
  });
}
