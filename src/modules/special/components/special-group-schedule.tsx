"use client";

import React from "react";
import BaseSchedule from "@/shared/components/schedule/base-schedule";
import { Field, PersonnelStats, TimeSlots } from "@/modules/work/types";
import { SpecialGroupUI } from "../types";
import SpecialScheduleCell from "./special-schedule-cell";
import { useSpecialScheduleDrag } from "../hooks/use-special-schedule-drag";

interface SpecialGroupPosition {
  fieldIndex: number;
  timeIndex: number;
  part: number;
}

// 스케줄 매트릭스 타입 정의
interface ScheduleMatrixSlot {
  field_number: number;
  work_slot_id: string;
  special_group: {
    id: string;
    name: string;
    member_count: number;
  } | null;
}

interface ScheduleMatrix {
  time: string;
  slots: ScheduleMatrixSlot[];
}

interface SchedulePart {
  id: string;
  part_number: number;
  name: string;
  start_time: string | null;
  end_time: string | null;
  schedule_matrix: ScheduleMatrix[];
}

interface SpecialGroupScheduleProps {
  fields: Field[];
  timeSlots: TimeSlots;
  personnelStats: PersonnelStats;
  onResetClick: () => void;
  draggedGroup?: SpecialGroupUI | null;
  onDragStart?: (group: SpecialGroupUI) => void;
  onDragEnd?: () => void;
  hideHeader?: boolean;
  isFullWidth?: boolean;
  scheduleParts?: SchedulePart[]; // API 데이터에서 가져온 스케줄 파트들
  scheduleId?: string; // API 호출을 위한 스케줄 ID
  onScheduleUpdate?: () => void; // 스케줄 업데이트 콜백
}

export default function SpecialGroupSchedule({
  fields,
  timeSlots,
  personnelStats,
  onResetClick,
  draggedGroup,
  onDragStart,
  onDragEnd,
  hideHeader = false,
  isFullWidth = false,
  scheduleParts = [],
  scheduleId,
  onScheduleUpdate,
}: SpecialGroupScheduleProps) {
  // 드래그 앤 드롭 로직을 커스텀 훅으로 분리
  const {
    groupPositions,
    setGroupPositions,
    externalGroups,
    setExternalGroups,
    setSlotIdMap,
    handleDrop,
    handleRemove,
  } = useSpecialScheduleDrag(
    scheduleId,
    scheduleParts,
    timeSlots,
    onScheduleUpdate,
    onDragEnd
  );

  // API 데이터에서 기존 배치된 특수반들을 초기화
  React.useEffect(() => {
    if (!scheduleParts || scheduleParts.length === 0) return;

    const newGroupPositions = new Map<string, SpecialGroupPosition>();
    const newExternalGroups = new Map<string, SpecialGroupUI>();
    const newSlotIdMap = new Map<string, string>();

    // 현재 timeSlots에서 각 부별 시간 배열 가져오기
    const allPartTimes = [
      timeSlots.part1 || [],
      timeSlots.part2 || [],
      timeSlots.part3 || [],
    ];

    scheduleParts.forEach((part) => {
      const partIndex = part.part_number - 1; // part_number는 1부터 시작
      const currentPartTimes = allPartTimes[partIndex] || [];

      part.schedule_matrix.forEach((matrixTimeSlot) => {
        // API 시간과 timeSlots의 시간을 매칭
        const timeIndex = currentPartTimes.findIndex(
          (time) => time === matrixTimeSlot.time
        );

        if (timeIndex !== -1) {
          matrixTimeSlot.slots.forEach((slot) => {
            // field_number는 1부터 시작하므로 -1 해서 인덱스로 변환
            const fieldIndex = slot.field_number - 1;

            if (fieldIndex >= 0) {
              // slot ID 매핑 추가
              const slotKey = `${fieldIndex}_${timeIndex}_${part.part_number}`;
              newSlotIdMap.set(slotKey, slot.work_slot_id);

              if (slot.special_group) {
                const specialGroup: SpecialGroupUI = {
                  id: slot.special_group.id,
                  name: slot.special_group.name,
                  group_type: "SPECIAL",
                  golf_course_id: "", // API에서 제공되지 않으므로 빈 값
                  is_active: true,
                  color: "bg-yellow-400", // 기본 색상
                  member_count: slot.special_group.member_count,
                  isActive: true, // UI 호환성을 위한 별칭
                };

                // 외부 그룹에 추가
                newExternalGroups.set(specialGroup.id, specialGroup);

                // 위치 정보 추가
                const positionKey = `${specialGroup.id}_${slot.work_slot_id}`;
                newGroupPositions.set(positionKey, {
                  fieldIndex,
                  timeIndex,
                  part: part.part_number,
                });
              }
            }
          });
        }
      });
    });

    setExternalGroups(newExternalGroups);
    setGroupPositions(newGroupPositions);
    setSlotIdMap(newSlotIdMap);
  }, [
    scheduleParts,
    timeSlots,
    setExternalGroups,
    setGroupPositions,
    setSlotIdMap,
  ]);

  // 특정 위치에 배정된 특수반 찾기
  const getGroupAtPosition = (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ): SpecialGroupUI | null => {
    for (const [positionKey, position] of groupPositions) {
      if (
        position.fieldIndex === fieldIndex &&
        position.timeIndex === timeIndex &&
        position.part === part
      ) {
        // 위치 키에서 특수반 ID 추출
        const groupId = positionKey.split("_")[0];

        // 외부에서 드래그된 특수반들에서 찾기
        const externalGroup = externalGroups.get(groupId);
        if (externalGroup) {
          return externalGroup;
        }
      }
    }
    return null;
  };

  // 셀 렌더러
  const renderCell = (fieldIndex: number, timeIndex: number, part: number) => {
    const group = getGroupAtPosition(fieldIndex, timeIndex, part);

    return (
      <SpecialScheduleCell
        group={group}
        fieldIndex={fieldIndex}
        timeIndex={timeIndex}
        part={part}
        draggedGroup={draggedGroup}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    );
  };

  // 드래그 오버 핸들러
  const handleDragOver = (
    e: React.DragEvent,
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    e.preventDefault();
    // 특수반 드래그 시각적 피드백을 위한 로직 추가 가능
    void fieldIndex;
    void timeIndex;
    void part;
  };

  return (
    <BaseSchedule<SpecialGroupUI>
      fields={fields}
      timeSlots={timeSlots}
      personnelStats={personnelStats}
      onResetClick={onResetClick}
      hideHeader={hideHeader}
      isFullWidth={isFullWidth}
      activeParts={scheduleParts.map((part) => ({
        part_number: part.part_number,
        name: part.name,
      }))}
      renderCell={renderCell}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onRemove={handleRemove}
      getItemAtPosition={getGroupAtPosition}
      draggedItem={draggedGroup}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    />
  );
}
