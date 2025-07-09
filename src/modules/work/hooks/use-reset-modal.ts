"use client";

import { useState } from "react";

export function useResetModal() {
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
    setIsResetModalOpen(false);
  };

  return {
    isResetModalOpen,
    openResetModal,
    closeResetModal,
    handleReset,
  };
}
