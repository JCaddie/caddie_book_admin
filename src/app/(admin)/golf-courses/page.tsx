"use client";

import React, { useState, useMemo } from "react";
import { Trash2 } from "lucide-react";
import RoleGuard from "@/shared/components/auth/role-guard";
import { Button, Search, Dropdown, EmptyState } from "@/shared/components/ui";
import { TableWithPagination } from "@/shared/components/layout";
import {
  usePagination,
  useTableData,
  defaultCellRenderer,
  TableItem,
} from "@/shared/hooks";

// 골프장 데이터 타입
interface GolfCourse extends TableItem {
  no: number;
  name: string;
  region: string;
  contractStatus: string;
  phone: string;
  membershipType: string;
  caddies: number;
  fields: number;
}

const GolfCoursesPage: React.FC = () => {
  // 필터 상태
  const [filters, setFilters] = useState({
    contract: "",
    holes: "",
    membershipType: "",
    category: "",
    dailyTeams: "",
  });

  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState("");

  // 샘플 데이터 (실제로는 API에서 가져옴)
  const allGolfCourses: GolfCourse[] = Array.from(
    { length: 32 },
    (_, index) => ({
      id: `golf-${index + 1}`,
      no: index + 1,
      name: "제이캐디 아카데미",
      region: "서울시 종로구",
      contractStatus: "완료",
      phone: "02-1111-2222",
      membershipType: "회원제",
      caddies: 6,
      fields: 32,
    })
  );

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    let filtered = allGolfCourses;

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.phone.includes(searchTerm)
      );
    }

    // 다른 필터들 적용
    if (filters.contract) {
      filtered = filtered.filter((course) => {
        if (filters.contract === "completed")
          return course.contractStatus === "완료";
        if (filters.contract === "pending")
          return course.contractStatus === "대기";
        if (filters.contract === "rejected")
          return course.contractStatus === "거절";
        return true;
      });
    }

    if (filters.membershipType) {
      filtered = filtered.filter((course) => {
        if (filters.membershipType === "member")
          return course.membershipType === "회원제";
        if (filters.membershipType === "public")
          return course.membershipType === "퍼블릭";
        return true;
      });
    }

    return filtered;
  }, [allGolfCourses, searchTerm, filters]);

  // 페이지네이션 훅 사용
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: filteredData,
      itemsPerPage: 20,
    });

  // 테이블 데이터 패딩 훅 사용
  const { paddedData } = useTableData({
    data: currentData,
    itemsPerPage: 20,
    emptyRowTemplate: {
      no: 0,
      name: "",
      region: "",
      contractStatus: "",
      phone: "",
      membershipType: "",
      caddies: 0,
      fields: 0,
    },
  });

  // 필터 옵션들
  const filterOptions = {
    contract: [
      { value: "completed", label: "완료" },
      { value: "pending", label: "대기" },
      { value: "rejected", label: "거절" },
    ],
    holes: [
      { value: "18", label: "18홀" },
      { value: "27", label: "27홀" },
      { value: "36", label: "36홀" },
    ],
    membershipType: [
      { value: "member", label: "회원제" },
      { value: "public", label: "퍼블릭" },
    ],
    category: [
      { value: "premium", label: "프리미엄" },
      { value: "standard", label: "일반" },
    ],
    dailyTeams: [
      { value: "high", label: "많음" },
      { value: "medium", label: "보통" },
      { value: "low", label: "적음" },
    ],
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      key: "no",
      title: "No.",
      width: 80,
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "name",
      title: "골프장명",
      width: 200,
      align: "left" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "region",
      title: "시/구",
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "contractStatus",
      title: "계약 현황",
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "phone",
      title: "대표 번호",
      width: 150,
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "membershipType",
      title: "회원제/퍼블릭",
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "caddies",
      title: "캐디",
      width: 80,
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "fields",
      title: "필드",
      width: 80,
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
  ];

  const handleRowClick = (record: GolfCourse) => {
    // 빈 행인 경우 클릭 이벤트 무시
    if (record.isEmpty) {
      return;
    }
    // 골프장 상세 페이지로 이동
    window.location.href = `/golf-courses/${record.id}`;
  };

  // 필터 변경 핸들러
  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  // 검색 핸들러
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 검색 결과가 없는 경우 체크
  const hasNoResults = filteredData.length === 0;

  return (
    <RoleGuard requiredRole="DEVELOPER">
      <div className="bg-white rounded-xl p-8 space-y-6">
        {/* 제목 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">골프장 리스트</h2>
        </div>

        {/* Figma 디자인에 맞는 상단 필터 영역 */}
        <div className="flex items-center justify-between">
          {/* 왼쪽: 총 건수 */}
          <div className="text-base font-bold text-gray-900">
            총 {filteredData.length}건
          </div>

          {/* 오른쪽: 필터 및 액션 버튼들 */}
          <div className="flex items-center gap-8">
            {/* 삭제 버튼 (비활성화 상태) */}
            <div className="flex items-center gap-2 opacity-60">
              <Trash2 size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-500">삭제</span>
            </div>

            {/* 필터 드롭다운들 */}
            <div className="flex items-center gap-2">
              <Dropdown
                options={filterOptions.contract}
                value={filters.contract}
                onChange={(value) => handleFilterChange("contract", value)}
                placeholder="계약"
                containerClassName="w-[106px]"
              />
              <Dropdown
                options={filterOptions.holes}
                value={filters.holes}
                onChange={(value) => handleFilterChange("holes", value)}
                placeholder="홀수"
                containerClassName="w-[106px]"
              />
              <Dropdown
                options={filterOptions.membershipType}
                value={filters.membershipType}
                onChange={(value) =>
                  handleFilterChange("membershipType", value)
                }
                placeholder="회원제"
                containerClassName="w-[106px]"
              />
              <Dropdown
                options={filterOptions.category}
                value={filters.category}
                onChange={(value) => handleFilterChange("category", value)}
                placeholder="부분류"
                containerClassName="w-[106px]"
              />
              <Dropdown
                options={filterOptions.dailyTeams}
                value={filters.dailyTeams}
                onChange={(value) => handleFilterChange("dailyTeams", value)}
                placeholder="당일팀수"
                containerClassName="w-[106px]"
              />
            </div>

            {/* 검색 및 생성 버튼 */}
            <div className="flex items-center gap-2">
              <Search
                placeholder="검색어 입력"
                containerClassName="w-[360px]"
                onChange={handleSearch}
                value={searchTerm}
              />
              <Button variant="primary" size="md" className="w-24">
                생성
              </Button>
            </div>
          </div>
        </div>

        {/* 테이블 또는 빈 상태 */}
        {hasNoResults ? (
          <div className="space-y-4">
            {/* 테이블 헤더 */}
            <div className="bg-gray-50 rounded-t-md border border-gray-200 p-4">
              <div className="flex items-center gap-8">
                <div className="w-12 text-center">
                  <span className="text-sm font-bold text-gray-600">No.</span>
                </div>
                <div className="w-48">
                  <span className="text-sm font-bold text-gray-600">
                    골프장명
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm font-bold text-gray-600">시/구</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm font-bold text-gray-600">
                    계약 현황
                  </span>
                </div>
                <div className="w-36 text-center">
                  <span className="text-sm font-bold text-gray-600">
                    대표 번호
                  </span>
                </div>
                <div className="w-32 text-center">
                  <span className="text-sm font-bold text-gray-600">
                    회원제/퍼블릭
                  </span>
                </div>
                <div className="w-20 text-center">
                  <span className="text-sm font-bold text-gray-600">캐디</span>
                </div>
                <div className="w-20 text-center">
                  <span className="text-sm font-bold text-gray-600">필드</span>
                </div>
              </div>
            </div>

            {/* 빈 상태 */}
            <EmptyState className="rounded-t-none border-t-0" />
          </div>
        ) : (
          <TableWithPagination
            columns={columns}
            data={paddedData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onRowClick={handleRowClick}
            layout="flexible"
          />
        )}
      </div>
    </RoleGuard>
  );
};

export default GolfCoursesPage;
