"use client";

import { notFound } from "next/navigation";
import { use, useState } from "react";
import { useWorkDetail } from "@/modules/work/hooks/use-work-detail";
import { useDateNavigation } from "@/modules/work/hooks/use-date-navigation";
import { usePersonnelFilter } from "@/modules/work/hooks/use-personnel-filter";
import { useResetModal } from "@/modules/work/hooks/use-reset-modal";
import { upsertRoundingSettings } from "@/modules/work/api";
import {
  CaddieData,
  RoundingSettings,
  WorkDetailPageProps,
} from "@/modules/work/types";
import {
  FIELDS,
  generateTimeSlots,
  PERSONNEL_STATS,
} from "@/modules/work/constants/work-detail";
import DateNavigation from "@/modules/work/components/date-navigation";
import WorkSchedule from "@/modules/work/components/work-schedule";
import PersonnelStatus from "@/modules/work/components/personnel-status";
import ConfirmationModal from "@/shared/components/ui/confirmation-modal";
import RoundingSettingsModal from "@/modules/work/components/rounding-settings-modal";

export default function WorkDetailPage({
  params,
  searchParams,
}: WorkDetailPageProps) {
  const { id: golfCourseId } = use(params);
  const { date } = use(searchParams);

  // 드래그 상태 관리
  const [draggedCaddie, setDraggedCaddie] = useState<CaddieData | null>(null);

  // 라운딩 설정 모달 상태
  const [isRoundingSettingsModalOpen, setIsRoundingSettingsModalOpen] =
    useState(false);
  const [isRoundingSettingsLoading, setIsRoundingSettingsLoading] =
    useState(false);
  const [roundingSettings, setRoundingSettings] = useState<RoundingSettings>({
    numberOfRounds: 1,
    timeUnit: 10,
    roundTimes: [{ round: 1, startTime: "06:00", endTime: "08:00" }],
  });

  // 커스텀 훅들 사용
  const { currentDate, handleDateChange } = useDateNavigation(
    golfCourseId,
    date
  );
  const { filters, filteredCaddies, updateFilter } = usePersonnelFilter();
  const { isResetModalOpen, openResetModal, closeResetModal, handleReset } =
    useResetModal();

  // golfCourseId로 work 데이터 조회
  const { work, isLoading, error } = useWorkDetail(golfCourseId);

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 space-y-6">
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
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">
            <p>데이터 로딩에 실패했습니다.</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 존재하지 않는 근무 정보인 경우
  if (!work) {
    notFound();
  }

  // 시간 슬롯 생성
  const timeSlots = generateTimeSlots();

  // 공통 드래그 이벤트 핸들러
  const handleDragStart = (caddie: CaddieData) => {
    setDraggedCaddie(caddie);
  };

  const handleDragEnd = () => {
    setDraggedCaddie(null);
  };

  // 라운딩 설정 모달 핸들러
  const handleOpenRoundingSettings = () => {
    setIsRoundingSettingsModalOpen(true);
  };

  const handleCloseRoundingSettings = () => {
    setIsRoundingSettingsModalOpen(false);
  };

  const handleSaveRoundingSettings = async (settings: RoundingSettings) => {
    try {
      setIsRoundingSettingsLoading(true);
      // work 데이터에서 실제 golfCourseId 사용
      const actualGolfCourseId = work?.golfCourseId || golfCourseId;
      await upsertRoundingSettings(actualGolfCourseId, settings);
      setRoundingSettings(settings);
      setIsRoundingSettingsModalOpen(false);
      // TODO: 성공 메시지 표시
    } catch {
      // TODO: 에러 메시지 표시
      alert("라운딩 설정 저장에 실패했습니다.");
    } finally {
      setIsRoundingSettingsLoading(false);
    }
  };

  // 채우기 핸들러
  const handleFill = () => {
    // TODO: 자동 채우기 로직 구현
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      {/* 최상단 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">제이캐디아카데미</h1>
      </div>

      {/* 날짜 네비게이션 및 검색 섹션 */}
      <DateNavigation
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex gap-8">
        {/* 왼쪽: 라운딩 관리 */}
        <WorkSchedule
          fields={FIELDS}
          timeSlots={timeSlots}
          personnelStats={PERSONNEL_STATS}
          draggedCaddie={draggedCaddie}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onRoundingSettingsClick={handleOpenRoundingSettings}
          onFillClick={handleFill}
          onResetClick={openResetModal}
        />

        {/* 오른쪽: 인력 현황 사이드바 */}
        <PersonnelStatus
          filters={filters}
          filteredCaddies={filteredCaddies}
          onFilterUpdate={updateFilter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggedCaddie={draggedCaddie}
        />
      </div>

      {/* 초기화 확인 모달 */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={closeResetModal}
        onConfirm={handleReset}
        title="초기화 하시겠습니까?"
        message="초기화 시 모든 배치 정보가 삭제됩니다."
        confirmText="초기화"
        cancelText="취소"
      />

      {/* 라운딩 설정 모달 */}
      <RoundingSettingsModal
        isOpen={isRoundingSettingsModalOpen}
        onClose={handleCloseRoundingSettings}
        onSave={handleSaveRoundingSettings}
        initialSettings={roundingSettings}
        isLoading={isRoundingSettingsLoading}
      />
    </div>
  );
}
