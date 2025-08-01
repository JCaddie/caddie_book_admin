/**
 * 사용자 데이터 변환 유틸리티
 */

import { User } from "../types";

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
