"use client";

import React from "react";
import { AdminPageHeader } from "@/shared/components/layout";
import {
  SelectableDataTable,
  ConfirmationModal,
  Pagination,
} from "@/shared/components/ui";
import { useDocumentTitle } from "@/shared/hooks";
import { Column } from "@/shared/types/table";
import { UserRole } from "@/shared/types/user";

// User 타입 정의 (Record<string, unknown>을 확장)
interface User extends Record<string, unknown> {
  id: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  no?: number; // 페이지네이션을 위한 번호 필드
}

// 역할 매핑
const ROLE_LABELS: Record<UserRole, string> = {
  DEVELOPER: "개발사",
  BRANCH: "지점",
};

// 테이블 컬럼 정의
const userColumns: Column<User>[] = [
  {
    key: "no",
    title: "No.",
    width: 80,
    align: "center",
    render: (_value, record) => {
      // 빈 행인 경우 번호를 표시하지 않음
      if (record.id && record.id.startsWith("empty")) {
        return <div></div>;
      }
      return <div>{record.no}</div>;
    },
  },
  {
    key: "username",
    title: "아이디",
    width: 160,
    align: "center",
    render: (value) => <div>{String(value || "")}</div>,
  },
  {
    key: "name",
    title: "이름",
    width: 160,
    align: "center",
    render: (value) => <div>{String(value || "")}</div>,
  },
  {
    key: "phone",
    title: "연락처",
    width: 160,
    align: "center",
    render: (value) => <div>{String(value || "")}</div>,
  },
  {
    key: "email",
    title: "이메일",
    width: 320,
    align: "center",
    render: (value) => <div>{String(value || "")}</div>,
  },
  {
    key: "role",
    title: "권한",
    width: 160,
    align: "center",
    render: (value, record) => {
      // 빈 행인 경우 권한을 표시하지 않음
      if (record.id && record.id.startsWith("empty")) {
        return <div></div>;
      }
      const role = value as UserRole;
      return <div>{ROLE_LABELS[role] || String(role)}</div>;
    },
  },
];

