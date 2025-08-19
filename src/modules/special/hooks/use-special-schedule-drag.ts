import { useState } from "react";
import { SpecialGroupUI } from "../types";
import { assignSpecialGroupToSlot } from "../api";
import { removeSlotAssignment } from "@/modules/work/api/work-api";

interface SpecialGroupPosition {
  fieldIndex: number;
  timeIndex: number;
  part: number;
}

interface SchedulePart {
  id: string;
  part_number: number;
  name: string;
  start_time: string | null;
  end_time: string | null;
  schedule_matrix: Array<{
    time: string;
    slots: Array<{
      field_number: number;
      work_slot_id: string;
      special_group: {
        id: string;
        name: string;
        member_count: number;
      } | null;
    }>;
  }>;
}

export const useSpecialScheduleDrag = (
  scheduleId?: string,
  scheduleParts: SchedulePart[] = [],
  timeSlots: { part1: string[]; part2: string[]; part3: string[] } = {
    part1: [],
    part2: [],
    part3: [],
  },
  onScheduleUpdate?: () => void,
  onDragEnd?: () => void
) => {
  // 특수반 위치 상태 관리
  const [groupPositions, setGroupPositions] = useState<
    Map<string, SpecialGroupPosition>
  >(new Map());

  // 외부에서 드래그된 특수반들을 저장
  const [externalGroups, setExternalGroups] = useState<
    Map<string, SpecialGroupUI>
  >(new Map());

  // slot ID 매핑을 위한 state
  const [slotIdMap, setSlotIdMap] = useState<
    Map<string, string> // key: fieldIndex_timeIndex_part, value: slot_id
  >(new Map());

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
      // JSON 파싱 검증
      if (!rawData || rawData.trim() === "") {
        console.warn("빈 드래그 데이터");
        if (onDragEnd) onDragEnd();
        return;
      }

      let dragData;
      try {
        dragData = JSON.parse(rawData);
      } catch (parseError) {
        console.error("드래그 데이터 파싱 실패:", parseError);
        alert("잘못된 드래그 데이터 형식입니다.");
        if (onDragEnd) onDragEnd();
        return;
      }

      // 타입 검증: 특수반 데이터만 허용
      if (!dragData || dragData.type !== "special-group") {
        console.warn("특수반만 배치할 수 있습니다. 현재 타입:", dragData?.type);
        alert(
          "특수반만 배치할 수 있습니다. 캐디는 일반 근무표에서 배치해주세요."
        );
        if (onDragEnd) {
          onDragEnd();
        }
        return;
      }

      // 특수반 데이터 검증
      if (!dragData.data || !dragData.data.id) {
        console.error("잘못된 특수반 데이터:", dragData.data);
        alert("잘못된 특수반 데이터입니다.");
        if (onDragEnd) {
          onDragEnd();
        }
        return;
      }

      const group: SpecialGroupUI = dragData.data;

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
      const requestData = {
        part_id: targetPart.id,
        time: time + ":00",
        field_number: fieldIndex + 1,
        special_group_id: group.id,
      };

      await assignSpecialGroupToSlot(scheduleId, requestData);

      // 성공 시 스케줄 업데이트
      if (onScheduleUpdate) {
        onScheduleUpdate();
      }

      if (onDragEnd) {
        onDragEnd();
      }
    } catch (error) {
      console.error("특수반 배치 실패:", error);

      // 에러 타입에 따른 구체적인 메시지
      let errorMessage = "특수반 배치에 실패했습니다.";

      if (error instanceof Error) {
        if (error.message.includes("already assigned")) {
          errorMessage = "해당 시간대에 이미 특수반이 배치되어 있습니다.";
        } else if (error.message.includes("invalid")) {
          errorMessage = "잘못된 배치 정보입니다. 다시 시도해주세요.";
        } else if (error.message.includes("permission")) {
          errorMessage = "배치 권한이 없습니다.";
        } else {
          errorMessage = `배치 실패: ${error.message}`;
        }
      }

      alert(errorMessage);

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

      // 새로운 API 호출
      if (!scheduleId) {
        console.error("스케줄 ID가 없습니다.");
        return;
      }

      await removeSlotAssignment(scheduleId, {
        slot_id: slotId,
        assignment_type: "special",
      });

      // 성공 시 스케줄 업데이트
      if (onScheduleUpdate) {
        onScheduleUpdate();
      }
    } catch (error) {
      console.error("특수반 제거 실패:", error);
      alert("특수반 제거에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return {
    groupPositions,
    setGroupPositions,
    externalGroups,
    setExternalGroups,
    slotIdMap,
    setSlotIdMap,
    handleDrop,
    handleRemove,
  };
};
