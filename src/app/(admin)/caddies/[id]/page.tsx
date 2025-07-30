"use client";

import { use, useMemo, useState } from "react";
import { AdminPageHeader } from "@/shared/components/layout";
import {
  Button,
  ConfirmationModal,
  Pagination,
  RejectionReasonModal,
} from "@/shared/components/ui";
import { useCaddieDetail, useCaddieEdit } from "@/modules/caddie/hooks";
import { EditableCaddieField } from "@/modules/caddie/components";
import { useGolfCourseSimpleOptions } from "@/shared/hooks";
import {
  bulkApproveNewCaddies,
  bulkRejectNewCaddies,
} from "@/modules/caddie/api";

import type { CaddieCareer } from "@/modules/caddie/types";

interface CaddieDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const CaddieDetailPage: React.FC<CaddieDetailPageProps> = ({ params }) => {
  const resolvedParams = use(params);

  // 모달 상태 관리
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 캐디 상세정보 API 연결
  const {
    caddie,
    isLoading: isCaddieDataLoading,
    error,
    refreshData,
  } = useCaddieDetail(resolvedParams.id);

  // 골프장 목록 가져오기 (ID 찾기용)
  const { options: golfCourseOptions } = useGolfCourseSimpleOptions();

  // 캐디의 골프장 이름으로 ID 찾기
  const golfCourseId = useMemo(() => {
    if (!caddie || !golfCourseOptions.length) return undefined;

    const foundGolfCourse = golfCourseOptions.find(
      (option) => option.label === caddie.golf_course_name
    );
    return foundGolfCourse?.value || undefined;
  }, [caddie, golfCourseOptions]);

  // 캐디 편집 기능 훅
  const {
    employmentTypeChoices,
    teamLeaderChoices,
    primaryGroupChoices,
    specialGroupChoices,
    updateEmploymentType,
    updateWorkScore,
    updateTeamLeader,
    updatePrimaryGroup,
    updateSpecialGroups,
    isLoading: isEditLoading,
    error: editError,
  } = useCaddieEdit({
    caddieId: resolvedParams.id,
    golfCourseId: golfCourseId || "",
    onUpdate: () => {
      // 상세 정보가 업데이트되면 다시 로드
      refreshData();
    },
  });

