"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { NewCaddieApplication } from "../../types";
import { REGISTRATION_STATUS } from "../../constants";
import {
  bulkApproveNewCaddies,
  bulkRejectNewCaddies,
  getNewCaddieList,
} from "../../api";

const PAGE_SIZE = 20;

export const useNewCaddieManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 검색어 읽기
  const searchTerm = searchParams.get("search") || "";

  // 상태 관리
  const [applications, setApplications] = useState<NewCaddieApplication[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isIndividualApprovalModalOpen, setIsIndividualApprovalModalOpen] =
    useState(false);
  const [isIndividualRejectModalOpen, setIsIndividualRejectModalOpen] =
    useState(false);
  const [selectedCaddieId, setSelectedCaddieId] = useState("");
  const [selectedCaddieName, setSelectedCaddieName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // API 응답 데이터를 UI 형태로 변환
  const transformApiData = useCallback(
    (apiData: NewCaddieApplication[]): NewCaddieApplication[] => {
      return apiData.map((item) => ({
        ...item,
        // 기존 호환성을 위해 추가 필드 매핑
        requestDate: item.created_at
          ? new Date(item.created_at)
              .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\./g, ".")
              .replace(/\s/g, "")
          : "",
        status:
          item.registration_status === REGISTRATION_STATUS.PENDING
            ? ("pending" as const)
            : item.registration_status === REGISTRATION_STATUS.APPROVED
            ? ("approved" as const)
            : ("rejected" as const),
      }));
    },
    []
  );

  // 데이터 로드 함수
  const loadData = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getNewCaddieList({
          search: searchTerm || undefined,
          page: page,
          page_size: PAGE_SIZE,
        });

        if (response.success && response.results) {
          const transformedData = transformApiData(response.results);
          setApplications(transformedData);
          setCurrentPage(response.page);
          setTotalPages(response.total_pages);
        } else {
          console.error("신규 캐디 목록 조회 실패:", response);
          setError("데이터를 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("API 호출 에러:", error);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, transformApiData]
  );

  // URL 파라미터 변경 시 데이터 리로드
  useEffect(() => {
    loadData(1);
  }, [loadData]);

  // 새로고침 함수
  const refreshData = useCallback(() => {
    loadData(currentPage);
  }, [loadData, currentPage]);

  // 현재 화면에 표시할 데이터
  const currentData = applications;

  // 필터링된 데이터 (승인 대기 + 거부된 캐디들)
  const filteredApplications = applications.filter(
    (app) =>
      app.registration_status === REGISTRATION_STATUS.PENDING ||
      app.registration_status === REGISTRATION_STATUS.REJECTED
  );

  // 승인 대기 개수
  const pendingCount = applications.filter(
    (app) => app.registration_status === REGISTRATION_STATUS.PENDING
  ).length;

  // 모달 열기 함수들
  const openApprovalModal = () => {
    setIsApprovalModalOpen(true);
  };

  const openRejectModal = () => {
    setIsRejectModalOpen(true);
  };

  const openIndividualApprovalModal = (id: string, name: string) => {
    setSelectedCaddieId(id);
    setSelectedCaddieName(name);
    setIsIndividualApprovalModalOpen(true);
  };

  const openIndividualRejectModal = (id: string, name: string) => {
    setSelectedCaddieId(id);
    setSelectedCaddieName(name);
    setIsIndividualRejectModalOpen(true);
  };

  // 일괄 승인 처리
  const handleBulkApprove = async () => {
    try {
      const response = await bulkApproveNewCaddies({
        user_ids: selectedRowKeys,
      });

      if (response.success) {
        console.log("일괄 승인 성공");
        setSelectedRowKeys([]);
        setIsApprovalModalOpen(false);
        refreshData();
      } else {
        console.error("일괄 승인 실패:", response);
      }
    } catch (error) {
      console.error("일괄 승인 에러:", error);
    }
  };

  // 일괄 거절 처리
  const handleBulkReject = async () => {
    try {
      const response = await bulkRejectNewCaddies({
        user_ids: selectedRowKeys,
        rejection_reason: "서류 미비",
      });

      if (response.success) {
        console.log("일괄 거절 성공");
        setSelectedRowKeys([]);
        setIsRejectModalOpen(false);
        refreshData();
      } else {
        console.error("일괄 거절 실패:", response);
      }
    } catch (error) {
      console.error("일괄 거절 에러:", error);
    }
  };

  // 개별 승인 처리
  const handleIndividualApprove = async () => {
    try {
      const response = await bulkApproveNewCaddies({
        user_ids: [selectedCaddieId],
      });

      if (response.success) {
        console.log("개별 승인 성공");
        setIsIndividualApprovalModalOpen(false);
        refreshData();
      } else {
        console.error("개별 승인 실패:", response);
      }
    } catch (error) {
      console.error("개별 승인 에러:", error);
    }
  };

  // 개별 거절 처리
  const handleIndividualReject = async () => {
    try {
      const response = await bulkRejectNewCaddies({
        user_ids: [selectedCaddieId],
        rejection_reason: "서류 미비",
      });

      if (response.success) {
        console.log("개별 거절 성공");
        setIsIndividualRejectModalOpen(false);
        refreshData();
      } else {
        console.error("개별 거절 실패:", response);
      }
    } catch (error) {
      console.error("개별 거절 에러:", error);
    }
  };

  // 선택 변경 처리
  const handleSelectChange = (keys: string[]) => {
    setSelectedRowKeys(keys);
  };

  // 행 클릭 처리
  const handleRowClick = (application: NewCaddieApplication) => {
    if (process.env.NODE_ENV === "development") {
      console.log("행 클릭:", application);
    }
    // 캐디 상세 페이지로 이동
    router.push(`/caddies/${application.id}`);
  };

  return {
    // 상태
    selectedRowKeys,
    applications: filteredApplications,
    currentData,
    pendingCount,
    isLoading,
    error,
    totalPages,

    // 모달 상태
    isApprovalModalOpen,
    isRejectModalOpen,
    isIndividualApprovalModalOpen,
    isIndividualRejectModalOpen,
    selectedCaddieName,

    // 액션 함수들
    openApprovalModal,
    openRejectModal,
    openIndividualApprovalModal,
    openIndividualRejectModal,
    handleBulkApprove,
    handleBulkReject,
    handleIndividualApprove,
    handleIndividualReject,
    handleSelectChange,
    handleRowClick,
    refreshData,

    // 모달 상태 변경
    setIsApprovalModalOpen,
    setIsRejectModalOpen,
    setIsIndividualApprovalModalOpen,
    setIsIndividualRejectModalOpen,
  };
};
