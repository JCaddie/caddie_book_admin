"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useDayOffColumns } from "@/modules/day-off/components";
import { useDayOffActions, useDayOffList } from "@/modules/day-off/hooks";
import { DAY_OFF_UI_TEXT } from "@/modules/day-off/constants";
import { AdminPageHeader } from "@/shared/components/layout";
import {
  Button,
  ConfirmationModal,
  EmptyState,
  Pagination,
  RejectionReasonModal,
  SearchWithButton,
  SelectableDataTable,
} from "@/shared/components/ui";
import { useDocumentTitle } from "@/shared/hooks";
import { DayOffRequest } from "@/modules/day-off/types";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export default function DayOffManagementPage() {
  const router = useRouter();

  // 목록 데이터 및 상태
  const {
    data,
    filteredCount,
    totalPages,
    loading,
    error,
    clearError,
    refreshData,
  } = useDayOffList();

  // 액션 처리
  const { isApproving, isRejecting, approveRequests, rejectRequests } =
    useDayOffActions();

  // 선택 상태 관리
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // 모달 상태 관리
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  // 페이지 타이틀 설정
  useDocumentTitle({ title: "휴무관리" });

  // 테이블 컬럼 생성
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

  // 선택 변경 핸들러
  const handleSelectChange = useCallback((keys: string[]) => {
    setSelectedRowKeys(keys);
  }, []);

  // 승인 핸들러
  const handleApprove = useCallback(async () => {
    if (selectedRowKeys.length === 0) return;

    try {
      await approveRequests(selectedRowKeys);
      setSelectedRowKeys([]);
      setIsApprovalModalOpen(false);
      refreshData(); // 데이터 새로고침
    } catch (error) {
      console.error("승인 처리 중 오류:", error);
      // 실제 환경에서는 에러 토스트 표시
    }
  }, [selectedRowKeys, approveRequests, refreshData]);

  // 거절 핸들러
  const handleReject = useCallback(
    async (reason: string) => {
      if (selectedRowKeys.length === 0) return;

      try {
        await rejectRequests(selectedRowKeys, reason);
        setSelectedRowKeys([]);
        setIsRejectionModalOpen(false);
        refreshData(); // 데이터 새로고침
      } catch (error) {
        console.error("거절 처리 중 오류:", error);
        // 실제 환경에서는 에러 토스트 표시
      }
    },
    [selectedRowKeys, rejectRequests, refreshData]
  );

  // 승인 버튼 클릭 핸들러
  const handleApproveClick = useCallback(() => {
    if (selectedRowKeys.length === 0) return;
    setIsApprovalModalOpen(true);
  }, [selectedRowKeys.length]);

  // 거절 버튼 클릭 핸들러
  const handleRejectClick = useCallback(() => {
    if (selectedRowKeys.length === 0) return;
    setIsRejectionModalOpen(true);
  }, [selectedRowKeys.length]);

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
      <div className="flex items-center justify-between">
        {/* 왼쪽: 총 건수 */}
        <div className="text-base font-bold text-gray-900">
          총 {filteredCount}건
        </div>

        {/* 오른쪽: 검색 및 액션 버튼들 */}
        <div className="flex items-center gap-4">
          {/* 검색 */}
          <SearchWithButton placeholder="검색어 입력" />

          {/* 승인 버튼 */}
          <Button
            variant="primary"
            size="md"
            onClick={handleApproveClick}
            disabled={selectedRowKeys.length === 0 || isApproving}
            icon={<Check size={18} />}
            className="w-28"
          >
            승인
          </Button>

          {/* 거절 버튼 */}
          <Button
            variant="secondary"
            size="md"
            onClick={handleRejectClick}
            disabled={selectedRowKeys.length === 0 || isRejecting}
            icon={<X size={18} />}
            className="w-28"
          >
            거절
          </Button>
        </div>
      </div>

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
            <SelectableDataTable
              columns={columns}
              data={dataWithNumbers}
              onRowClick={handleRowClick}
              selectable
              selectedRowKeys={selectedRowKeys}
              onSelectChange={handleSelectChange}
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

      {/* 승인 확인 모달 */}
      <ConfirmationModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={handleApprove}
        title="휴무 신청 승인"
        message={`선택한 ${selectedRowKeys.length}개의 휴무 신청을 승인하시겠습니까?`}
        confirmText="승인"
        cancelText="취소"
        isLoading={isApproving}
      />

      {/* 거절 사유 입력 모달 */}
      <RejectionReasonModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        onConfirm={handleReject}
        title="휴무 신청 거절"
        message={`선택한 ${selectedRowKeys.length}개의 휴무 신청을 거절하시겠습니까?`}
        confirmText="거절"
        cancelText="취소"
        isLoading={isRejecting}
        placeholder="거절 사유를 입력하세요..."
      />
    </div>
  );
}
