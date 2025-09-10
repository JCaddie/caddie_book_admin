"use client";

import { use, useMemo, useState } from "react";
import { AdminPageHeader } from "@/shared/components/layout";
import { Button, ConfirmationModal } from "@/shared/components/ui";
import { useDayOffDetail } from "@/modules/day-off/hooks";
import {
  approveDayOffRequests,
  rejectDayOffRequests,
} from "@/modules/day-off/api";

interface DayOffDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const DayOffDetailPage: React.FC<DayOffDetailPageProps> = ({ params }) => {
  const { id: dayOffId } = use(params);

  // 휴무 상세 데이터 관리
  const {
    data: dayOffData,
    loading: isLoading,
    error,
    refreshData,
  } = useDayOffDetail(dayOffId);

  // 선택 상태 관리
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isIndividualApprovalModalOpen, setIsIndividualApprovalModalOpen] =
    useState(false);
  const [isIndividualRejectModalOpen, setIsIndividualRejectModalOpen] =
    useState(false);
  const [selectedDayOffName, setSelectedDayOffName] = useState<string>("");

  // 휴무 요청 목록 데이터
  const dayOffRequests = useMemo(() => {
    return dayOffData?.requests || [];
  }, [dayOffData?.requests]);

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <AdminPageHeader title="휴무 상세" />
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러가 있는 경우
  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <AdminPageHeader title="휴무 상세" />
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">
            <p>데이터 로딩에 실패했습니다.</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 휴무 데이터가 없는 경우
  if (!dayOffData) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
        <AdminPageHeader title="휴무 상세" />
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">휴무 정보를 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  // 행 클릭 핸들러
  const handleRowClick = (record: Record<string, unknown>) => {
    if ((record as { isEmpty?: boolean }).isEmpty) return;
    // 상세 페이지로 이동하는 로직 추가 가능
  };

  // 대량 승인 핸들러
  const handleBulkApprove = async () => {
    if (selectedRowKeys.length === 0) return;

    try {
      await approveDayOffRequests(selectedRowKeys);
      setIsApprovalModalOpen(false);
      setSelectedRowKeys([]);
      refreshData();
    } catch (error) {
      console.error("대량 승인 중 오류 발생:", error);
    }
  };

  // 대량 거절 핸들러
  const handleBulkReject = async () => {
    if (selectedRowKeys.length === 0) return;

    try {
      await rejectDayOffRequests(selectedRowKeys, "거절 처리");
      setIsRejectModalOpen(false);
      setSelectedRowKeys([]);
      refreshData();
    } catch (error) {
      console.error("대량 거절 중 오류 발생:", error);
    }
  };

  // 개별 승인 핸들러
  const handleIndividualApprove = async () => {
    if (selectedRowKeys.length !== 1) return;

    try {
      await approveDayOffRequests(selectedRowKeys);
      setIsIndividualApprovalModalOpen(false);
      setSelectedRowKeys([]);
      refreshData();
    } catch (error) {
      console.error("개별 승인 중 오류 발생:", error);
    }
  };

  // 개별 거절 핸들러
  const handleIndividualReject = async () => {
    if (selectedRowKeys.length !== 1) return;

    try {
      await rejectDayOffRequests(selectedRowKeys, "개별 거절 처리");
      setIsIndividualRejectModalOpen(false);
      setSelectedRowKeys([]);
      refreshData();
    } catch (error) {
      console.error("개별 거절 중 오류 발생:", error);
    }
  };

  // 승인 모달 열기
  const openApprovalModal = () => {
    if (selectedRowKeys.length === 0) return;
    setIsApprovalModalOpen(true);
  };

  // 거절 모달 열기
  const openRejectModal = () => {
    if (selectedRowKeys.length === 0) return;
    setIsRejectModalOpen(true);
  };

  // 개별 승인 모달 열기
  const openIndividualApprovalModal = (dayOffName: string) => {
    setSelectedDayOffName(dayOffName);
    setIsIndividualApprovalModalOpen(true);
  };

  // 개별 거절 모달 열기
  const openIndividualRejectModal = (dayOffName: string) => {
    setSelectedDayOffName(dayOffName);
    setIsIndividualRejectModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="휴무 상세" />

      {/* 휴무 정보 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            골프장
          </label>
          <div className="text-sm text-gray-900">
            {dayOffData.golf_course_name || "-"}
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            요청자
          </label>
          <div className="text-sm text-gray-900">
            {dayOffData.requester_name || "-"}
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            요청 날짜
          </label>
          <div className="text-sm text-gray-900">
            {dayOffData.request_date || "-"}
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            휴무 시작일
          </label>
          <div className="text-sm text-gray-900">
            {dayOffData.start_date || "-"}
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            휴무 종료일
          </label>
          <div className="text-sm text-gray-900">
            {dayOffData.end_date || "-"}
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상태
          </label>
          <div className="text-sm text-gray-900">
            {dayOffData.status || "-"}
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex items-center justify-between">
        <div className="text-base font-bold text-gray-900">
          총 {dayOffRequests.length}건
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="md"
            onClick={openApprovalModal}
            disabled={selectedRowKeys.length === 0}
            className="w-24"
          >
            승인
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={openRejectModal}
            disabled={selectedRowKeys.length === 0}
            className="w-24"
          >
            거절
          </Button>
        </div>
      </div>

      {/* 휴무 요청 목록 테이블 */}
      <div className="space-y-4">
        {/* 테이블 헤더 */}
        <div className="bg-gray-50 rounded-t-md border border-gray-200 p-4">
          <div className="flex items-center gap-8">
            <div className="w-12 text-center">
              <span className="text-sm font-bold text-gray-600">No.</span>
            </div>
            <div className="w-32">
              <span className="text-sm font-bold text-gray-600">캐디명</span>
            </div>
            <div className="flex-1 text-center">
              <span className="text-sm font-bold text-gray-600">
                휴무 시작일
              </span>
            </div>
            <div className="flex-1 text-center">
              <span className="text-sm font-bold text-gray-600">
                휴무 종료일
              </span>
            </div>
            <div className="w-24 text-center">
              <span className="text-sm font-bold text-gray-600">상태</span>
            </div>
            <div className="w-32 text-center">
              <span className="text-sm font-bold text-gray-600">액션</span>
            </div>
          </div>
        </div>

        {/* 휴무 요청 목록 */}
        {dayOffRequests.map(
          (request: Record<string, unknown>, index: number) => (
            <div
              key={request.id as string}
              className="flex items-center gap-8 p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRowClick(request)}
            >
              <div className="w-12 text-center">
                <span className="text-sm text-gray-600">{index + 1}</span>
              </div>
              <div className="w-32">
                <span className="text-sm font-medium text-gray-900">
                  {request.caddie_name as string}
                </span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm text-gray-600">
                  {request.start_date as string}
                </span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm text-gray-600">
                  {request.end_date as string}
                </span>
              </div>
              <div className="w-24 text-center">
                <span className="text-sm text-gray-600">
                  {request.status as string}
                </span>
              </div>
              <div className="w-32 flex items-center justify-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openIndividualApprovalModal(request.caddie_name as string);
                  }}
                  className="w-16"
                >
                  승인
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openIndividualRejectModal(request.caddie_name as string);
                  }}
                  className="w-16"
                >
                  거절
                </Button>
              </div>
            </div>
          )
        )}
      </div>

      {/* 승인 확인 모달 */}
      <ConfirmationModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={handleBulkApprove}
        title="휴무 승인"
        message={`선택한 ${selectedRowKeys.length}개의 휴무 요청을 승인하시겠습니까?`}
        confirmText="승인"
        cancelText="취소"
      />

      {/* 거절 확인 모달 */}
      <ConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleBulkReject}
        title="휴무 거절"
        message={`선택한 ${selectedRowKeys.length}개의 휴무 요청을 거절하시겠습니까?`}
        confirmText="거절"
        cancelText="취소"
      />

      {/* 개별 승인 확인 모달 */}
      <ConfirmationModal
        isOpen={isIndividualApprovalModalOpen}
        onClose={() => setIsIndividualApprovalModalOpen(false)}
        onConfirm={handleIndividualApprove}
        title="휴무 승인"
        message={`${selectedDayOffName}의 휴무 요청을 승인하시겠습니까?`}
        confirmText="승인"
        cancelText="취소"
      />

      {/* 개별 거절 확인 모달 */}
      <ConfirmationModal
        isOpen={isIndividualRejectModalOpen}
        onClose={() => setIsIndividualRejectModalOpen(false)}
        onConfirm={handleIndividualReject}
        title="휴무 거절"
        message={`${selectedDayOffName}의 휴무 요청을 거절하시겠습니까?`}
        confirmText="거절"
        cancelText="취소"
      />
    </div>
  );
};

export default DayOffDetailPage;
