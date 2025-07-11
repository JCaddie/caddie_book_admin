"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui";
import { useDocumentTitle } from "@/shared/hooks";
import { getVacationRequestById } from "@/modules/vacation/utils";
import { VACATION_UI_TEXT } from "@/modules/vacation/constants";

interface VacationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const VacationDetailPage: React.FC<VacationDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const resolvedParams = use(params);

  // 페이지 타이틀 설정
  useDocumentTitle({ title: "휴무 신청 상세" });

  // 휴무 신청 데이터 조회
  const vacationRequest = getVacationRequestById(resolvedParams.id);

  // 데이터가 없는 경우 처리
  if (!vacationRequest) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ minWidth: "1600px" }}>
        <div className="bg-white rounded-xl p-8">
          <AdminPageHeader title="휴무 신청 상세" />
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-4">
                휴무 신청 정보를 찾을 수 없습니다.
              </p>
              <Button
                variant="primary"
                onClick={() => router.push("/works/vacation-management")}
              >
                목록으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 승인 처리
  const handleApprove = async () => {
    // 실제 환경에서는 API 호출
    console.log("승인 처리:", vacationRequest.id);
    // 처리 후 목록으로 이동
    router.push("/works/vacation-management");
  };

  // 반려 처리
  const handleReject = async () => {
    // 실제 환경에서는 API 호출
    console.log("반려 처리:", vacationRequest.id);
    // 처리 후 목록으로 이동
    router.push("/works/vacation-management");
  };

  // 상태별 뱃지 스타일
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "검토 중":
        return "bg-gray-300 text-gray-800";
      case "승인":
        return "text-white";
      case "반려":
        return "text-white";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  // 상태별 뱃지 배경색 (인라인 스타일로 적용)
  const getStatusBadgeBackground = (status: string) => {
    switch (status) {
      case "검토 중":
        return "#E3E3E3";
      case "승인":
        return "#FEB912";
      case "반려":
        return "#D44947";
      default:
        return "#E3E3E3";
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
          <AdminPageHeader title="휴무 신청 상세" />

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
                        {vacationRequest.caddieName}
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">계약 형태</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="bg-green-400 text-white px-2 py-1 rounded text-sm font-medium">
                        정규직
                      </span>
                    </div>
                  </div>

                  {/* 두 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">근무처</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        제이캐디 아카데미
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">역할</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">캐디</span>
                    </div>
                  </div>

                  {/* 세 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">그룹</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">1조</span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">특수반</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">마샬</span>
                    </div>
                  </div>

                  {/* 네 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">연락처</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {vacationRequest.phone}
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">이메일</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">abc@test.com</span>
                    </div>
                  </div>

                  {/* 다섯 번째 행 */}
                  <div className="col-span-2 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">거주지</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        충청북도 청주시 청원구 오창읍 양청송대길 10,
                        406호(청주미래누리터(지식산업센터))
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 신청 정보 섹션 */}
          <div className="space-y-2">
            {/* 제목과 뱃지 */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-600">신청 정보</h2>
              <span
                className={`inline-flex items-center justify-center min-w-[56px] px-2 py-1 rounded-md text-sm font-medium ${getStatusBadgeStyle(
                  vacationRequest.status
                )}`}
                style={{
                  backgroundColor: getStatusBadgeBackground(
                    vacationRequest.status
                  ),
                }}
              >
                {vacationRequest.status}
              </span>
            </div>

            {/* 신청 정보 내용 */}
            <div className="space-y-4">
              {/* 휴무희망일자 */}
              <div className="flex items-center gap-2">
                <div className="w-[88px] flex items-center">
                  <span className="text-sm font-semibold text-black">
                    휴무희망일자
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-600">
                    {formatDate(vacationRequest.requestDate)}
                  </span>
                </div>
              </div>

              {/* 배정근무 */}
              <div className="flex items-center gap-2">
                <div className="w-[88px] flex items-center">
                  <span className="text-sm font-semibold text-black">
                    배정근무
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-600">없음</span>
                </div>
              </div>

              {/* 사유 */}
              <div className="flex gap-2">
                <div className="w-[88px] flex items-start pt-1">
                  <span className="text-sm font-semibold text-black">사유</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {vacationRequest.reason}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          {vacationRequest.status === "검토 중" && (
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleReject}
                className="w-[120px] border-primary text-primary hover:bg-primary hover:text-white"
              >
                {VACATION_UI_TEXT.REJECT_BUTTON}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleApprove}
                className="w-[120px]"
              >
                {VACATION_UI_TEXT.APPROVE_BUTTON}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VacationDetailPage;
