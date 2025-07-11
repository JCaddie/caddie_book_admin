"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentDate } from "../utils/work-detail-utils";

export function useDateNavigation(golfCourseId: string, dateParam?: string) {
  const router = useRouter();

  // 날짜 상태 관리
  const initialDate = dateParam ? new Date(dateParam) : new Date();
  const [currentDate, setCurrentDate] = useState(initialDate);

  // 날짜가 없을 때 기본값으로 리다이렉트
  useEffect(() => {
    if (!dateParam) {
      router.replace(`/works/${golfCourseId}?date=${getCurrentDate()}`);
    }
  }, [dateParam, golfCourseId, router]);

  // 날짜 변경 시 currentDate 업데이트
  useEffect(() => {
    if (dateParam) {
      setCurrentDate(new Date(dateParam));
    }
  }, [dateParam]);

  // 날짜 변경 함수
  const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);

    const dateString = newDate.toISOString().split("T")[0];
    router.push(`/works/${golfCourseId}?date=${dateString}`);
  };

  return {
    currentDate,
    handleDateChange,
  };
}