// Mock 데이터 (25개)
const mockUsers: User[] = [
  {
    id: "1",
    username: "developer01",
    name: "개발사1",
    phone: "010-1234-5678",
    email: "dev1@company.com",
    role: "DEVELOPER",
  },
  {
    id: "2",
    username: "branch01",
    name: "지점관리자1",
    phone: "010-2345-6789",
    email: "branch1@golf.com",
    role: "BRANCH",
  },
  {
    id: "3",
    username: "branch02",
    name: "지점관리자2",
    phone: "010-3456-7890",
    email: "branch2@golf.com",
    role: "BRANCH",
  },
  {
    id: "4",
    username: "branch03",
    name: "지점관리자3",
    phone: "010-4567-8901",
    email: "branch3@golf.com",
    role: "BRANCH",
  },
  {
    id: "5",
    username: "branch04",
    name: "지점관리자4",
    phone: "010-5678-9012",
    email: "branch4@golf.com",
    role: "BRANCH",
  },
  {
    id: "6",
    username: "branch05",
    name: "지점관리자5",
    phone: "010-6789-0123",
    email: "branch5@golf.com",
    role: "BRANCH",
  },
  {
    id: "7",
    username: "branch06",
    name: "지점관리자6",
    phone: "010-7890-1234",
    email: "branch6@golf.com",
    role: "BRANCH",
  },
  {
    id: "8",
    username: "branch07",
    name: "지점관리자7",
    phone: "010-8901-2345",
    email: "branch7@golf.com",
    role: "BRANCH",
  },
  {
    id: "9",
    username: "branch08",
    name: "지점관리자8",
    phone: "010-9012-3456",
    email: "branch8@golf.com",
    role: "BRANCH",
  },
  {
    id: "10",
    username: "branch09",
    name: "지점관리자9",
    phone: "010-0123-4567",
    email: "branch9@golf.com",
    role: "BRANCH",
  },
  {
    id: "11",
    username: "branch10",
    name: "지점관리자10",
    phone: "010-1234-5679",
    email: "branch10@golf.com",
    role: "BRANCH",
  },
  {
    id: "12",
    username: "branch11",
    name: "지점관리자11",
    phone: "010-2345-6780",
    email: "branch11@golf.com",
    role: "BRANCH",
  },
  {
    id: "13",
    username: "branch12",
    name: "지점관리자12",
    phone: "010-3456-7891",
    email: "branch12@golf.com",
    role: "BRANCH",
  },
  {
    id: "14",
    username: "kim123",
    name: "김철수",
    phone: "010-4567-8902",
    email: "kim123@golf.com",
    role: "BRANCH",
  },
  {
    id: "15",
    username: "lee456",
    name: "이영희",
    phone: "010-5678-9013",
    email: "lee456@golf.com",
    role: "BRANCH",
  },
  {
    id: "16",
    username: "park789",
    name: "박민수",
    phone: "010-6789-0124",
    email: "park789@golf.com",
    role: "BRANCH",
  },
  {
    id: "17",
    username: "choi012",
    name: "최서연",
    phone: "010-7890-1235",
    email: "choi012@golf.com",
    role: "BRANCH",
  },
  {
    id: "18",
    username: "jung345",
    name: "정우진",
    phone: "010-8901-2346",
    email: "jung345@golf.com",
    role: "BRANCH",
  },
  {
    id: "19",
    username: "kang678",
    name: "강민지",
    phone: "010-9012-3457",
    email: "kang678@golf.com",
    role: "BRANCH",
  },
  {
    id: "20",
    username: "yoon901",
    name: "윤성호",
    phone: "010-0123-4568",
    email: "yoon901@golf.com",
    role: "BRANCH",
  },
  {
    id: "21",
    username: "lim234",
    name: "임하은",
    phone: "010-1234-5680",
    email: "lim234@golf.com",
    role: "BRANCH",
  },
  {
    id: "22",
    username: "han567",
    name: "한재훈",
    phone: "010-2345-6781",
    email: "han567@golf.com",
    role: "BRANCH",
  },
  {
    id: "23",
    username: "oh890",
    name: "오수빈",
    phone: "010-3456-7892",
    email: "oh890@golf.com",
    role: "BRANCH",
  },
  {
    id: "24",
    username: "developer02",
    name: "개발사2",
    phone: "010-4567-8903",
    email: "dev2@company.com",
    role: "DEVELOPER",
  },
  {
    id: "25",
    username: "moon456",
    name: "문예린",
    phone: "010-5678-9014",
    email: "moon456@golf.com",
    role: "BRANCH",
  },
];

// ActionBar 컴포넌트
interface ActionBarProps {
  totalCount: number;
  selectedCount: number;
  searchTerm: string;
  roleFilter: string;
  onSearchChange: (term: string) => void;
  onRoleFilterChange: (role: string) => void;
  onDeleteClick: () => void;
  onCreateClick: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  totalCount,
  selectedCount,
  searchTerm,
  roleFilter,
  onSearchChange,
  onRoleFilterChange,
  onDeleteClick,
  onCreateClick,
}) => {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="font-bold text-base">총 {totalCount}건</div>
      </div>

      <div className="flex items-center gap-8">
        {/* 삭제 버튼 */}
        <button
          onClick={onDeleteClick}
          disabled={selectedCount === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-60"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          삭제
        </button>

        {/* 권한 필터 */}
        <select
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-[106px]"
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
        >
          <option value="">권한</option>
          <option value="DEVELOPER">개발사</option>
          <option value="BRANCH">지점</option>
        </select>

        {/* 검색 */}
        <div className="relative w-[360px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="검색어 입력"
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* 생성 버튼 */}
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14m-7-7h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          생성
        </button>
      </div>
    </div>
  );
};

