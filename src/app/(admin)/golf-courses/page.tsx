"use client";

import React, { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import RoleGuard from "@/shared/components/auth/role-guard";
import {
  Button,
  ConfirmationModal,
  Dropdown,
  EmptyState,
  Search,
  SelectableDataTable,
} from "@/shared/components/ui";
import { useUrlSearchParams } from "@/shared/hooks";
import { useGolfCourseList } from "@/modules/golf-course/hooks/use-golf-course-list";
import {
  GolfCourse,
  GolfCourseFilters,
} from "@/modules/golf-course/types/golf-course";
import Pagination from "@/shared/components/ui/pagination";
import {
  GOLF_COURSE_FILTER_OPTIONS,
  GOLF_COURSE_TABLE_COLUMNS,
} from "@/shared/constants/golf-course";

const GolfCoursesPage: React.FC = () => {
  // 필터 상태
  const [filters, setFilters] = useState<GolfCourseFilters>({
    contract: "",
    holes: "",
    membershipType: "",
    category: "",
    dailyTeams: "",
  });

  // 선택 상태 관리
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);

  // URL 검색 파라미터 처리
  const { searchTerm, setSearchTerm } = useUrlSearchParams();

  // API 데이터 fetch (올바른 인자 전달)
  const { data, isLoading, isError } = useGolfCourseList(
    currentPage,
    searchTerm,
    filters
  );

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 필터/검색 변경 시 페이지 1로 리셋
  const handleFilterChange = (
    filterKey: keyof GolfCourseFilters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
    setCurrentPage(1);
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 행 클릭 핸들러
  const handleRowClick = (record: GolfCourse) => {
    if ((record as { isEmpty?: boolean }).isEmpty) {
      return;
    }
    window.location.href = `/golf-courses/${record.id}`;
  };

  // 선택 변경 핸들러
  const handleUpdateSelection = useCallback(
    (keys: string[]) => {
      const filteredKeys = keys.filter((key) => {
        const record = (data?.results ?? []).find((item) => item.id === key);
        return record && !(record as { isEmpty?: boolean }).isEmpty;
      });
      setSelectedRowKeys(filteredKeys);
    },
    [data]
  );

  // 삭제 핸들러 등 기존 로직 동일
  const handleDeleteSelected = useCallback(() => {
    if (selectedRowKeys.length === 0) return;
    setIsDeleteModalOpen(true);
  }, [selectedRowKeys]);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedRowKeys.length === 0) return;
    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("삭제할 골프장 ID:", selectedRowKeys);
      setSelectedRowKeys([]);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedRowKeys]);

  const handleCreateClick = useCallback(() => {
    window.location.href = "/golf-courses/new";
  }, []);

  // 로딩/에러/빈 상태 처리
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 text-lg">
        로딩 중...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center h-96 text-lg text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  const hasNoResults = (data?.results?.length ?? 0) === 0;

  // no(목록 번호) 자동 부여
  const tableData = (data?.results ?? []).map((item, idx) => ({
    ...item,
    no: ((data?.page ?? 1) - 1) * (data?.page_size ?? 20) + idx + 1,
  }));

  return (
    <RoleGuard requiredRoles={["MASTER", "ADMIN"]}>
      <div className="bg-white rounded-xl p-8 space-y-6">
        {/* 제목 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">골프장 리스트</h2>
        </div>

        {/* 액션바 */}
        <div className="flex items-center justify-between">
          {/* 왼쪽: 총 건수 */}
          <div className="text-base font-bold text-gray-900">
            총 {data?.count ?? 0}건
          </div>

          {/* 오른쪽: 필터 및 액션 버튼들 */}
          <div className="flex items-center gap-8">
            {/* 필터 드롭다운들 */}
            <div className="flex items-center gap-2">
              <Dropdown
                options={GOLF_COURSE_FILTER_OPTIONS.contract}
                value={filters.contract}
                onChange={(value) => handleFilterChange("contract", value)}
                placeholder="계약"
                containerClassName="w-[106px]"
              />
              <Dropdown
                options={GOLF_COURSE_FILTER_OPTIONS.holes}
                value={filters.holes}
                onChange={(value) => handleFilterChange("holes", value)}
                placeholder="홀수"
                containerClassName="w-[106px]"
              />
              <Dropdown
                options={GOLF_COURSE_FILTER_OPTIONS.membershipType}
                value={filters.membershipType}
                onChange={(value) =>
                  handleFilterChange("membershipType", value)
                }
                placeholder="회원제"
                containerClassName="w-[106px]"
              />
              <Dropdown
                options={GOLF_COURSE_FILTER_OPTIONS.category}
                value={filters.category}
                onChange={(value) => handleFilterChange("category", value)}
                placeholder="부분류"
                containerClassName="w-[106px]"
              />
              <Dropdown
                options={GOLF_COURSE_FILTER_OPTIONS.dailyTeams}
                value={filters.dailyTeams}
                onChange={(value) => handleFilterChange("dailyTeams", value)}
                placeholder="당일팀수"
                containerClassName="w-[106px]"
              />
            </div>

            {/* 검색 및 버튼 그룹 */}
            <div className="flex items-center gap-2">
              <Search
                placeholder="검색어 입력"
                containerClassName="w-[360px]"
                onChange={handleSearch}
                value={searchTerm}
              />

              {/* 삭제 버튼 */}
              <Button
                variant="secondary"
                size="md"
                onClick={handleDeleteSelected}
                disabled={selectedRowKeys.length === 0 || isDeleting}
                className="w-24"
              >
                삭제
              </Button>

              {/* 생성 버튼 */}
              <Button
                variant="primary"
                size="md"
                className="w-24"
                onClick={handleCreateClick}
                icon={<Plus size={24} />}
              >
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
          <div className="space-y-6">
            <SelectableDataTable
              columns={GOLF_COURSE_TABLE_COLUMNS}
              data={tableData}
              onRowClick={handleRowClick}
              selectedRowKeys={selectedRowKeys}
              onSelectChange={handleUpdateSelection}
              selectable
              layout="flexible"
              className="w-full"
            />

            <Pagination
              currentPage={data?.page ?? 1}
              totalPages={data?.total_pages ?? 1}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* 삭제 확인 모달 */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="골프장 삭제"
          message={`선택한 ${selectedRowKeys.length}개의 골프장을 삭제하시겠습니까?`}
          confirmText="삭제"
          isLoading={isDeleting}
        />
      </div>
    </RoleGuard>
  );
};

export default GolfCoursesPage;
