"use client";

import React, { use, useState } from "react";
import { Button } from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useDocumentTitle } from "@/shared/hooks";
import { Clock, Settings } from "lucide-react";
import {
  DEFAULT_SPECIAL_GROUPS,
  SPECIAL_GROUP_UI_TEXT,
  SpecialGroup,
  SpecialGroupSchedule,
  SpecialGroupSettingModal,
  SpecialGroupStatus,
  useSpecialGroupDrag,
} from "@/modules/special";
import {
  FIELDS,
  generateTimeSlots,
  PERSONNEL_STATS,
} from "@/modules/work/constants/work-detail";
import RoundingSettingsModal from "@/modules/work/components/rounding-settings-modal";
import type { RoundingSettings } from "@/modules/work/types";
import { useSpecialSchedule } from "@/modules/work/hooks";

interface SpecialGroupsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const SpecialGroupsDetailPage: React.FC<SpecialGroupsDetailPageProps> = ({
  params,
}) => {
  const { id } = use(params);

  // "me"인 경우 현재 사용자의 골프장 ID 사용, 아니면 전달받은 ID 사용
  const isOwnGolfCourse = id === "me";

  // 페이지 타이틀 설정
  const pageTitle = isOwnGolfCourse ? "내 골프장 특수반 관리" : `특수반 관리`;
  useDocumentTitle({ title: pageTitle });

  // 특수반 드래그 상태 관리
  const { draggedItem, handleDragStart, handleDragEnd } =
    useSpecialGroupDrag<SpecialGroup>();

  // 특수 스케줄 데이터 조회 - 스케줄 ID 사용
  const {
    specialSchedule,
    isLoading: isScheduleLoading,
    error: scheduleError,
    hasNoParts,
    hasNoTimeSettings,
    hasNoMatrix,
    refetch: refetchSchedule,
  } = useSpecialSchedule(id);

  // 모달 상태 관리
  const [isSpecialGroupSettingModalOpen, setIsSpecialGroupSettingModalOpen] =
    useState(false);
  const [isRoundingSettingsModalOpen, setIsRoundingSettingsModalOpen] =
    useState(false);
  // API에서 가져온 특수반 그룹을 기존 타입으로 변환하거나 기본값 사용
  const specialGroups =
    specialSchedule?.available_special_groups?.map((group, index) => ({
      id: group.id,
      name: group.name,
      color: `bg-yellow-${400 + index * 100}`, // 임시 색상 할당
      description: `${group.member_count}명`,
      isActive: true,
    })) || DEFAULT_SPECIAL_GROUPS;

  // 시간 슬롯 생성 - API 데이터가 있으면 변환, 없으면 기본값
  const timeSlots =
    specialSchedule?.parts && specialSchedule.parts.length > 0
      ? {
          part1:
            specialSchedule.parts[0]?.schedule_matrix?.map(
              (matrix) => matrix.time
            ) || [],
          part2:
            specialSchedule.parts[1]?.schedule_matrix?.map(
              (matrix) => matrix.time
            ) || [],
          part3:
            specialSchedule.parts[2]?.schedule_matrix?.map(
              (matrix) => matrix.time
            ) || [],
        }
      : generateTimeSlots();

  // 특수반 설정 모달 핸들러
  const handleOpenSpecialGroupSetting = () => {
    setIsSpecialGroupSettingModalOpen(true);
  };

  const handleCloseSpecialGroupSetting = () => {
    setIsSpecialGroupSettingModalOpen(false);
  };

  const handleSaveSpecialGroups = (newSpecialGroups: SpecialGroup[]) => {
    // TODO: API로 특수반 설정 저장 후 데이터 갱신
    setIsSpecialGroupSettingModalOpen(false);
    console.log("특수반 설정 저장:", newSpecialGroups);
    // 데이터 다시 가져오기
    refetchSchedule();
  };

  // 라운딩 세팅 모달 핸들러
  const handleOpenRoundingSettings = () => {
    setIsRoundingSettingsModalOpen(true);
  };

  const handleCloseRoundingSettings = () => {
    setIsRoundingSettingsModalOpen(false);
  };

  const handleSaveRoundingSettings = (
    settings: RoundingSettings,
    date: string,
    golfCourseName?: string
  ) => {
    console.log("라운딩 세팅 저장:", settings, date, golfCourseName);
    setIsRoundingSettingsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <AdminPageHeader title={pageTitle} />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-blue-400 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
            onClick={handleOpenRoundingSettings}
          >
            <Clock className="w-4 h-4" />
            라운딩 세팅
          </Button>
          <Button
            variant="outline"
            className="border-yellow-400 text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
            onClick={handleOpenSpecialGroupSetting}
          >
            <Settings className="w-4 h-4" />
            {SPECIAL_GROUP_UI_TEXT.buttons.setting}
          </Button>
        </div>
      </div>

      {/* 로딩 상태 */}
      {isScheduleLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">특수 스케줄을 불러오는 중...</div>
        </div>
      )}

      {/* 에러 상태 */}
      {scheduleError && (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500 text-center">
            <p>특수 스케줄 조회에 실패했습니다.</p>
            <p className="text-sm mt-2">{scheduleError}</p>
            <button
              onClick={refetchSchedule}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 빈 데이터 상태 처리 */}
      {!isScheduleLoading && !scheduleError && hasNoParts && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">시간표를 설정해주세요</p>
          <p className="text-sm mt-2">라운딩 설정을 먼저 완료해야 합니다.</p>
          <Button
            onClick={handleOpenRoundingSettings}
            className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-white"
          >
            라운딩 설정 시작
          </Button>
        </div>
      )}

      {!isScheduleLoading &&
        !scheduleError &&
        !hasNoParts &&
        hasNoTimeSettings && (
          <div className="text-center py-12 text-orange-500">
            <p className="text-lg">시간을 입력해주세요</p>
            <p className="text-sm mt-2">부별 시간 설정이 필요합니다.</p>
            <Button
              onClick={handleOpenRoundingSettings}
              className="mt-4 bg-orange-400 hover:bg-orange-500 text-white"
            >
              시간 설정하기
            </Button>
          </div>
        )}

      {!isScheduleLoading &&
        !scheduleError &&
        !hasNoParts &&
        !hasNoTimeSettings &&
        hasNoMatrix && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">설정 완료 후 배치 가능</p>
            <p className="text-sm mt-2">
              시간표 매트릭스가 생성되지 않았습니다.
            </p>
          </div>
        )}

      {/* 메인 콘텐츠 - 정상 데이터가 있을 때만 표시 */}
      {!isScheduleLoading &&
        !scheduleError &&
        !hasNoParts &&
        !hasNoTimeSettings &&
        !hasNoMatrix && (
          <div className="flex gap-8">
            {/* 왼쪽: 특수반 관리 스케줄 */}
            <div className="flex-1">
              <SpecialGroupSchedule
                fields={
                  specialSchedule?.fields?.map((field) => ({
                    id: field.number,
                    name: field.name,
                  })) || FIELDS
                }
                timeSlots={timeSlots}
                personnelStats={PERSONNEL_STATS}
                onResetClick={() => {
                  console.log("Reset clicked");
                }}
                draggedGroup={draggedItem}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                hideHeader={true}
                isFullWidth={true}
              />
            </div>

            {/* 오른쪽: 특수반 현황 */}
            <SpecialGroupStatus
              groups={specialGroups}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              draggedGroup={draggedItem}
            />
          </div>
        )}

      {/* 특수반 설정 모달 */}
      <SpecialGroupSettingModal
        isOpen={isSpecialGroupSettingModalOpen}
        onClose={handleCloseSpecialGroupSetting}
        onSave={handleSaveSpecialGroups}
        initialGroups={specialGroups}
      />

      {/* 라운딩 세팅 모달 */}
      <RoundingSettingsModal
        isOpen={isRoundingSettingsModalOpen}
        onClose={handleCloseRoundingSettings}
        onSave={handleSaveRoundingSettings}
        golfCourseName={specialSchedule?.golf_course?.name || `골프장 ${id}`}
        scheduleId={id}
      />
    </div>
  );
};

export default SpecialGroupsDetailPage;
