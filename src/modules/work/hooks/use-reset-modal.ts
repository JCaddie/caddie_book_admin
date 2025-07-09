"use client";

import { useState } from "react";
import { formatDateForApi } from "../utils/work-detail-utils";

export function useResetModal(golfCourseId: string, currentDate: Date) {
  // 초기화 모달 상태 관리
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // 초기화 모달 열기
  const openResetModal = () => {
    setIsResetModalOpen(true);
  };

  // 초기화 모달 닫기
  const closeResetModal = () => {
    setIsResetModalOpen(false);
  };

  // 초기화 확인 함수
  const handleReset = () => {
    // 실제 초기화 로직 구현
    console.log(
      "초기화 실행 - 골프장 ID:",
      golfCourseId,
      "날짜:",
      formatDateForApi(currentDate)
    );
    setIsResetModalOpen(false);
  };

  return {
    isResetModalOpen,
    openResetModal,
    closeResetModal,
    handleReset,
  };
}
