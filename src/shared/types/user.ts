// 사용자 권한 타입
export type UserRole = "MASTER" | "ADMIN";

// 사용자 정보 인터페이스
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  golfCourseId?: string; // 지점 권한인 경우 골프장 ID
  createdAt: Date;
  updatedAt: Date;
}

// 로그인 사용자 정보
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  golfCourseId?: string;
}
