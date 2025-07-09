"use client";

import { useEffect } from "react";

interface UseDocumentTitleOptions {
  title: string;
  suffix?: string;
}

/**
 * 페이지별 동적 타이틀 설정 훅
 * @param options - 타이틀 설정 옵션
 */
export const useDocumentTitle = ({
  title,
  suffix = "캐디북 관리자",
}: UseDocumentTitleOptions) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | ${suffix}`;

    // 컴포넌트 언마운트 시 원래 타이틀로 복원
    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
};

/**
 * 사전 정의된 페이지 타이틀들
 */
export const PAGE_TITLES = {
  DASHBOARD: "대시보드",
  CADDIES: "캐디 관리",
  CADDIE_DETAIL: "캐디 상세",
  CADDIE_NEW: "신규 캐디 등록",
  WORKS: "근무 관리",
  WORK_DETAIL: "근무 상세",
  FIELDS: "필드 관리",
  FIELD_DETAIL: "필드 상세",
  CARTS: "카트 관리",
  CART_DETAIL: "카트 상세",
  GOLF_COURSES: "골프장 관리",
  GOLF_COURSE_DETAIL: "골프장 상세",
  GOLF_COURSE_EDIT: "골프장 정보 수정",
  USERS: "관리자 관리",
  USER_DETAIL: "관리자 상세",
  ANNOUNCEMENTS: "공지사항 관리",
  LOGIN: "로그인",
} as const;