  // 개별 승인 처리
  const handleIndividualApprove = async () => {
    try {
      setIsLoading(true);
      await bulkApproveNewCaddies({
        user_ids: [resolvedParams.id],
      });
      setIsApprovalModalOpen(false);
      refreshData(); // 데이터 새로고침
    } catch (error) {
      console.error("승인 처리 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 개별 거절 처리
  const handleIndividualReject = async (rejectionReason: string) => {
    try {
      setIsLoading(true);
      await bulkRejectNewCaddies({
        user_ids: [resolvedParams.id],
        rejection_reason: rejectionReason,
      });
      setIsRejectModalOpen(false);
      refreshData(); // 데이터 새로고침
    } catch (error) {
      console.error("거절 처리 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 편집 함수 래퍼들 (타입 호환성을 위해)
  const handleEmploymentTypeUpdate = async (value: string | number) => {
    await updateEmploymentType(String(value));
  };

  const handleWorkScoreUpdate = async (value: string | number) => {
    await updateWorkScore(String(value));
  };

  const handleTeamLeaderUpdate = async (value: string | number) => {
    await updateTeamLeader(String(value));
  };

  const handlePrimaryGroupUpdate = async (value: string | number) => {
    await updatePrimaryGroup(String(value));
  };

  const handleSpecialGroupsUpdate = async (value: string | number) => {
    await updateSpecialGroups(String(value));
  };

  // 캐디 데이터 (API 응답 또는 기본값)
  const caddieData = useMemo(() => {
    if (caddie) {
      // 고용 형태 한글 변환
      const employmentTypeMap: Record<string, string> = {
        FULL_TIME: "정규직",
        PART_TIME: "시간제",
        CONTRACT: "계약직",
        TEMPORARY: "임시직",
      };

      // 등록 상태 한글 변환
      const registrationStatusMap: Record<string, string> = {
        PENDING: "승인 대기",
        APPROVED: "승인됨",
        REJECTED: "거부됨",
      };

      return {
        id: String(caddie.id),
        name: caddie.user_name,
        gender: caddie.gender,
        genderDisplay: caddie.gender === "M" ? "남" : "여",
        employmentType: caddie.employment_type,
        employmentTypeDisplay:
          employmentTypeMap[caddie.employment_type] || caddie.employment_type,
        golfCourse: golfCourseId || "", // 골프장 ID
        golfCourseName: caddie.golf_course_name,
        role: "캐디",
        isTeamLeader: caddie.is_team_leader,
        primaryGroup: caddie.primary_group
          ? `그룹 ${caddie.primary_group}`
          : "없음",
        primaryGroupDescription: caddie.primary_group
          ? `그룹 (순서: ${caddie.primary_group_order})`
          : "",
        specialGroups: caddie.special_group
          ? `특수반 ${caddie.special_group}`
          : "없음",
        phone: caddie.user_phone,
        email: caddie.user_email,
        address: caddie.address,
        workScore: caddie.work_score.toString(),
        registrationStatus: caddie.registration_status,
        registrationStatusDisplay:
          registrationStatusMap[caddie.registration_status] ||
          caddie.registration_status,
        remainingDaysOff: caddie.remaining_days_off,
        isOnDuty: caddie.is_on_duty,
        assignedWork: {
          message: "배정 근무 정보",
          upcoming_schedules: [],
          current_assignment: null,
        },
        careers: [],
      };
    }

    // 로딩 중이거나 에러시 기본값
    return {
      id: resolvedParams.id,
      name: isLoading ? "로딩 중..." : error ? "데이터 없음" : "홍길동",
      gender: "M",
      genderDisplay: "남",
      employmentType: "FULL_TIME",
      employmentTypeDisplay: "정규직",
      golfCourse: "", // 골프장 ID
      golfCourseName: "제이캐디 아카데미", // 표시용 이름
      role: "캐디",
      isTeamLeader: false,
      primaryGroup: "A조",
      primaryGroupDescription: "조 단위 (순서: 1)",
      specialGroups: "없음",
      phone: "010-1234-5678",
      email: "abc@test.com",
      address: "충청북도 청주시 청원구 오창읍 양청송대길 10, 406호",
      workScore: "0",
      assignedWork: {
        message: "데이터 없음",
        upcoming_schedules: [],
        current_assignment: null,
      },
      careers: [],
    };
  }, [caddie, resolvedParams.id, isLoading, error]);

  // 배정근무 데이터 (나중에 API에서 가져올 예정)
  // 현재는 빈 상태로 페이지네이션만 기본값 제공
  const totalPages = 1;

  // 로딩 상태 처리
  if (isCaddieDataLoading) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-10">
        <AdminPageHeader title="캐디" />
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-4"></div>
            <p>캐디 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-10">
        <AdminPageHeader title="캐디" />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // PENDING 상태인지 확인
  const isPendingStatus = caddieData.registrationStatus === "PENDING";

  return (
    <div className="bg-white rounded-xl p-8 space-y-10">
      {/* 페이지 헤더 */}
      <AdminPageHeader title="캐디" />

      {/* 편집 에러 메시지 */}
      {editError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{editError}</p>
        </div>
      )}

      {/* 등록 상태 및 승인/거절 버튼 (PENDING일 때만 표시) */}
      {isPendingStatus && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                신규 캐디 승인 대기
              </h3>
              <p className="text-sm text-yellow-700">
                이 캐디는 아직 승인되지 않은 신규 캐디입니다. 승인 또는 거절
                처리가 필요합니다.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsRejectModalOpen(true)}
                disabled={isLoading}
              >
                거절
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsApprovalModalOpen(true)}
                disabled={isLoading}
              >
                승인
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 기본 정보 섹션 */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-600">기본 정보</h2>
        <div className="flex gap-6">
          {/* 캐디 사진 */}
          <div className="w-[180px] h-[240px] bg-gray-300 rounded-md flex-shrink-0"></div>

          {/* 정보 테이블 */}
          <div className="flex-1 border border-gray-200 rounded-md">
            <div className="grid grid-cols-2 gap-0">
              {/* 첫 번째 행 */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">이름</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black font-semibold">
                      {caddieData.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-200">
                <div className="flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">성별</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black">
                      {caddieData.genderDisplay}
                    </span>
                  </div>
                </div>
              </div>

              {/* 두 번째 행 */}
              <div className="border-b border-gray-200">
                <EditableCaddieField
                  label="고용형태"
                  value={caddieData.employmentType}
                  onSave={handleEmploymentTypeUpdate}
                  type="select"
                  options={employmentTypeChoices}
                  disabled={isEditLoading}
                />
              </div>
              <div className="border-b border-gray-200">
                <EditableCaddieField
                  label="근무점수"
                  value={caddieData.workScore}
                  onSave={handleWorkScoreUpdate}
                  type="number"
                  disabled={isEditLoading}
                />
              </div>

              {/* 세 번째 행 */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">골프장</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black">
                      {caddieData.golfCourseName}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-200">
                <EditableCaddieField
                  label="팀장여부"
                  value={caddieData.isTeamLeader ? "true" : "false"}
                  onSave={handleTeamLeaderUpdate}
                  type="select"
                  options={teamLeaderChoices}
                  disabled={isEditLoading}
                />
              </div>

              {/* 네 번째 행 */}
              <div className="border-b border-gray-200">
                <EditableCaddieField
                  label="주 그룹"
                  value={caddieData.primaryGroup}
                  onSave={handlePrimaryGroupUpdate}
                  type="select"
                  options={primaryGroupChoices}
                  disabled={isEditLoading}
                />
              </div>
              <div className="border-b border-gray-200">
                <EditableCaddieField
                  label="특수반"
                  value={caddieData.specialGroups}
                  onSave={handleSpecialGroupsUpdate}
                  type="select"
                  options={specialGroupChoices}
                  disabled={isEditLoading}
                />
              </div>

              {/* 다섯 번째 행 */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">연락처</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black">
                      {caddieData.phone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-200">
                <div className="flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">이메일</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black">
                      {caddieData.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* 여섯 번째 행 */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">휴무일수</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black">
                      {caddieData.remainingDaysOff}일
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-200">
                <div className="flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">등록 상태</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        caddieData.registrationStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : caddieData.registrationStatus === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {caddieData.registrationStatusDisplay}
                    </span>
                  </div>
                </div>
              </div>

              {/* 여섯 번째 행 */}
              <div className="col-span-2">
                <div className="flex">
                  <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                    <span className="text-sm font-bold">주소</span>
                  </div>
                  <div className="flex-1 flex items-center px-4 py-3">
                    <span className="text-sm text-black">
                      {caddieData.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 배정근무 섹션 */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-600">배정근무</h2>
        <div className="space-y-6">
          {/* 빈 상태 표시 - 나중에 API 데이터로 교체될 예정 */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-8">
            <div className="text-center text-gray-500">
              <p className="text-sm">배정근무 데이터가 준비 중입니다.</p>
              <p className="text-xs text-gray-400 mt-2">
                향후 API에서 데이터를 불러올 예정입니다.
              </p>
            </div>
          </div>

          {/* 페이지네이션 (현재 비활성화) */}
          <div className="flex justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>

      {/* 경력 섹션 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-600">경력</h2>
        <div className="h-px bg-gray-300 w-full"></div>

        {caddieData.careers.length > 0 ? (
          <div className="space-y-6">
            {(caddieData.careers as unknown as CaddieCareer[]).map(
              (career, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-md p-6"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-bold text-gray-600 mb-2">
                        골프장명
                      </div>
                      <div className="text-sm text-black">
                        {career.golf_course_name || "정보 없음"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-600 mb-2">
                        근무기간
                      </div>
                      <div className="text-sm text-black">
                        {career.start_date
                          ? `${career.start_date} ~ ${
                              career.end_date || "현재"
                            }`
                          : "정보 없음"}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm font-bold text-gray-600 mb-2">
                        설명
                      </div>
                      <div className="text-sm text-black leading-relaxed">
                        {career.description || "정보 없음"}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-8">
            <div className="text-center text-gray-500">
              <p className="text-sm">등록된 경력이 없습니다.</p>
            </div>
          </div>
        )}
      </div>

      {/* 승인 확인 모달 */}
      <ConfirmationModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={handleIndividualApprove}
        title="캐디 승인"
        message={`${caddieData.name}님을 승인하시겠습니까?`}
        confirmText="승인"
        cancelText="취소"
        isLoading={isLoading}
      />

      {/* 거절 사유 입력 모달 */}
      <RejectionReasonModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleIndividualReject}
        title="캐디 거절"
        message={`${caddieData.name}님을 거절하시겠습니까?`}
        confirmText="거절"
        cancelText="취소"
        isLoading={isLoading}
      />
    </div>
  );
};

export default CaddieDetailPage;
