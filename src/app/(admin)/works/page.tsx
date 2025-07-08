"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Dropdown, EmptyState } from "@/shared/components/ui";
import {
  AdminPageHeader,
  TableWithPagination,
} from "@/shared/components/layout";
import { usePagination, TableItem, defaultCellRenderer } from "@/shared/hooks";
import { Calendar, Trash2 } from "lucide-react";

// 근무 데이터 타입
interface Work extends TableItem {
  no: number;
  date: string;
  golfCourse: string;
  caddieName: string;
  workType: string;
  startTime: string;
  endTime: string;
  status: string;
}

const WorksPage: React.FC = () => {
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
  const allWorks: Work[] = useMemo(
    () =>
      Array.from({ length: 156 }, (_, index) => ({
        id: `work-${index + 1}`,
        no: index + 1,
        date: "2025-01-06",
        golfCourse: ["제이캐디 아카데미", "골프파크", "그린힐스"][index % 3],
        caddieName: ["김캐디", "이캐디", "박캐디", "최캐디"][index % 4],
        workType: ["정규", "오버타임", "특근"][index % 3],
        startTime: "06:00",
        endTime: "18:00",
        status: ["예약", "진행중", "완료", "취소"][index % 4],
      })),
    []
  );

  // 필터링된 데이터
  const filteredWorks = useMemo(() => {
    return allWorks.filter((work) => {
      const matchesSearch =
        searchTerm === "" ||
        work.golfCourse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.caddieName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "전체" || work.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [allWorks, searchTerm, selectedStatus]);

  // 페이지네이션 훅 사용
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredWorks,
      itemsPerPage: 20,
    });

  // 테이블 컬럼 정의
  const columns = [
    {
      key: "no",
      title: "No.",
      width: 80,
      align: "center" as const,
      render: defaultCellRenderer<Work>,
    },
    {
      key: "date",
      title: "날짜",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Work>,
    },
    {
      key: "golfCourse",
      title: "골프장",
      width: 180,
      align: "center" as const,
      render: defaultCellRenderer<Work>,
    },
    {
      key: "caddieName",
      title: "캐디명",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Work>,
    },
    {
      key: "workType",
      title: "근무유형",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Work>,
    },
    {
      key: "startTime",
      title: "시작시간",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Work>,
    },
    {
      key: "endTime",
      title: "종료시간",
      width: 120,
      align: "center" as const,
      render: defaultCellRenderer<Work>,
    },
    {
      key: "status",
      title: "상태",
      width: 100,
      align: "center" as const,
      render: defaultCellRenderer<Work>,
    },
  ];

  const handleRowClick = (work: Work) => {
    if (work.isEmpty) {
      return;
    }
    console.log("근무 상세:", work);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const statusOptions = [
    { value: "전체", label: "전체" },
    { value: "예약", label: "예약" },
    { value: "진행중", label: "진행중" },
    { value: "완료", label: "완료" },
    { value: "취소", label: "취소" },
  ];

  const hasNoResults = filteredWorks.length === 0;

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader
        title="근무 현황"
        action={
          <button className="flex items-center gap-1 bg-[#FEB912] text-white font-medium text-base px-4 py-2 rounded-md hover:bg-[#E5A50F] transition-colors">
            <Calendar size={24} />
            일정 등록
          </button>
        }
      />

      {/* 필터 영역 */}
      <div className="flex items-center justify-between">
        <div className="text-base font-bold text-gray-900">
          총 {filteredWorks.length}건
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
              <div className="w-30 text-center">
                <span className="text-sm font-bold text-gray-600">날짜</span>
              </div>
              <div className="w-40 text-center">
                <span className="text-sm font-bold text-gray-600">골프장</span>
              </div>
              <div className="w-30 text-center">
                <span className="text-sm font-bold text-gray-600">캐디명</span>
              </div>
              <div className="w-30 text-center">
                <span className="text-sm font-bold text-gray-600">
                  근무유형
                </span>
              </div>
              <div className="w-30 text-center">
                <span className="text-sm font-bold text-gray-600">
                  시작시간
                </span>
              </div>
              <div className="w-30 text-center">
                <span className="text-sm font-bold text-gray-600">
                  종료시간
                </span>
              </div>
              <div className="w-25 text-center">
                <span className="text-sm font-bold text-gray-600">상태</span>
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

export default WorksPage;
