import { useState } from "react";
import { NewCaddieApplication } from "../types";
import { MOCK_NEW_CADDIE_APPLICATIONS } from "../constants/new-caddie";
import { usePagination } from "@/shared/hooks";
import { ITEMS_PER_PAGE } from "@/shared/constants/caddie";

export type ModalType = "all" | "selected";

export interface UseNewCaddieManagementReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRowKeys: string[];
  applications: NewCaddieApplication[];
  isApprovalModalOpen: boolean;
  isRejectModalOpen: boolean;
  modalType: ModalType;
  isIndividualApprovalModalOpen: boolean;
  isIndividualRejectModalOpen: boolean;
  selectedCaddieId: string;
  selectedCaddieName: string;
  currentPage: number;
  totalPages: number;
  currentData: NewCaddieApplication[];
  pendingCount: number;
  openApprovalModal: (type: ModalType) => void;
  openRejectModal: (type: ModalType) => void;
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
}

export const useNewCaddieManagement = (): UseNewCaddieManagementReturn => {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [applications, setApplications] = useState<NewCaddieApplication[]>(
    MOCK_NEW_CADDIE_APPLICATIONS
  );
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("all");
  const [isIndividualApprovalModalOpen, setIsIndividualApprovalModalOpen] =
    useState(false);
  const [isIndividualRejectModalOpen, setIsIndividualRejectModalOpen] =
    useState(false);
  const [selectedCaddieId, setSelectedCaddieId] = useState<string>("");
  const [selectedCaddieName, setSelectedCaddieName] = useState<string>("");

  // 검색 필터링
  const filteredApplications = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredApplications,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  // 대기 중인 신청 수
  const pendingCount = applications.filter(
    (app) => app.status === "pending"
  ).length;

  // 모달 관리 함수들
  const openApprovalModal = (type: ModalType) => {
    setModalType(type);
    setIsApprovalModalOpen(true);
  };

  const openRejectModal = (type: ModalType) => {
    setModalType(type);
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

  // 일괄 승인 핸들러
  const handleBulkApprove = () => {
    if (modalType === "all") {
      const pendingApplications = applications.filter(
        (app) => app.status === "pending"
      );
      setApplications((prev) =>
        prev.map((app) =>
          app.status === "pending" ? { ...app, status: "approved" } : app
        )
      );
      console.log("모든 대기 중인 신청 승인:", pendingApplications);
    } else {
      const selectedApplications = applications.filter((app) =>
        selectedRowKeys.includes(app.id)
      );
      setApplications((prev) =>
        prev.map((app) =>
          selectedRowKeys.includes(app.id)
            ? { ...app, status: "approved" }
            : app
        )
      );
      console.log("선택된 신청 승인:", selectedApplications);
    }
    setIsApprovalModalOpen(false);
    setSelectedRowKeys([]);
  };

  // 일괄 반려 핸들러
  const handleBulkReject = () => {
    if (modalType === "all") {
      const pendingApplications = applications.filter(
        (app) => app.status === "pending"
      );
      setApplications((prev) =>
        prev.map((app) =>
          app.status === "pending" ? { ...app, status: "rejected" } : app
        )
      );
      console.log("모든 대기 중인 신청 반려:", pendingApplications);
    } else {
      const selectedApplications = applications.filter((app) =>
        selectedRowKeys.includes(app.id)
      );
      setApplications((prev) =>
        prev.map((app) =>
          selectedRowKeys.includes(app.id)
            ? { ...app, status: "rejected" }
            : app
        )
      );
      console.log("선택된 신청 반려:", selectedApplications);
    }
    setIsRejectModalOpen(false);
    setSelectedRowKeys([]);
  };

  // 개별 승인 핸들러
  const handleIndividualApprove = () => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedCaddieId ? { ...app, status: "approved" } : app
      )
    );
    console.log("개별 승인:", selectedCaddieId, selectedCaddieName);
    setIsIndividualApprovalModalOpen(false);
    setSelectedCaddieId("");
    setSelectedCaddieName("");
  };

  // 개별 반려 핸들러
  const handleIndividualReject = () => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedCaddieId ? { ...app, status: "rejected" } : app
      )
    );
    console.log("개별 반려:", selectedCaddieId, selectedCaddieName);
    setIsIndividualRejectModalOpen(false);
    setSelectedCaddieId("");
    setSelectedCaddieName("");
  };

  // 검색 변경 핸들러
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
    console.log("행 클릭:", application);
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
    modalType,
    isIndividualApprovalModalOpen,
    isIndividualRejectModalOpen,
    selectedCaddieId,
    selectedCaddieName,
    currentPage,
    totalPages,
    currentData,
    pendingCount,
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
  };
};
