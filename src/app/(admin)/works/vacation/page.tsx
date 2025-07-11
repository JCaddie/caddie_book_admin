"use client";

import React, { useCallback, useMemo } from "react";
import {
  VacationActionBar,
  VacationActionsCell,
} from "@/modules/vacation/components";
import { useVacationManagement } from "@/modules/vacation/hooks";
import {
  VACATION_TABLE_COLUMNS,
  VACATION_UI_TEXT,
} from "@/modules/vacation/constants";
import { AdminPageHeader } from "@/shared/components/layout";
import { DataTable, Pagination, EmptyState } from "@/shared/components/ui";
import { useDocumentTitle } from "@/shared/hooks";
import { VacationRequest } from "@/modules/vacation/types";
import { useRouter } from "next/navigation";

export default function VacationManagementPage() {
  const router = useRouter();
  const {
    data,
    totalCount,
    filteredCount,
    currentPage,
    totalPages,
    handlePageChange,
    filters,
    handleFilterChange,
    handleApprove,
    handleReject,
    loading,
    error,
    actionLoading,
    clearError,
    refreshData,
  } = useVacationManagement();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: "휴무관리" });

  // 페이지네이션을 고려한 번호가 포함된 데이터
  const dataWithNumbers = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      no: (currentPage - 1) * 20 + index + 1,
    }));
  }, [data, currentPage]);

  // 행 클릭 핸들러
  const handleRowClick = useCallback(
    (record: VacationRequest) => {
      // 빈 행인 경우 무시
      if (record.isEmpty) return;

      // 상세 페이지로 이동
      router.push(`/works/vacation/${record.id}`);
    },
    [router]
  );

  // 액션 셀 렌더러
  const renderActionsCell = (_: unknown, record: VacationRequest) => (
    <VacationActionsCell
      request={record}
      onApprove={handleApprove}
      onReject={handleReject}
      loading={actionLoading === record.id}
    />
  );

  // 액션 컬럼을 포함한 컬럼 정의
  const columns = [
    ...VACATION_TABLE_COLUMNS,
    {
      key: "actions",
      title: "",
      width: 120,
      align: "center" as const,
      render: renderActionsCell,
    },
  ];

  // 에러 상태 처리
  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <AdminPageHeader title="휴무관리" />
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 text-center mb-4">
            <p className="text-lg font-semibold">오류가 발생했습니다</p>
            <p className="text-sm text-gray-600 mt-1">{error}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearError}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              확인
            </button>
            <button
              onClick={refreshData}
              className="px-4 py-2 text-sm bg-primary text-white hover:bg-primary-dark rounded-md"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      {/* 페이지 헤더 */}
      <AdminPageHeader title="휴무관리" />

      {/* 상단 액션 바 */}
      <VacationActionBar
        totalCount={filteredCount}
        selectedCount={0}
        filters={filters}
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* 테이블 또는 로딩/빈 상태 */}
      {loading && !data.length ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">{VACATION_UI_TEXT.LOADING_MESSAGE}</p>
          </div>
        </div>
      ) : !data.length && filteredCount === 0 ? (
        <EmptyState message={VACATION_UI_TEXT.EMPTY_MESSAGE} />
      ) : (
        <>
          {/* 테이블 */}
          <div className="rounded-md overflow-hidden">
            <DataTable
              columns={columns}
              data={dataWithNumbers}
              onRowClick={handleRowClick}
              layout="flexible"
              containerWidth="auto"
              emptyText={VACATION_UI_TEXT.EMPTY_MESSAGE}
              loading={loading}
              itemsPerPage={20}
            />
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* 통계 정보 (디버깅용) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p>
            전체 데이터: {totalCount}개 | 필터링된 데이터: {filteredCount}개 |
            현재 페이지: {currentPage}/{totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
