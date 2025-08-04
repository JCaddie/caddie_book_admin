"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/shared/components/layout";
import {
  Button,
  ConfirmationModal,
  RejectionReasonModal,
} from "@/shared/components/ui";
import { useDocumentTitle } from "@/shared/hooks";
import { useDayOffActions, useDayOffDetail } from "@/modules/day-off/hooks";
import {
  formatProcessResult,
  getProcessResultColor,
} from "@/modules/day-off/utils";
import { DAY_OFF_UI_TEXT } from "@/modules/day-off/constants";

interface DayOffDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const DayOffDetailPage: React.FC<DayOffDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const resolvedParams = use(params);

  // 모달 상태 관리
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // 페이지 타이틀 설정
  useDocumentTitle({ title: DAY_OFF_UI_TEXT.DETAIL_PAGE_TITLE });

  // 휴무 신청 데이터 조회
  const {
    data: dayOffRequest,
    loading,
    error,
    refreshData,
    clearError,
  } = useDayOffDetail(resolvedParams.id);

  // 액션 처리
  const { isApproving, isRejecting, approveRequests, rejectRequests } =
    useDayOffActions();

  // 데이터가 없는 경우 처리
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ minWidth: "1600px" }}>
        <div className="bg-white rounded-xl p-8">
          <AdminPageHeader title={DAY_OFF_UI_TEXT.DETAIL_PAGE_TITLE} />
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg text-red-600 mb-4">오류가 발생했습니다</p>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button variant="secondary" onClick={clearError}>
                  확인
                </Button>
                <Button variant="primary" onClick={refreshData}>
                  다시 시도
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 중 처리
  if (loading || !dayOffRequest) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ minWidth: "1600px" }}>
        <div className="bg-white rounded-xl p-8">
          <AdminPageHeader title={DAY_OFF_UI_TEXT.DETAIL_PAGE_TITLE} />
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">데이터를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 승인 모달 열기
  const handleApproveClick = () => {
    setIsApproveModalOpen(true);
  };

  // 반려 모달 열기
  const handleRejectClick = () => {
    setIsRejectModalOpen(true);
  };

  // 승인 처리
  const handleApproveConfirm = async () => {
    try {
      await approveRequests([dayOffRequest.id]);
      setIsApproveModalOpen(false);
      // 처리 후 목록으로 이동
      router.push("/works/day-off");
    } catch (error) {
      console.error("승인 처리 중 오류:", error);
      // 실제 환경에서는 에러 토스트 표시
    }
  };

  // 반려 처리
  const handleRejectConfirm = async (reason: string) => {
    try {
      await rejectRequests([dayOffRequest.id], reason);
      setIsRejectModalOpen(false);
      // 처리 후 목록으로 이동
      router.push("/works/day-off");
    } catch (error) {
      console.error("반려 처리 중 오류:", error);
      // 실제 환경에서는 에러 토스트 표시
    }
  };

  // 날짜 포맷팅 (ISO → 한국 형식)
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";

    // ISO 형식인 경우 변환
    if (dateString.includes("T")) {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
      });
    }

    // 이미 한국 형식인 경우 그대로 반환
    return dateString;
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ minWidth: "1600px" }}>
      <div className="bg-white rounded-xl flex-1 flex flex-col">
        {/* 메인 콘텐츠 */}
        <div className="flex-1 p-8 space-y-10">
          {/* 페이지 헤더 */}
          <AdminPageHeader title={DAY_OFF_UI_TEXT.DETAIL_PAGE_TITLE} />

          {/* 기본 정보 섹션 */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-600">기본 정보</h2>
            <div className="flex gap-4">
              {/* 캐디 사진 */}
              <div className="w-[180px] h-[240px] bg-gray-300 rounded-md flex-shrink-0"></div>

              {/* 정보 테이블 */}
              <div className="flex-1 border border-gray-200 rounded-md">
                <div className="grid grid-cols-2 gap-0">
                  {/* 첫 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">이름</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {dayOffRequest.caddie_name}
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">계약 형태</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="bg-green-400 text-white px-2 py-1 rounded text-sm font-medium">
                        {dayOffRequest.caddie_employment_type_display ||
                          "정규직"}
                      </span>
                    </div>
                  </div>

                  {/* 두 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">역할</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">캐디</span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">신청일</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {formatDate(dayOffRequest.date)}
                      </span>
                    </div>
                  </div>

                  {/* 세 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">그룹</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {dayOffRequest.caddie_primary_group || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">특수반</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {dayOffRequest.caddie_special_group || "-"}
                      </span>
                    </div>
                  </div>

                  {/* 네 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">연락처</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {dayOffRequest.caddie_phone || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">이메일</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {dayOffRequest.caddie_email || "-"}
                      </span>
                    </div>
                  </div>

                  {/* 다섯 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">주소</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {dayOffRequest.caddie_address || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">팀장 여부</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          dayOffRequest.caddie_is_team_leader
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {dayOffRequest.caddie_is_team_leader ? "팀장" : "일반"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 휴무 신청 정보 섹션 */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-600">휴무 신청 정보</h2>
            <div className="border border-gray-200 rounded-md">
              <div className="grid grid-cols-2 gap-0">
                {/* 첫 번째 행 */}
                <div className="border-b border-gray-200 flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">신청구분</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black">
                      {dayOffRequest.display_status}
                    </span>
                  </div>
                </div>
                <div className="border-b border-gray-200 flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">처리결과</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        dayOffRequest.process_result === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : dayOffRequest.process_result === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {formatProcessResult(dayOffRequest.process_result)}
                    </span>
                  </div>
                </div>

                {/* 두 번째 행 */}
                <div className="border-b border-gray-200 flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">신청 날짜</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black">
                      {formatDate(dayOffRequest.created_at)}
                    </span>
                  </div>
                </div>
                <div className="border-b border-gray-200 flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">요청 날짜</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black">
                      {dayOffRequest.requested_at
                        ? formatDate(dayOffRequest.requested_at)
                        : "-"}
                    </span>
                  </div>
                </div>

                {/* 세 번째 행 */}
                <div className="border-b border-gray-200 flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">수정 날짜</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black">
                      {formatDate(dayOffRequest.updated_at)}
                    </span>
                  </div>
                </div>

                {/* 네 번째 행 */}
                <div className="border-b border-gray-200 flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">처리자</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black">
                      {dayOffRequest.processed_by_name || "-"}
                    </span>
                  </div>
                </div>
                <div className="border-b border-gray-200 flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">처리 날짜</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black">
                      {dayOffRequest.processed_at
                        ? formatDate(dayOffRequest.processed_at)
                        : "-"}
                    </span>
                  </div>
                </div>

                {/* 사유 행 (전체 너비) */}
                <div className="col-span-2 border-b border-gray-200 flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">신청 사유</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black">
                      {dayOffRequest.request_reason}
                    </span>
                  </div>
                </div>

                {/* 메모 행 (전체 너비) */}
                {dayOffRequest.notes && (
                  <div className="col-span-2 border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">메모</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {dayOffRequest.notes}
                      </span>
                    </div>
                  </div>
                )}

                {/* 처리내용 행 (처리된 경우에만 표시) */}
                {dayOffRequest.process_notes && (
                  <div className="col-span-2 border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">처리내용</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span
                        className={`text-sm ${
                          dayOffRequest.process_result === "REJECTED"
                            ? "text-red-600"
                            : "text-black"
                        }`}
                      >
                        {dayOffRequest.process_notes}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-4 justify-end">
            <Button
              variant="primary"
              onClick={handleApproveClick}
              disabled={isApproving}
            >
              승인
            </Button>
            <Button
              variant="secondary"
              onClick={handleRejectClick}
              disabled={isRejecting}
            >
              반려
            </Button>
          </div>
        </div>
      </div>

      {/* 승인 확인 모달 */}
      <ConfirmationModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={handleApproveConfirm}
        title="휴무 신청 승인"
        message="이 휴무 신청을 승인하시겠습니까?"
        confirmText="승인"
        cancelText="취소"
        isLoading={isApproving}
      />

      {/* 반려 사유 입력 모달 */}
      <RejectionReasonModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        title="휴무 신청 반려"
        message="이 휴무 신청을 반려하시겠습니까?"
        confirmText="반려"
        cancelText="취소"
        isLoading={isRejecting}
        placeholder="반려 사유를 입력하세요..."
      />
    </div>
  );
};

export default DayOffDetailPage;
