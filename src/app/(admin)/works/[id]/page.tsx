"use client";

import { notFound } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import {
  autoAssignWorkSlots,
  fetchDailyScheduleDetail,
} from "@/modules/work/api";
import { useDateNavigation } from "@/modules/work/hooks/use-date-navigation";
import { usePersonnelFilter } from "@/modules/work/hooks/use-personnel-filter";
import { useResetModal } from "@/modules/work/hooks/use-reset-modal";
import {
  CaddieData,
  Field,
  TimeSlots,
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
import { filterCaddies } from "@/modules/work/utils/work-detail-utils";

export default function WorkDetailPage({
  params,
  searchParams,
}: WorkDetailPageProps) {
  const { id: golfCourseId } = use(params);
  const { date } = use(searchParams);

  // 드래그 상태 관리
  const [draggedCaddie, setDraggedCaddie] = useState<CaddieData | null>(null);

  // 커스텀 훅들 사용
  const { currentDate, handleDateChange } = useDateNavigation(
    golfCourseId,
    date
  );
  const { isResetModalOpen, openResetModal, closeResetModal, handleReset } =
    useResetModal();

  // 골프장 정보 (임시로 하드코딩, 실제로는 API에서 가져와야 함)
  const work = {
    id: golfCourseId,
    golfCourse: "골든베이 골프장",
    golfCourseId: golfCourseId,
  };
  const isLoading = false;
  const error = null;

  // 근무표 데이터 상태
  const [scheduleData, setScheduleData] = useState<{
    date: string;
    golfCourseId: string;
    schedules: Array<{
      id: string;
      golfCourse: string;
      golfCourseName: string;
      scheduleType: string;
      date: string;
      totalStaff: number;
      availableStaff: number;
      status: string;
      createdBy: string;
      createdByName: string;
      partsCount: number;
      timeInterval: number;
      createdAt: string;
      updatedAt: string;
    }>;
    scheduleParts: Array<{
      scheduleId: string;
      partNumber: number;
      startTime: string;
      endTime: string;
    }>;
  } | null>(null);

  // 상세 데이터 상태 (새로운 API 응답 구조용)
  const [detailData, setDetailData] = useState<{
    fields: Array<{
      id: string;
      name: string;
      order: number;
      is_active: boolean;
    }>;
    caddies: Array<{
      id: string;
      name: string;
      phone: string;
      primary_group: {
        id: number;
        name: string;
        order: number;
      };
      primary_group_order: number;
      special_group: {
        id: number;
        name: string;
        order: number;
      };
      special_group_order: number;
      today_status: string | null;
      is_active: boolean;
    }>;
    parts: Array<{
      id: string;
      part_number: number;
      name: string;
      start_time: string;
      end_time: string;
      is_active: boolean;
      slots: Array<{
        id: string;
        start_time: string;
        field_number: number;
        status: string;
        slot_type: string;
        is_locked: boolean;
        caddie: { id: string; name: string } | null;
        special_group: string | null;
        assigned_by: string | null;
        assigned_at: string | null;
      }>;
    }>;
    filter_metadata?: {
      status_options: Array<{ id: string; name: string }>;
      primary_groups: Array<{ id: string; name: string; order: number }>;
      special_groups: Array<{ id: string; name: string; order: number }>;
    };
  } | null>(null);

  // API 응답의 fields를 Field 타입으로 변환하는 함수
  const convertFieldsToFieldType = (
    apiFields:
      | Array<{
          id: string;
          name: string;
          order: number;
          is_active: boolean;
        }>
      | undefined
  ): Field[] => {
    if (!apiFields) return FIELDS;
    return apiFields
      .filter((field) => field.is_active)
      .sort((a, b) => a.order - b.order)
      .map((field) => ({
        id: parseInt(field.id) || 0,
        name: field.name,
      }));
  };
  const [, setIsScheduleLoading] = useState(false);
  const [, setScheduleError] = useState<string | null>(null);

  // API caddies -> 화면용 CaddieData 매핑
  const sourceCaddies: CaddieData[] = (() => {
    if (!detailData?.caddies) return [];
    return detailData.caddies.map((c, idx) => ({
      id: idx + 1, // 내부 표시용 숫자 ID 생성
      name: c.name,
      group: c.primary_group?.id ?? 0,
      badge: c.special_group?.name || "하우스",
      status: c.today_status || "근무",
      originalId: c.id, // 원본 UUID 유지
      order: c.primary_group_order,
      groupName: c.primary_group?.name,
    }));
  })();

  // usePersonnelFilter 훅 사용 (sourceCaddies가 정의된 후에 호출)
  const { filters, filterOptions, filteredCaddies, updateFilter } =
    usePersonnelFilter(detailData?.filter_metadata, sourceCaddies);

  // 필터를 적용한 캐디 리스트
  const displayCaddies = filterCaddies(sourceCaddies, filters);

  // 근무표 데이터 조회
  const fetchScheduleData = useCallback(async () => {
    try {
      setIsScheduleLoading(true);
      setScheduleError(null);

      const formattedDate = currentDate.toISOString().split("T")[0];
      const data = await fetchDailyScheduleDetail(golfCourseId, formattedDate);

      setScheduleData({
        date: data.date,
        golfCourseId: data.golf_course.id,
        schedules: [
          {
            id: data.id,
            golfCourse: data.golf_course.id,
            golfCourseName: data.golf_course.name,
            scheduleType: data.schedule_type,
            date: data.date,
            totalStaff: data.total_staff,
            availableStaff: data.available_staff,
            status: data.status,
            createdBy: data.created_by,
            createdByName: data.created_by,
            partsCount: data.parts.length,
            timeInterval: data.time_interval,
            createdAt: data.created_at,
            updatedAt: data.created_at,
          },
        ],
        scheduleParts: data.parts.map((part) => ({
          scheduleId: data.id,
          partNumber: part.part_number,
          startTime: part.start_time,
          endTime: part.end_time,
        })),
      });

      // 상세 데이터 설정
      setDetailData({
        fields: data.fields,
        caddies: data.caddies,
        parts: data.parts,
        filter_metadata: data.filter_metadata,
      });
    } catch (error) {
      console.error("근무표 조회 실패:", error);
      setScheduleError("근무표 조회에 실패했습니다.");
    } finally {
      setIsScheduleLoading(false);
    }
  }, [currentDate, golfCourseId]);

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

  // 존재하지 않는 근무 정보인 경우
  if (!work) {
    notFound();
  }

  // 시간 슬롯 생성 (API 데이터 기반 또는 기본값)
  const timeSlots = scheduleData?.scheduleParts.length
    ? (() => {
        const result: TimeSlots = { part1: [], part2: [], part3: [] };
        scheduleData.scheduleParts.forEach((part) => {
          const partKey = `part${part.partNumber}` as keyof TimeSlots;
          const slots: string[] = [];
          const currentTime = new Date(`2000-01-01T${part.startTime}`);
          const endTime = new Date(`2000-01-01T${part.endTime}`);
          const tempTime = new Date(currentTime);

          while (tempTime < endTime) {
            slots.push(tempTime.toTimeString().slice(0, 5));
            tempTime.setMinutes(
              tempTime.getMinutes() +
                (scheduleData.schedules[0]?.timeInterval || 10)
            );
          }
          result[partKey] = slots;
        });
        return result;
      })()
    : generateTimeSlots();

  // 공통 드래그 이벤트 핸들러
  const handleDragStart = (caddie: CaddieData) => {
    setDraggedCaddie(caddie);
  };

  const handleDragEnd = () => {
    setDraggedCaddie(null);
  };

  // 자동 배정 핸들러
  const handleAutoAssign = async () => {
    if (!scheduleData?.schedules[0]?.id) {
      alert("스케줄 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const formattedDate = currentDate.toISOString().split("T")[0];
      const result = await autoAssignWorkSlots(golfCourseId, formattedDate, {
        max_assignments: 2,
        min_rest_minutes: 300,
      });

      if (result.success) {
        alert("자동 배정이 완료되었습니다.");
        // 데이터 새로고침
        fetchScheduleData();
      } else {
        alert(result.message || "자동 배정에 실패했습니다.");
      }
    } catch (error) {
      console.error("자동 배정 실패:", error);
      alert("자동 배정 중 오류가 발생했습니다.");
    }
  };

  // 채우기 핸들러 (자동 배정으로 변경)
  const handleFill = () => {
    handleAutoAssign();
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
          fields={convertFieldsToFieldType(detailData?.fields)}
          timeSlots={timeSlots}
          personnelStats={
            scheduleData?.schedules[0]
              ? {
                  total: scheduleData.schedules[0].totalStaff,
                  available: scheduleData.schedules[0].availableStaff,
                }
              : PERSONNEL_STATS
          }
          draggedCaddie={draggedCaddie}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onFillClick={handleFill}
          onResetClick={openResetModal}
          scheduleId={scheduleData?.schedules[0]?.id}
          onScheduleUpdate={fetchScheduleData}
          availableCaddies={displayCaddies}
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
