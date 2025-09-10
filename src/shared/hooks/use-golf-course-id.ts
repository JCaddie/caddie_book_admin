"use client";

import { useEffect, useState } from "react";
import { cookieUtils } from "@/shared/lib/utils";
import { AUTH_CONSTANTS } from "@/shared/constants/auth";

/**
 * golf_course_id 쿠키를 관리하는 훅
 */
export const useGolfCourseId = () => {
  const [golfCourseId, setGolfCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 컴포넌트 마운트 시 쿠키에서 golf_course_id 확인
    const storedGolfCourseId = cookieUtils.get(
      AUTH_CONSTANTS.COOKIES.GOLF_COURSE_ID
    );
    setGolfCourseId(storedGolfCourseId);
    setIsLoading(false);
  }, []);

  const setGolfCourseIdCookie = (id: string) => {
    cookieUtils.set(
      AUTH_CONSTANTS.COOKIES.GOLF_COURSE_ID,
      id,
      AUTH_CONSTANTS.TOKEN.EXPIRES_DAYS
    );
    setGolfCourseId(id);
  };

  const clearGolfCourseId = () => {
    cookieUtils.remove(AUTH_CONSTANTS.COOKIES.GOLF_COURSE_ID);
    setGolfCourseId(null);
  };

  return {
    golfCourseId,
    isLoading,
    setGolfCourseId: setGolfCourseIdCookie,
    clearGolfCourseId,
  };
};

/**
 * golf_course_id를 가져오는 유틸리티 함수 (서버/클라이언트 모두에서 사용 가능)
 */
export const getGolfCourseId = (): string | null => {
  if (typeof window === "undefined") {
    // 서버 사이드에서는 쿠키를 직접 읽을 수 없으므로 null 반환
    return null;
  }

  return cookieUtils.get(AUTH_CONSTANTS.COOKIES.GOLF_COURSE_ID);
};

/**
 * golf_course_id가 있는지 확인하는 유틸리티 함수
 */
export const hasGolfCourseId = (): boolean => {
  return getGolfCourseId() !== null;
};
