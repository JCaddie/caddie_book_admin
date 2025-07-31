"use client";

import React, { useState } from "react";
import BaseSchedule from "@/shared/components/schedule/base-schedule";
import { Field, PersonnelStats, TimeSlots } from "@/modules/work/types";
import { SpecialGroup } from "../types";
import SpecialGroupCard from "./special-group-card";
import {
  assignSpecialGroupToSlot,
  removeSpecialGroupFromSlot,
} from "@/modules/work/api/work-api";

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
  draggedGroup?: SpecialGroup | null;
  onDragStart?: (group: SpecialGroup) => void;
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
  // 특수반 위치 상태 관리
  const [groupPositions, setGroupPositions] = useState<
    Map<string, SpecialGroupPosition>
  >(new Map());

  // 외부에서 드래그된 특수반들을 저장
  const [externalGroups, setExternalGroups] = useState<
    Map<string, SpecialGroup>
  >(new Map());

  // slot ID 매핑을 위한 state
  const [slotIdMap, setSlotIdMap] = useState<
    Map<string, string> // key: fieldIndex_timeIndex_part, value: slot_id
  >(new Map());

  // API 데이터에서 기존 배치된 특수반들을 초기화
  React.useEffect(() => {
    if (!scheduleParts || scheduleParts.length === 0) return;

    const newGroupPositions = new Map<string, SpecialGroupPosition>();
    const newExternalGroups = new Map<string, SpecialGroup>();
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
                const specialGroup: SpecialGroup = {
                  id: slot.special_group.id,
                  name: slot.special_group.name,
                  color: "bg-yellow-400", // 기본 색상
                  description: `${slot.special_group.member_count}명`,
                  isActive: true,
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
  }, [scheduleParts, timeSlots]);

  // 특정 위치에 배정된 특수반 찾기
  const getGroupAtPosition = (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ): SpecialGroup | null => {
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

  // 드롭 핸들러
  const handleDrop = async (
    e: React.DragEvent,
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    e.preventDefault();
    const rawData = e.dataTransfer.getData("text/plain");

    try {
      const dragData = JSON.parse(rawData);

      // 타입 검증: 특수반 데이터만 허용
      if (!dragData || dragData.type !== "special-group") {
        console.warn("잘못된 드래그 데이터 타입:", dragData?.type);
        if (onDragEnd) {
          onDragEnd();
        }
        return;
      }

      const group: SpecialGroup = dragData.data;

      // API 호출을 위한 데이터 준비
      if (!scheduleId) {
        console.error("스케줄 ID가 없습니다.");
        return;
      }

      // 해당 part의 정보 찾기
      const targetPart = scheduleParts?.find((p) => p.part_number === part);
      if (!targetPart) {
        console.error("해당 부를 찾을 수 없습니다.");
        return;
      }

      // 시간 정보 가져오기
      const allPartTimes = [
        timeSlots.part1 || [],
        timeSlots.part2 || [],
        timeSlots.part3 || [],
      ];
      const currentPartTimes = allPartTimes[part - 1] || [];
      const time = currentPartTimes[timeIndex];
      if (!time) {
        console.error("시간 정보를 찾을 수 없습니다.");
        return;
      }

      // API 호출
      await assignSpecialGroupToSlot(scheduleId, {
        part_id: targetPart.id,
        time: time + ":00", // HH:MM:SS 형식으로 변환
        field_number: fieldIndex + 1, // 1부터 시작하는 필드 번호
        special_group_id: group.id,
      });

      // 성공 시 스케줄 업데이트
      if (onScheduleUpdate) {
        onScheduleUpdate();
      }

      if (onDragEnd) {
        onDragEnd();
      }
    } catch (error) {
      console.error("특수반 배치 실패:", error);
      alert("특수반 배치에 실패했습니다. 다시 시도해주세요.");
      if (onDragEnd) {
        onDragEnd();
      }
    }
  };

  // 특수반 제거 핸들러
  const handleRemove = async (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    try {
      // slot ID 찾기
      const slotKey = `${fieldIndex}_${timeIndex}_${part}`;
      const slotId = slotIdMap.get(slotKey);

      if (!slotId) {
        console.error("슬롯 ID를 찾을 수 없습니다.");
        return;
      }

      // API 호출
      await removeSpecialGroupFromSlot(slotId);

      // 성공 시 스케줄 업데이트
      if (onScheduleUpdate) {
        onScheduleUpdate();
      }
    } catch (error) {
      console.error("특수반 제거 실패:", error);
      alert("특수반 제거에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 셀 렌더러
  const renderCell = (fieldIndex: number, timeIndex: number, part: number) => {
    const group = getGroupAtPosition(fieldIndex, timeIndex, part);

    if (group) {
      return (
        <SpecialGroupCard
          key={`${group.id}-${fieldIndex}-${timeIndex}-${part}`}
          group={group}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          isDragging={draggedGroup?.id === group.id}
          showDeleteButton={false} // 워크슬롯에 있는 특수반은 삭제 버튼 숨김
        />
      );
    }

    // 빈 슬롯일 때 미배정 카드 표시
    return (
      <SpecialGroupCard
        key={`empty-${fieldIndex}-${timeIndex}-${part}`}
        isEmpty={true}
        emptyText="배치 가능"
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
    <BaseSchedule<SpecialGroup>
      fields={fields}
      timeSlots={timeSlots}
      personnelStats={personnelStats}
      onResetClick={onResetClick}
      hideHeader={hideHeader}
      isFullWidth={isFullWidth}
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
