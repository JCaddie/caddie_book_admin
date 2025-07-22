import { useCallback, useEffect, useState } from "react";
import { NewCaddieApplication } from "../types";
import { REGISTRATION_STATUS } from "../constants/new-caddie";
import {
  bulkApproveNewCaddies,
  bulkRejectNewCaddies,
  getNewCaddieList,
} from "../api/caddie-api";

// 페이지 사이즈 상수 정의
const PAGE_SIZE = 20;

export interface UseNewCaddieManagementReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRowKeys: string[];
  applications: NewCaddieApplication[];
  isApprovalModalOpen: boolean;
  isRejectModalOpen: boolean;
  isIndividualApprovalModalOpen: boolean;
  isIndividualRejectModalOpen: boolean;
  selectedCaddieId: string;
  selectedCaddieName: string;
  currentPage: number;
  totalPages: number;
  currentData: NewCaddieApplication[];
  pendingCount: number;
  isLoading: boolean;
  error: string | null;
  openApprovalModal: () => void;
  openRejectModal: () => void;
  openIndividualApprovalModal: (caddieId: string, caddieName: string) => void;
  openIndividualRejectModal: (caddieId: string, caddieName: string) => void;
  handleBulkApprove: () => void;
  handleBulkReject: () => void;
  handleIndividualApprove: () => void;
  handleIndividualReject: () => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchClear: () => void;
  handleSelectChange: (selectedRowKeys: string[]) => void;
  handleRowClick: (application: NewCaddieApplication) => void;
  handlePageChange: (page: number) => void;
  setIsApprovalModalOpen: (open: boolean) => void;
  setIsRejectModalOpen: (open: boolean) => void;
  setIsIndividualApprovalModalOpen: (open: boolean) => void;
  setIsIndividualRejectModalOpen: (open: boolean) => void;
  refreshData: () => void;
}

/**
 * API 응답 데이터를 기존 형태로 변환하는 함수
 */
const transformApiData = (
  apiData: NewCaddieApplication
): NewCaddieApplication => {
  return {
    ...apiData,
    // 기존 호환성을 위한 변환
    requestDate: apiData.created_at
      ? new Date(apiData.created_at)
          .toLocaleDateString("ko-KR")
          .replace(/\./g, ".")
      : "",
    status:
      apiData.registration_status === REGISTRATION_STATUS.PENDING
        ? "pending"
        : apiData.registration_status === REGISTRATION_STATUS.APPROVED
        ? "approved"
        : apiData.registration_status === REGISTRATION_STATUS.REJECTED
        ? "rejected"
        : "pending",
  };
};

