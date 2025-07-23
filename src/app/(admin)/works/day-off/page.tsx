"use client";

import React, { useCallback, useMemo } from "react";
import {
  DayOffActionBar,
  useDayOffColumns,
} from "@/modules/day-off/components";
import { useDayOffManagement } from "@/modules/day-off/hooks";
import { DAY_OFF_UI_TEXT } from "@/modules/day-off/constants";
import { AdminPageHeader } from "@/shared/components/layout";
import { DataTable, EmptyState, Pagination } from "@/shared/components/ui";
import { useDocumentTitle } from "@/shared/hooks";
import { DayOffRequest } from "@/modules/day-off/types";
import { useRouter } from "next/navigation";

export default function DayOffManagementPage() {
  const router = useRouter();

  const {
    data,
    filteredCount,
    totalPages,
    filters,
    loading,
    error,
    clearError,
    refreshData,
  } = useDayOffManagement();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: "휴무관리" });

  // 테이블 컬럼 생성 (새로운 렌더러 시스템 사용)
  const columns = useDayOffColumns();

  // 페이지네이션을 고려한 번호가 포함된 데이터
  const dataWithNumbers = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      no: index + 1,
    }));
  }, [data]);

  // 행 클릭 핸들러
  const handleRowClick = useCallback(
    (record: DayOffRequest) => {
      // 빈 행인 경우 무시
      if (record.isEmpty) return;

      // 상세 페이지로 이동
      router.push(`/works/day-off/${record.id}`);
    },
    [router]
  );

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
      <DayOffActionBar
        totalCount={filteredCount}
        selectedCount={0}
        filters={filters}
        loading={loading}
      />

      {/* 테이블 또는 로딩/빈 상태 */}
      {loading && !data.length ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">{DAY_OFF_UI_TEXT.LOADING_MESSAGE}</p>
          </div>
        </div>
      ) : !data.length && filteredCount === 0 ? (
        <EmptyState message={DAY_OFF_UI_TEXT.EMPTY_MESSAGE} />
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
              emptyText={DAY_OFF_UI_TEXT.EMPTY_MESSAGE}
              loading={loading}
              itemsPerPage={20}
            />
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
