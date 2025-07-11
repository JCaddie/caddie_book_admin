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
  // 공통
  DASHBOARD: "대시보드",

  // 캐디 관리
  CADDIES: "캐디 리스트",
  CADDIE_DETAIL: "캐디 상세",
  NEW_CADDIE: "신규 캐디",
  GROUP_STATUS: "그룹현황",

  // 근무 관리
  WORKS: "근무 일정",
  WORK_DETAIL: "근무 상세",
  VACATION: "휴무관리",
  VACATION_DETAIL: "휴무 상세",

  // 필드 관리
  FIELDS: "필드",

  // 카트 관리
  CARTS: "카트",
  CART_DETAIL: "카트 상세",

  // 공지사항
  ANNOUNCEMENTS: "공지사항",
  ANNOUNCEMENT_DETAIL: "공지사항 상세",
  ANNOUNCEMENT_CREATE: "공지사항 작성",
  ANNOUNCEMENT_EDIT: "공지사항 수정",

  // 사용자 관리
  USERS: "관리자",
  USER_DETAIL: "관리자 상세",

  // 골프장 관리
  GOLF_COURSES: "골프장",
  GOLF_COURSE_DETAIL: "골프장 상세",
  GOLF_COURSE_EDIT: "골프장 정보 수정",
} as const;
