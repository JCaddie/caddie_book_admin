import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePagination } from "@/shared/hooks";
import { useTableData } from "@/shared/hooks/use-table-data";
import { ITEMS_PER_PAGE } from "@/shared/constants/caddie";
import {
  NewCaddieApplication,
  ModalType,
  NewCaddieActions,
  NewCaddieState,
} from "../types/new-caddie";
import { MOCK_NEW_CADDIE_APPLICATIONS } from "../constants/new-caddie";

interface UseNewCaddieManagementReturn
  extends NewCaddieState,
    NewCaddieActions {
  filteredApplications: NewCaddieApplication[];
  currentPage: number;
  totalPages: number;
  currentData: NewCaddieApplication[];
  paddedData: NewCaddieApplication[];
  pendingCount: number;
  handlePageChange: (page: number) => void;
  setIsApprovalModalOpen: (open: boolean) => void;
  setIsRejectModalOpen: (open: boolean) => void;
  setIsIndividualApprovalModalOpen: (open: boolean) => void;
  setIsIndividualRejectModalOpen: (open: boolean) => void;
}

export const useNewCaddieManagement = (): UseNewCaddieManagementReturn => {
  const router = useRouter();

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

  // 빈 행 템플릿
  const emptyRowTemplate: Omit<NewCaddieApplication, "id" | "isEmpty"> = {
    name: "",
    phone: "",
    email: "",
    requestDate: "",
    status: "pending",
  };

  // 테이블 데이터 패딩
  const { paddedData } = useTableData({
    data: currentData,
    itemsPerPage: ITEMS_PER_PAGE,
    emptyRowTemplate,
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

  // 승인/거절 핸들러들
  const handleBulkApprove = () => {
    if (modalType === "selected") {
      setApplications((apps) =>
        apps.map((app) =>
          selectedRowKeys.includes(app.id)
            ? { ...app, status: "approved" as const }
            : app
        )
      );
    } else {
      setApplications((apps) =>
        apps.map((app) => ({ ...app, status: "approved" as const }))
      );
    }
    setIsApprovalModalOpen(false);
    setSelectedRowKeys([]);
  };

  const handleBulkReject = () => {
    const idsToReject =
      modalType === "selected"
        ? selectedRowKeys
        : applications.map((app) => app.id);
    setApplications((apps) =>
      apps.map((app) =>
        idsToReject.includes(app.id)
          ? { ...app, status: "rejected" as const }
          : app
      )
    );
    setIsRejectModalOpen(false);
    setSelectedRowKeys([]);
  };

  const handleIndividualApprove = () => {
    setApplications((apps) =>
      apps.map((app) =>
        app.id === selectedCaddieId
          ? { ...app, status: "approved" as const }
          : app
      )
    );
    setIsIndividualApprovalModalOpen(false);
    setSelectedCaddieId("");
    setSelectedCaddieName("");
  };

  const handleIndividualReject = () => {
    setApplications((apps) =>
      apps.map((app) =>
        app.id === selectedCaddieId
          ? { ...app, status: "rejected" as const }
          : app
      )
    );
    setIsIndividualRejectModalOpen(false);
    setSelectedCaddieId("");
    setSelectedCaddieName("");
  };

  // 이벤트 핸들러들
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handlePageChange(1);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    handlePageChange(1);
  };

  const handleSelectChange = (keys: string[]) => {
    setSelectedRowKeys(keys);
  };

  const handleRowClick = (record: NewCaddieApplication) => {
    router.push(`/caddies/${record.id}`);
  };

  return {
    // 상태
    searchTerm,
    selectedRowKeys,
    applications,
    isApprovalModalOpen,
    isRejectModalOpen,
    modalType,
    isIndividualApprovalModalOpen,
    isIndividualRejectModalOpen,
    selectedCaddieId,
    selectedCaddieName,

    // 계산된 값들
    filteredApplications,
    currentPage,
    totalPages,
    currentData,
    paddedData,
    pendingCount,

    // 액션들
    setSearchTerm,
    setSelectedRowKeys,
    setApplications,
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
