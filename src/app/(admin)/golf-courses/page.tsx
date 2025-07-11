"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import RoleGuard from "@/shared/components/auth/role-guard";
import {
  Button,
  ConfirmationModal,
  Dropdown,
  EmptyState,
  Pagination,
  Search,
  SelectableDataTable,
} from "@/shared/components/ui";
import { usePagination, useUrlSearchParams } from "@/shared/hooks";
import { GolfCourse } from "@/shared/types/golf-course";
import {
  GOLF_COURSE_FILTER_OPTIONS,
  GOLF_COURSE_TABLE_COLUMNS,
} from "@/shared/constants/golf-course";

const GolfCoursesPage: React.FC = () => {
  // 필터 상태
  const [filters, setFilters] = useState({
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

  // URL 검색 파라미터 처리
  const { searchTerm, setSearchTerm } = useUrlSearchParams();

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

  // 페이지네이션된 데이터에 번호 추가
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * 20;
    return currentData.map((course, index) => ({
      ...course,
      no: startIndex + index + 1,
    }));
  }, [currentData, currentPage]);

  // 행 클릭 핸들러
  const handleRowClick = (record: GolfCourse) => {
    // 빈 행인 경우 클릭 이벤트 무시
    if (record.isEmpty) {
      return;
    }
    // 골프장 상세 페이지로 이동
    window.location.href = `/golf-courses/${record.id}`;
  };

  // 선택 변경 핸들러
  const handleUpdateSelection = useCallback(
    (keys: string[]) => {
      // 빈 행 제외한 선택만 허용
      const filteredKeys = keys.filter((key) => {
        const record = paginatedData.find((item) => item.id === key);
        return record && !record.isEmpty;
      });
      setSelectedRowKeys(filteredKeys);
    },
    [paginatedData]
  );

  // 삭제 핸들러
  const handleDeleteSelected = useCallback(() => {
    if (selectedRowKeys.length === 0) return;
    setIsDeleteModalOpen(true);
  }, [selectedRowKeys]);

  // 삭제 확인 핸들러
  const handleConfirmDelete = useCallback(async () => {
    if (selectedRowKeys.length === 0) return;

    setIsDeleting(true);
    try {
      // 실제 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 선택된 아이템 삭제 로직
      console.log("삭제할 골프장 ID:", selectedRowKeys);

      // 삭제 후 선택 초기화
      setSelectedRowKeys([]);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedRowKeys]);

  // 생성 버튼 핸들러
  const handleCreateClick = useCallback(() => {
    window.location.href = "/golf-courses/new";
  }, []);

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
    <RoleGuard requiredRole="MASTER">
      <div className="bg-white rounded-xl p-8 space-y-6">
        {/* 제목 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">골프장 리스트</h2>
        </div>

        {/* 액션바 */}
        <div className="flex items-center justify-between">
          {/* 왼쪽: 총 건수 */}
          <div className="text-base font-bold text-gray-900">
            총 {filteredData.length}건
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
              data={paginatedData}
              onRowClick={handleRowClick}
              selectedRowKeys={selectedRowKeys}
              onSelectChange={handleUpdateSelection}
              selectable
              layout="flexible"
              className="w-full"
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
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
