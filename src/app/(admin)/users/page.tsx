"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Dropdown, EmptyState } from "@/shared/components/ui";
import {
  AdminPageHeader,
  TableWithPagination,
} from "@/shared/components/layout";
import { usePagination, TableItem, defaultCellRenderer } from "@/shared/hooks";
import { UserPlus, Trash2 } from "lucide-react";

// 관리자 데이터 타입
interface User extends TableItem {
  no: number;
  name: string;
  email: string;
  role: string;
  golfCourse: string;
  phone: string;
  status: string;
}

const UsersPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("전체");

  // URL 검색 파라미터로부터 자동 검색 설정
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    }
  }, [searchParams]);

  // 샘플 데이터
  const allUsers: User[] = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        id: `user-${index + 1}`,
        no: index + 1,
        name: ["김관리", "이담당", "박매니저", "최관리자"][index % 4],
        email: `admin${index + 1}@golf.com`,
        role: ["골프장 관리자", "시스템 관리자"][index % 2],
        golfCourse: ["제이캐디 아카데미", "골프파크", "그린힐스"][index % 3],
        phone: "010-1234-5678",
        status: ["활성", "비활성"][index % 6 === 0 ? 1 : 0],
      })),
    []
  );

  // 필터링된 데이터
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.golfCourse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === "전체" || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [allUsers, searchTerm, selectedRole]);

  // 페이지네이션 훅 사용
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredUsers,
      itemsPerPage: 20,
    });

  // 테이블 컬럼 정의
  const columns = [
    {
      key: "no",
      title: "No.",
      width: 80,
      align: "center" as const,
      render: defaultCellRenderer<User>,
    },
    {
      key: "name",
      title: "이름",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<User>,
    },
    {
      key: "email",
      title: "이메일",
      width: 200,
      align: "left" as const,
      render: defaultCellRenderer<User>,
    },
    {
      key: "role",
      title: "권한",
      width: 140,
      align: "center" as const,
      render: defaultCellRenderer<User>,
    },
    {
      key: "golfCourse",
      title: "소속 골프장",
      width: 180,
      align: "center" as const,
      render: defaultCellRenderer<User>,
    },
    {
      key: "phone",
      title: "연락처",
      width: 140,
      align: "center" as const,
      render: defaultCellRenderer<User>,
    },
    {
      key: "status",
      title: "상태",
      width: 100,
      align: "center" as const,
      render: defaultCellRenderer<User>,
    },
  ];

  // 행 클릭 핸들러
  const handleRowClick = (user: User) => {
    if (user.isEmpty) {
      return;
    }
    console.log("사용자 상세:", user);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const roleOptions = [
    { value: "전체", label: "전체" },
    { value: "골프장 관리자", label: "골프장 관리자" },
    { value: "시스템 관리자", label: "시스템 관리자" },
  ];

  // 검색 결과가 없는 경우 체크
  const hasNoResults = filteredUsers.length === 0;

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader
        title="관리자 리스트"
        action={
          <button className="flex items-center gap-1 bg-[#FEB912] text-white font-medium text-base px-4 py-2 rounded-md hover:bg-[#E5A50F] transition-colors">
            <UserPlus size={24} />
            관리자 추가
          </button>
        }
      />

      {/* 필터 영역 */}
      <div className="flex items-center justify-between">
        <div className="text-base font-bold text-gray-900">
          총 {filteredUsers.length}건
        </div>

        <div className="flex items-center gap-8">
          {/* 삭제 버튼 (비활성화 상태) */}
          <div className="flex items-center gap-2 opacity-60">
            <Trash2 size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-500">삭제</span>
          </div>

          {/* 필터 드롭다운 */}
          <div className="flex items-center gap-2">
            <Dropdown
              options={roleOptions}
              value={selectedRole}
              onChange={setSelectedRole}
              placeholder="권한"
              containerClassName="w-[140px]"
            />
          </div>

          {/* 검색 */}
          <div className="flex items-center gap-2">
            <Search
              placeholder="검색어 입력"
              containerClassName="w-[360px]"
              onChange={handleSearchChange}
              value={searchTerm}
            />
          </div>
        </div>
      </div>

      {/* 테이블 또는 빈 상태 */}
      {hasNoResults ? (
        <div className="space-y-4">
          {/* 테이블 헤더 */}
          <div className="bg-gray-50 rounded-t-md border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="w-20 text-center">
                <span className="text-sm font-bold text-gray-600">No.</span>
              </div>
              <div className="w-24 text-center">
                <span className="text-sm font-bold text-gray-600">이름</span>
              </div>
              <div className="w-48 text-left">
                <span className="text-sm font-bold text-gray-600">이메일</span>
              </div>
              <div className="w-32 text-center">
                <span className="text-sm font-bold text-gray-600">권한</span>
              </div>
              <div className="w-40 text-center">
                <span className="text-sm font-bold text-gray-600">
                  소속 골프장
                </span>
              </div>
              <div className="w-32 text-center">
                <span className="text-sm font-bold text-gray-600">연락처</span>
              </div>
              <div className="w-24 text-center">
                <span className="text-sm font-bold text-gray-600">상태</span>
              </div>
            </div>
          </div>

          {/* 빈 상태 */}
          <EmptyState className="rounded-t-none border-t-0" />
        </div>
      ) : (
        <TableWithPagination
          columns={columns}
          data={currentData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
          layout="flexible"
        />
      )}
    </div>
  );
};

export default UsersPage;
