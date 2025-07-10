"use client";

import React from "react";
import { AdminPageHeader } from "@/shared/components/layout";
import {
  SelectableDataTable,
  ConfirmationModal,
  Pagination,
} from "@/shared/components/ui";
import { useDocumentTitle } from "@/shared/hooks";

// Mock data and components until user module is fully working
const mockUserColumns = [
  {
    key: "no",
    title: "No.",
    width: 80,
    align: "center" as const,
    render: (_value: unknown, _record: unknown, index: number) => (
      <div>{index + 1}</div>
    ),
  },
  {
    key: "username",
    title: "아이디",
    width: 160,
    align: "center" as const,
    render: (value: unknown) => <div>{value as string}</div>,
  },
  {
    key: "name",
    title: "이름",
    width: 160,
    align: "center" as const,
    render: (value: unknown) => <div>{value as string}</div>,
  },
  {
    key: "phone",
    title: "연락처",
    width: 160,
    align: "center" as const,
    render: (value: unknown) => <div>{value as string}</div>,
  },
  {
    key: "email",
    title: "이메일",
    width: 320,
    align: "center" as const,
    render: (value: unknown) => <div>{value as string}</div>,
  },
  {
    key: "role",
    title: "권한",
    width: 160,
    align: "center" as const,
    render: (value: unknown) => {
      const roleMap: Record<string, string> = {
        master: "마스터",
        admin: "관리자",
        user: "사용자",
      };
      return <div>{roleMap[value as string] || (value as string)}</div>;
    },
  },
];

const mockUsers = [
  {
    id: "1",
    username: "jcaddie",
    name: "홍길동",
    phone: "010-1234-5678",
    email: "adminkim@admin.com",
    role: "master",
  },
  {
    id: "2",
    username: "admin01",
    name: "김관리",
    phone: "010-2345-6789",
    email: "admin01@admin.com",
    role: "admin",
  },
  {
    id: "3",
    username: "user01",
    name: "이사용",
    phone: "010-3456-7890",
    email: "user01@user.com",
    role: "user",
  },
];

export default function UsersPage() {
  useDocumentTitle({ title: "사용자 관리" });

  // Mock implementation
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<unknown[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // 패딩된 데이터 생성 (빈 행 추가)
  const paddedData = React.useMemo(() => {
    const itemsPerPage = 20;
    const emptyRowsCount = Math.max(0, itemsPerPage - mockUsers.length);
    const emptyRows = Array(emptyRowsCount)
      .fill(null)
      .map((_, index) => ({
        id: `empty-${index}`,
        username: "",
        name: "",
        phone: "",
        email: "",
        role: "user",
      }));
    return [...mockUsers, ...emptyRows];
  }, []);

  const handleUpdateSelection = (keys: string[], rows: unknown[]) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteUsers = async () => {
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
  };

  const handleCreateUser = () => {
    console.log("사용자 생성");
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="사용자 관리" />

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="font-bold text-base">총 {mockUsers.length}건</div>
        </div>

        <div className="flex items-center gap-8">
          {/* 삭제 버튼 */}
          <button
            onClick={handleDeleteClick}
            disabled={selectedRowKeys.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-60"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-[106px]">
            <option value="">권한</option>
            <option value="master">마스터</option>
            <option value="admin">관리자</option>
            <option value="user">사용자</option>
          </select>

          {/* 검색 */}
          <div className="relative w-[360px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={handleCreateUser}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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

      <div className="space-y-6">
        <SelectableDataTable
          columns={mockUserColumns}
          data={paddedData}
          selectable
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleUpdateSelection}
          realDataCount={mockUsers.length}
          containerWidth="auto"
          layout="flexible"
          className="border-gray-200"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={1}
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