// 사용자 관리 훅
const useUserManagement = () => {
  // 상태 관리
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<User[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // 필터링된 데이터
  const filteredData = React.useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = !roleFilter || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  // 페이지네이션된 데이터
  const paginatedData = React.useMemo(() => {
    const itemsPerPage = 20;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData
      .slice(startIndex, startIndex + itemsPerPage)
      .map((user, index) => ({
        ...user,
        no: startIndex + index + 1, // 페이지네이션을 고려한 번호 계산
      }));
  }, [filteredData, currentPage]);

  // 패딩된 데이터 생성 (빈 행 추가)
  const paddedData = React.useMemo(() => {
    const itemsPerPage = 20;
    const emptyRowsCount = Math.max(0, itemsPerPage - paginatedData.length);
    const emptyRows = Array(emptyRowsCount)
      .fill(null)
      .map((_, index) => ({
        id: `empty-${index}`,
        username: "",
        name: "",
        phone: "",
        email: "",
        role: "BRANCH" as UserRole,
        no: 0, // 빈 행은 번호 0
      }));
    return [...paginatedData, ...emptyRows];
  }, [paginatedData]);

  // 액션 핸들러들
  const handleUpdateSelection = React.useCallback(
    (keys: string[], rows: User[]) => {
      // 빈 행은 선택에서 제외
      const validSelectedRows = rows.filter(
        (row) => row.id && !row.id.startsWith("empty")
      );
      const validSelectedRowKeys = validSelectedRows.map((row) => row.id);

      setSelectedRowKeys(validSelectedRowKeys);
      setSelectedRows(validSelectedRows);
    },
    []
  );

  const handleDeleteClick = React.useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = React.useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const handleDeleteUsers = React.useCallback(async () => {
    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("사용자 삭제:", selectedRowKeys);
      setIsDeleteModalOpen(false);
      setSelectedRowKeys([]);
      setSelectedRows([]);
    } catch (error) {
      console.error("사용자 삭제 오류:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedRowKeys]);

  const handleCreateUser = React.useCallback(() => {
    console.log("사용자 생성");
  }, []);

  return {
    // 데이터
    paddedData,
    filteredData,

    // 상태
    selectedRowKeys,
    selectedRows,
    isDeleteModalOpen,
    isDeleting,
    searchTerm,
    roleFilter,
    currentPage,

    // 액션
    handleUpdateSelection,
    handleDeleteClick,
    handleCloseDeleteModal,
    handleDeleteUsers,
    handleCreateUser,
    setSearchTerm,
    setRoleFilter,
    setCurrentPage,
  };
};

export default function UsersPage() {
  useDocumentTitle({ title: "사용자 관리" });

  const {
    paddedData,
    filteredData,
    selectedRowKeys,
    isDeleteModalOpen,
    isDeleting,
    searchTerm,
    roleFilter,
    currentPage,
    handleUpdateSelection,
    handleDeleteClick,
    handleCloseDeleteModal,
    handleDeleteUsers,
    handleCreateUser,
    setSearchTerm,
    setRoleFilter,
    setCurrentPage,
  } = useUserManagement();

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="사용자 관리" />

      <ActionBar
        totalCount={filteredData.length}
        selectedCount={selectedRowKeys.length}
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        onSearchChange={setSearchTerm}
        onRoleFilterChange={setRoleFilter}
        onDeleteClick={handleDeleteClick}
        onCreateClick={handleCreateUser}
      />

      <div className="space-y-6">
        <SelectableDataTable
          columns={userColumns}
          data={paddedData}
          selectable
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleUpdateSelection}
          realDataCount={filteredData.length}
          containerWidth="auto"
          layout="flexible"
          className="border-gray-200"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filteredData.length / 20))}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteUsers}
        title="사용자 삭제"
        message={`선택한 ${selectedRowKeys.length}개 사용자를 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        isLoading={isDeleting}
      />
    </div>
  );
}
