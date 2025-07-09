"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/shared/components/layout";
import {
  Button,
  SelectableDataTable,
  Search,
  Pagination,
  Badge,
  DeleteConfirmationModal,
} from "@/shared/components/ui";
import { Column } from "@/shared/types/table";
import { usePagination } from "@/shared/hooks";
import { useTableData, TableItem } from "@/shared/hooks/use-table-data";
import { ITEMS_PER_PAGE } from "@/shared/constants/caddie";

// 신규 캐디 신청 데이터 타입
interface NewCaddieApplication extends TableItem {
  name: string;
  phone: string;
  email: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
}

// 모의 데이터
const mockApplications: NewCaddieApplication[] = [
  {
    id: "1",
    name: "홍길동",
    phone: "010-1234-5678",
    email: "abd@test.com",
    requestDate: "2025.05.06",
    status: "pending",
  },
  {
    id: "2",
    name: "김철수",
    phone: "010-1234-5679",
    email: "kim@test.com",
    requestDate: "2025.05.07",
    status: "pending",
  },
  {
    id: "3",
    name: "박영희",
    phone: "010-1234-5680",
    email: "park@test.com",
    requestDate: "2025.05.08",
    status: "pending",
  },
  {
    id: "4",
    name: "이민수",
    phone: "010-1234-5681",
    email: "lee@test.com",
    requestDate: "2025.05.09",
    status: "pending",
  },
  {
    id: "5",
    name: "정수영",
    phone: "010-1234-5682",
    email: "jung@test.com",
    requestDate: "2025.05.10",
    status: "pending",
  },
  {
    id: "6",
    name: "강민호",
    phone: "010-1234-5683",
    email: "kang@test.com",
    requestDate: "2025.05.11",
    status: "pending",
  },
  {
    id: "7",
    name: "조은영",
    phone: "010-1234-5684",
    email: "cho@test.com",
    requestDate: "2025.05.12",
    status: "pending",
  },
  {
    id: "8",
    name: "윤상현",
    phone: "010-1234-5685",
    email: "yoon@test.com",
    requestDate: "2025.05.13",
    status: "pending",
  },
  {
    id: "9",
    name: "최지혜",
    phone: "010-1234-5686",
    email: "choi@test.com",
    requestDate: "2025.05.14",
    status: "pending",
  },
  {
    id: "10",
    name: "임태현",
    phone: "010-1234-5687",
    email: "lim@test.com",
    requestDate: "2025.05.15",
    status: "pending",
  },
  {
    id: "11",
    name: "신미경",
    phone: "010-1234-5688",
    email: "shin@test.com",
    requestDate: "2025.05.16",
    status: "pending",
  },
  {
    id: "12",
    name: "노준호",
    phone: "010-1234-5689",
    email: "noh@test.com",
    requestDate: "2025.05.17",
    status: "pending",
  },
  {
    id: "13",
    name: "배소희",
    phone: "010-1234-5690",
    email: "bae@test.com",
    requestDate: "2025.05.18",
    status: "pending",
  },
  {
    id: "14",
    name: "황동욱",
    phone: "010-1234-5691",
    email: "hwang@test.com",
    requestDate: "2025.05.19",
    status: "pending",
  },
  {
    id: "15",
    name: "손민재",
    phone: "010-1234-5692",
    email: "son@test.com",
    requestDate: "2025.05.20",
    status: "pending",
  },
  {
    id: "16",
    name: "전현우",
    phone: "010-1234-5693",
    email: "jeon@test.com",
    requestDate: "2025.05.21",
    status: "pending",
  },
  {
    id: "17",
    name: "류서연",
    phone: "010-1234-5694",
    email: "ryu@test.com",
    requestDate: "2025.05.22",
    status: "pending",
  },
  {
    id: "18",
    name: "백준영",
    phone: "010-1234-5695",
    email: "baek@test.com",
    requestDate: "2025.05.23",
    status: "pending",
  },
  {
    id: "19",
    name: "문지원",
    phone: "010-1234-5696",
    email: "moon@test.com",
    requestDate: "2025.05.24",
    status: "pending",
  },
  {
    id: "20",
    name: "남태우",
    phone: "010-1234-5697",
    email: "nam@test.com",
    requestDate: "2025.05.25",
    status: "pending",
  },
  {
    id: "21",
    name: "서정민",
    phone: "010-1234-5698",
    email: "seo@test.com",
    requestDate: "2025.05.26",
    status: "pending",
  },
  {
    id: "22",
    name: "오수빈",
    phone: "010-1234-5699",
    email: "oh@test.com",
    requestDate: "2025.05.27",
    status: "pending",
  },
];

