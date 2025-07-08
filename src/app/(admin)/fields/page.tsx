"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Dropdown, EmptyState } from "@/shared/components/ui";
import {
  AdminPageHeader,
  TableWithPagination,
} from "@/shared/components/layout";
import { usePagination, TableItem, defaultCellRenderer } from "@/shared/hooks";
import { MapPin, Trash2 } from "lucide-react";

// 필드 데이터 타입
interface Field extends TableItem {
  no: number;
  name: string;
  golfCourse: string;
  holes: number;
  status: string;
  condition: string;
  lastMaintenance: string;
}

const FieldsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("전체");

  // URL 검색 파라미터로부터 자동 검색 설정
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam));
    }
  }, [searchParams]);

  // 샘플 데이터
  const allFields: Field[] = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: `field-${index + 1}`,
        no: index + 1,
        name: `${index + 1}번 홀`,
        golfCourse: ["제이캐디 아카데미", "골프파크", "그린힐스"][index % 3],
        holes: 18,
        status: ["운영중", "정비중", "사용불가"][index % 3],
        condition: ["양호", "보통", "주의"][index % 3],
        lastMaintenance: "2025-01-01",
      })),
    []
  );

  // 필터링된 데이터
  const filteredFields = useMemo(() => {
    return allFields.filter((field) => {
      const matchesSearch =
        searchTerm === "" ||
        field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.golfCourse.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "전체" || field.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [allFields, searchTerm, selectedStatus]);

  // 페이지네이션 훅 사용
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredFields,
      itemsPerPage: 20,
    });

  // 테이블 컬럼 정의
  const columns = [
    {
      key: "no",
      title: "No.",
      width: 80,
      align: "center" as const,
      render: defaultCellRenderer<Field>,
    },
    {
      key: "name",
      title: "필드명",
      width: 150,
      align: "center" as const,
      render: defaultCellRenderer<Field>,
    },
    {
      key: "golfCourse",
      title: "골프장",
      width: 200,
      align: "center" as const,
      render: defaultCellRenderer<Field>,
    },
    {
      key: "holes",
      title: "홀 수",
      width: 100,
      align: "center" as const,
      render: defaultCellRenderer<Field>,
    },
    {
      key: "status",
      title: "운영상태",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Field>,
    },
    {
      key: "condition",
      title: "필드상태",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Field>,
    },
    {
      key: "lastMaintenance",
      title: "최근정비일",
      width: 150,
      align: "center" as const,
      render: defaultCellRenderer<Field>,
    },
  ];

  const handleRowClick = (field: Field) => {
    if (field.isEmpty) {
      return;
    }
    console.log("필드 상세:", field);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const statusOptions = [
    { value: "전체", label: "전체" },
    { value: "운영중", label: "운영중" },
    { value: "정비중", label: "정비중" },
    { value: "사용불가", label: "사용불가" },
  ];

  const hasNoResults = filteredFields.length === 0;

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader
        title="필드 관리"
        action={
          <button className="flex items-center gap-1 bg-[#FEB912] text-white font-medium text-base px-4 py-2 rounded-md hover:bg-[#E5A50F] transition-colors">
            <MapPin size={24} />
            필드 추가
          </button>
        }
      />

      {/* 필터 영역 */}
      <div className="flex items-center justify-between">
        <div className="text-base font-bold text-gray-900">
          총 {filteredFields.length}개
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 opacity-60">
            <Trash2 size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-500">삭제</span>
          </div>

          <div className="flex items-center gap-2">
            <Dropdown
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="상태"
              containerClassName="w-[120px]"
            />
          </div>

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
          <div className="bg-gray-50 rounded-t-md border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="w-20 text-center">
                <span className="text-sm font-bold text-gray-600">No.</span>
              </div>
              <div className="w-38 text-center">
                <span className="text-sm font-bold text-gray-600">필드명</span>
              </div>
              <div className="w-50 text-center">
                <span className="text-sm font-bold text-gray-600">골프장</span>
              </div>
              <div className="w-25 text-center">
                <span className="text-sm font-bold text-gray-600">홀 수</span>
              </div>
              <div className="w-30 text-center">
                <span className="text-sm font-bold text-gray-600">
                  운영상태
                </span>
              </div>
              <div className="w-30 text-center">
                <span className="text-sm font-bold text-gray-600">
                  필드상태
                </span>
              </div>
              <div className="w-38 text-center">
                <span className="text-sm font-bold text-gray-600">
                  최근정비일
                </span>
              </div>
            </div>
          </div>
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

export default FieldsPage;