export const useNewCaddieManagement = (): UseNewCaddieManagementReturn => {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [applications, setApplications] = useState<NewCaddieApplication[]>([]);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isIndividualApprovalModalOpen, setIsIndividualApprovalModalOpen] =
    useState(false);
  const [isIndividualRejectModalOpen, setIsIndividualRejectModalOpen] =
    useState(false);
  const [selectedCaddieId, setSelectedCaddieId] = useState<string>("");
  const [selectedCaddieName, setSelectedCaddieName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 데이터 로딩 함수
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

        const transformedData = response.results.map(transformApiData);
        setApplications(transformedData);
        setTotalPages(response.total_pages);
        setCurrentPage(page);
      } catch (err) {
        console.error("신규 캐디 목록 로딩 실패:", err);
        setError(
          err instanceof Error ? err.message : "데이터 로딩에 실패했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm]
  );

  // 데이터 새로고침 함수
  const refreshData = useCallback(() => {
    loadData(currentPage);
  }, [loadData, currentPage]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (page: number) => {
      loadData(page);
    },
    [loadData]
  );

  // 초기 데이터 로딩 및 검색어 변경 시 재로딩
  useEffect(() => {
    loadData(1); // 검색어 변경 시 첫 페이지로 이동
  }, [searchTerm]); // loadData 의존성 제거 (무한 루프 방지)

  // 승인 대기 및 거부된 캐디 표시 (승인된 것은 제외)
  const filteredApplications = applications.filter(
    (app) =>
      app.registration_status === REGISTRATION_STATUS.PENDING ||
      app.registration_status === REGISTRATION_STATUS.REJECTED
  );

  // 페이지네이션 (서버 페이지네이션 사용하므로 클라이언트 페이지네이션 사용 안함)
  const currentData = filteredApplications;

  // 대기 중인 신청 수 (PENDING 상태만 카운트)
  const pendingCount = applications.filter(
    (app) => app.registration_status === REGISTRATION_STATUS.PENDING
  ).length;

  // 모달 관리 함수들
  const openApprovalModal = () => {
    setIsApprovalModalOpen(true);
  };

  const openRejectModal = () => {
    setIsRejectModalOpen(true);
  };

  const openIndividualApprovalModal = (
    caddieId: string,
    caddieName: string
  ) => {
    setSelectedCaddieId(caddieId);
    setSelectedCaddieName(caddieName);
    setIsIndividualApprovalModalOpen(true);
  };

  const openIndividualRejectModal = (caddieId: string, caddieName: string) => {
    setSelectedCaddieId(caddieId);
    setSelectedCaddieName(caddieName);
    setIsIndividualRejectModalOpen(true);
  };

  // 일괄 승인 핸들러 - 이제 항상 선택된 캐디만 처리
  const handleBulkApprove = async () => {
    try {
      setIsLoading(true);

      // 선택된 캐디만 승인
      const userIds = selectedRowKeys;

      if (userIds.length > 0) {
        await bulkApproveNewCaddies({ user_ids: userIds });

        if (process.env.NODE_ENV === "development") {
          console.log("선택된 신청 승인 완료:", userIds);
        }

        // 데이터 새로고침
        await refreshData();
      }
    } catch (err) {
      console.error("승인 처리 실패:", err);
      setError(
        err instanceof Error ? err.message : "승인 처리에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
      setIsApprovalModalOpen(false);
      setSelectedRowKeys([]);
    }
  };

  // 일괄 거절 핸들러 - 이제 항상 선택된 캐디만 처리
  const handleBulkReject = async () => {
    try {
      setIsLoading(true);

      // 선택된 캐디만 거절
      const userIds = selectedRowKeys;

      if (userIds.length > 0) {
        await bulkRejectNewCaddies({
          user_ids: userIds,
          rejection_reason: "관리자 승인 거절",
        });

        if (process.env.NODE_ENV === "development") {
          console.log("선택된 신청 거절 완료:", userIds);
        }

        // 데이터 새로고침
        await refreshData();
      }
    } catch (err) {
      console.error("거절 처리 실패:", err);
      setError(
        err instanceof Error ? err.message : "거절 처리에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
      setIsRejectModalOpen(false);
      setSelectedRowKeys([]);
    }
  };

  // 개별 승인 핸들러
  const handleIndividualApprove = async () => {
    try {
      setIsLoading(true);

      await bulkApproveNewCaddies({ user_ids: [selectedCaddieId] });

      if (process.env.NODE_ENV === "development") {
        console.log("개별 승인 완료:", selectedCaddieId, selectedCaddieName);
      }

      // 데이터 새로고침
      await refreshData();
    } catch (err) {
      console.error("개별 승인 실패:", err);
      setError(
        err instanceof Error ? err.message : "승인 처리에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
      setIsIndividualApprovalModalOpen(false);
      setSelectedCaddieId("");
      setSelectedCaddieName("");
    }
  };

  // 개별 거절 핸들러
  const handleIndividualReject = async () => {
    try {
      setIsLoading(true);

      await bulkRejectNewCaddies({
        user_ids: [selectedCaddieId],
        rejection_reason: "관리자 개별 거절",
      });

      if (process.env.NODE_ENV === "development") {
        console.log("개별 거절 완료:", selectedCaddieId, selectedCaddieName);
      }

      // 데이터 새로고침
      await refreshData();
    } catch (err) {
      console.error("개별 거절 실패:", err);
      setError(
        err instanceof Error ? err.message : "거절 처리에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
      setIsIndividualRejectModalOpen(false);
      setSelectedCaddieId("");
      setSelectedCaddieName("");
    }
  };

  // 검색 변경 핸들러 (debounce 적용하면 더 좋음)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 검색 초기화 핸들러
  const handleSearchClear = () => {
    setSearchTerm("");
  };

  // 선택 변경 핸들러
  const handleSelectChange = (selectedRowKeys: string[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  // 행 클릭 핸들러
  const handleRowClick = (application: NewCaddieApplication) => {
    if (process.env.NODE_ENV === "development") {
      console.log("행 클릭:", application);
    }
    // 필요시 상세 페이지로 이동
    // router.push(`/caddies/new/${application.id}`);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedRowKeys,
    applications,
    isApprovalModalOpen,
    isRejectModalOpen,
    isIndividualApprovalModalOpen,
    isIndividualRejectModalOpen,
    selectedCaddieId,
    selectedCaddieName,
    currentPage,
    totalPages,
    currentData,
    pendingCount,
    isLoading,
    error,
    openApprovalModal,
    openRejectModal,
    openIndividualApprovalModal,
    openIndividualRejectModal,
    handleBulkApprove,
    handleBulkReject,
    handleIndividualApprove,
    handleIndividualReject,
    handleSearchChange,
    handleSearchClear,
    handleSelectChange,
    handleRowClick,
    handlePageChange,
    setIsApprovalModalOpen,
    setIsRejectModalOpen,
    setIsIndividualApprovalModalOpen,
    setIsIndividualRejectModalOpen,
    refreshData,
  };
};