export default function NewCaddiePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [applications, setApplications] = useState(mockApplications);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"all" | "selected">("all");
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

  // 페이지네이션 훅 사용
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

  const pendingCount = applications.filter(
    (app) => app.status === "pending"
  ).length;

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

  const openApprovalModal = (type: "all" | "selected") => {
    setModalType(type);
    setIsApprovalModalOpen(true);
  };

  const openRejectModal = (type: "all" | "selected") => {
    setModalType(type);
    setIsRejectModalOpen(true);
  };

  const handleSelectChange = (keys: string[]) => {
    setSelectedRowKeys(keys);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handlePageChange(1); // 검색 시 첫 페이지로 이동
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    handlePageChange(1);
  };

  // 행 클릭 핸들러 (상세 페이지로 이동)
  const handleRowClick = (record: NewCaddieApplication) => {
    router.push(`/caddies/${record.id}`);
  };

  // 테이블 컬럼 정의
  const columns: Column<NewCaddieApplication>[] = [
    {
      key: "name",
      title: "이름",
      width: 240,
      align: "center",
      render: (value, record) => {
        if (record.isEmpty) return null;
        return (
          <Link
            href={`/caddies/${record.id}`}
            className="text-gray-800 hover:text-blue-600 hover:underline cursor-pointer"
          >
            {value as string}
          </Link>
        );
      },
    },
    {
      key: "phone",
      title: "연락처",
      flex: true,
      align: "center",
      render: (value, record) => {
        if (record.isEmpty) return null;
        return <span className="text-gray-800">{value as string}</span>;
      },
    },
    {
      key: "email",
      title: "이메일",
      flex: true,
      align: "center",
      render: (value, record) => {
        if (record.isEmpty) return null;
        return <span className="text-gray-800">{value as string}</span>;
      },
    },
    {
      key: "requestDate",
      title: "요청일자",
      flex: true,
      align: "center",
      render: (value, record) => {
        if (record.isEmpty) return null;
        return <span className="text-gray-800">{value as string}</span>;
      },
    },
    {
      key: "actions",
      title: "",
      width: 136,
      align: "center",
      render: (_, record) => {
        if (record.isEmpty) return null;
        return (
          <div className="flex items-center gap-1 h-8">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openIndividualApprovalModal(record.id, record.name);
              }}
              disabled={record.status !== "pending"}
              className="h-6 px-2 text-xs min-w-[36px]"
            >
              승인
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openIndividualRejectModal(record.id, record.name);
              }}
              disabled={record.status !== "pending"}
              className="h-6 px-2 text-xs min-w-[36px]"
            >
              거절
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="신규 캐디" />

      <div className="flex flex-col gap-2">
        {/* 상단 영역 */}
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">신규</span>
            <Badge variant="orange">{pendingCount}</Badge>
          </div>

          <div className="flex items-center gap-8">
            {/* 검색 */}
            <div className="w-[400px]">
              <Search
                placeholder="캐디 검색"
                value={searchTerm}
                onChange={handleSearchChange}
                onClear={handleSearchClear}
              />
            </div>

            {/* 버튼 */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => openRejectModal("selected")}
                disabled={selectedRowKeys.length === 0}
              >
                거절
              </Button>
              <Button onClick={() => openApprovalModal("all")}>
                모두 승인
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SelectableDataTable
            columns={columns}
            data={paddedData}
            realDataCount={currentData.length}
            selectable={true}
            selectedRowKeys={selectedRowKeys}
            onSelectChange={handleSelectChange}
            onRowClick={handleRowClick}
            rowKey="id"
            layout="flexible"
            emptyText="신규 캐디 신청이 없습니다"
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* 모달 */}
      <DeleteConfirmationModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={handleBulkApprove}
        title="승인하시겠습니까?"
        message={
          modalType === "selected"
            ? `선택한 ${selectedRowKeys.length}명의 캐디를 승인하시겠습니까?`
            : "모든 캐디를 승인하시겠습니까?"
        }
        confirmText="승인"
        cancelText="취소"
      />

      <DeleteConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleBulkReject}
        title="거절하시겠습니까?"
        message={
          modalType === "selected"
            ? `선택한 ${selectedRowKeys.length}명의 캐디를 거절하시겠습니까?`
            : "모든 캐디를 거절하시겠습니까?"
        }
        confirmText="거절"
        cancelText="취소"
      />

      {/* 개별 승인 모달 */}
      <DeleteConfirmationModal
        isOpen={isIndividualApprovalModalOpen}
        onClose={() => setIsIndividualApprovalModalOpen(false)}
        onConfirm={handleIndividualApprove}
        title="승인하시겠습니까?"
        message={`${selectedCaddieName}님을 승인하시겠습니까?`}
        confirmText="승인"
        cancelText="취소"
      />

      {/* 개별 거절 모달 */}
      <DeleteConfirmationModal
        isOpen={isIndividualRejectModalOpen}
        onClose={() => setIsIndividualRejectModalOpen(false)}
        onConfirm={handleIndividualReject}
        title="거절하시겠습니까?"
        message={`${selectedCaddieName}님을 거절하시겠습니까?`}
        confirmText="거절"
        cancelText="취소"
      />
    </div>
  );
}
