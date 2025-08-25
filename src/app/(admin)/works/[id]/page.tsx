"use client";

import { notFound } from "next/navigation";
import { use, useEffect } from "react";
import { useDateNavigation } from "@/modules/work/hooks/use-date-navigation";
import { usePersonnelFilter } from "@/modules/work/hooks/use-personnel-filter";
import { useResetModal } from "@/modules/work/hooks/use-reset-modal";
import { useWorkDetail } from "@/modules/work/hooks/use-work-detail";
import { useAutoAssign } from "@/modules/work/hooks/use-auto-assign";
import { useDragAndDrop } from "@/modules/work/hooks/use-drag-and-drop";
import { WorkDetailPageProps } from "@/modules/work/types";
import DateNavigation from "@/modules/work/components/date-navigation";
import WorkSchedule from "@/modules/work/components/work-schedule";
import PersonnelStatus from "@/modules/work/components/personnel-status";
import ConfirmationModal from "@/shared/components/ui/confirmation-modal";
import { generateTimeSlots } from "@/modules/work/constants/work-detail";

export default function WorkDetailPage({
  params,
  searchParams,
}: WorkDetailPageProps) {
  const { id: golfCourseId } = use(params);
  const { date } = use(searchParams);

  // 커스텀 훅들 사용
  const { currentDate, handleDateChange } = useDateNavigation(
    golfCourseId,
    date
  );
  const { isResetModalOpen, openResetModal, closeResetModal, handleReset } =
    useResetModal();

  // 근무 상세 데이터 관리
  const {
    scheduleData,
    detailData,
    isLoading,
    error,
    fields,
    timeSlots,
    personnelStats,
    sourceCaddies,
    fetchScheduleData,
    refreshData,
  } = useWorkDetail(golfCourseId, currentDate);

  // 자동 배정 관리
  const { handleFill } = useAutoAssign(refreshData);

  // 드래그 앤 드롭 관리
  const { draggedCaddie, handleDragStart, handleDragEnd } = useDragAndDrop();

  // 인원 필터 관리
  const { filters, filterOptions, filteredCaddies, updateFilter } =
    usePersonnelFilter(detailData?.filter_metadata, sourceCaddies);

  // 날짜 변경 시 근무표 데이터 조회
  useEffect(() => {
    if (golfCourseId) {
      fetchScheduleData();
    }
  }, [fetchScheduleData, golfCourseId]);

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

  // 골프장 정보가 없는 경우
  if (!golfCourseId) {
    notFound();
  }

  // 시간 슬롯 생성 (API 데이터 기반 또는 기본값)
  const displayTimeSlots = timeSlots || generateTimeSlots();

  // 자동 배정 핸들러
  const handleAutoAssign = async () => {
    if (!scheduleData?.schedules[0]?.id) {
      alert("스케줄 정보를 찾을 수 없습니다.");
      return;
    }

    const formattedDate = currentDate.toISOString().split("T")[0];
    const success = await handleFill(golfCourseId, formattedDate);

    if (!success) {
      alert("자동 배정에 실패했습니다.");
    }
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

      {/* 부 정보 표시 */}
      {scheduleData?.scheduleParts.length && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">부 정보:</span>
          <div className="flex gap-3">
            {scheduleData.scheduleParts.map((part) => (
              <span
                key={part.partNumber}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium"
              >
                {part.partNumber}부 {part.startTime} ~ {part.endTime}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex gap-8">
        {/* 왼쪽: 라운딩 관리 */}
        <WorkSchedule
          fields={fields}
          timeSlots={displayTimeSlots}
          personnelStats={personnelStats}
          draggedCaddie={draggedCaddie}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onFillClick={handleAutoAssign}
          onResetClick={openResetModal}
          scheduleId={scheduleData?.schedules[0]?.id}
          onScheduleUpdate={refreshData}
          availableCaddies={filteredCaddies}
          golfCourseId={golfCourseId}
          date={currentDate.toISOString().split("T")[0]}
          scheduleParts={detailData?.parts || []}
        />

        {/* 오른쪽: 인력 현황 사이드바 */}
        <PersonnelStatus
          filters={filters}
          filteredCaddies={filteredCaddies}
          filterOptions={filterOptions}
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
    </div>
  );
}
