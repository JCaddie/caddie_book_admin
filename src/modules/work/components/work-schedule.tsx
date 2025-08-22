"use client";

import React, { useState } from "react";
import BaseSchedule from "@/shared/components/schedule/base-schedule";
import { CaddieData, Field, PersonnelStats, TimeSlots } from "../types";
import { SAMPLE_CADDIES } from "../constants/work-detail";
import CaddieCard from "./caddie-card";
import {
  removeSlotAssignment,
  toggleSlotStatus,
  bulkUpdateSlotStatus,
} from "../api/work-api";

interface CaddiePosition {
  fieldIndex: number;
  timeIndex: number;
  part: number;
}

interface WorkScheduleProps {
  fields: Field[];
  timeSlots: TimeSlots;
  personnelStats: PersonnelStats;
  draggedCaddie?: CaddieData | null;
  onDragStart?: (caddie: CaddieData) => void;
  onDragEnd?: () => void;
  hideHeader?: boolean;
  isFullWidth?: boolean;
  onRoundingSettingsClick?: () => void;
  onFillClick?: () => void;
  onResetClick?: () => void;
  scheduleId?: string; // API 호출을 위한 스케줄 ID
  onScheduleUpdate?: () => void; // 스케줄 업데이트 콜백
  availableCaddies?: CaddieData[]; // API에서 받은 캐디 리스트
  scheduleParts?: Array<{
    id: string;
    part_number: number;
    name: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
    slots: Array<{
      id: string;
      start_time: string;
      field_number: number; // 1-based
      status: string;
      slot_type: string;
      is_locked: boolean;
      caddie: string | null; // uuid
      special_group: string | null;
      assigned_by: string | null;
      assigned_at: string | null;
    }>;
  }>;
}

export default function WorkSchedule({
  fields,
  timeSlots,
  personnelStats,
  draggedCaddie: externalDraggedCaddie,
  onDragStart: externalOnDragStart,
  onDragEnd: externalOnDragEnd,
  hideHeader = false,
  isFullWidth = false,
  onRoundingSettingsClick,
  onFillClick,
  onResetClick,
  scheduleId,
  onScheduleUpdate,
  availableCaddies,
  scheduleParts = [],
}: WorkScheduleProps) {
  // 캐디 위치 상태 관리
  const [caddiePositions, setCaddiePositions] = useState<
    Map<string, CaddiePosition>
  >(new Map());

  // 외부에서 드래그된 캐디들을 저장
  const [externalCaddies, setExternalCaddies] = useState<
    Map<string, CaddieData>
  >(new Map());

  // 슬롯 ID 매핑 (fieldIndex_timeIndex_part -> slotId)
  const [slotIdMap, setSlotIdMap] = useState<Map<string, string>>(new Map());

  // 드래그 상태 관리 (내부 드래그용)
  const [internalDraggedCaddie, setInternalDraggedCaddie] =
    useState<CaddieData | null>(null);

  // 전체 드래그 상태 (외부 + 내부)
  const draggedCaddie = externalDraggedCaddie || internalDraggedCaddie;

  // 스케줄용 캐디 데이터 (API에서 전달되면 사용)
  const caddies =
    availableCaddies && availableCaddies.length > 0
      ? availableCaddies
      : SAMPLE_CADDIES.slice(0, 6);

  // API 데이터에서 기존 배치된 캐디를 초기화
  React.useEffect(() => {
    if (!scheduleParts || scheduleParts.length === 0) return;

    const newPositions = new Map<string, CaddiePosition>();
    const newExternal = new Map<string, CaddieData>();
    const newSlotMap = new Map<string, string>();

    const allPartTimes = [
      timeSlots.part1 || [],
      timeSlots.part2 || [],
      timeSlots.part3 || [],
    ];

    scheduleParts.forEach((part) => {
      const partIdx = part.part_number - 1;
      const partTimes = allPartTimes[partIdx] || [];

      part.slots.forEach((slot) => {
        const hhmm = (slot.start_time || "").slice(0, 5);
        const timeIndex = partTimes.findIndex((t) => t === hhmm);
        if (timeIndex === -1) return;

        const fieldIndex = slot.field_number - 1;
        if (fieldIndex < 0) return;

        // 슬롯 ID 매핑 저장
        const slotKey = `${fieldIndex}_${timeIndex}_${part.part_number}`;
        newSlotMap.set(slotKey, slot.id);

        // 배정된 캐디가 있는 경우 위치 초기화
        if (slot.caddie) {
          // availableCaddies가 변하지 않으면 참조가 유지되도록 상위에서 memo되며,
          // 이 이펙트는 scheduleParts/timeSlots 변경에만 반응합니다.
          const found = caddies.find((cd) => cd.originalId === slot.caddie);
          if (found) {
            newExternal.set(found.id.toString(), found);
            const positionKey = `${found.id}_${fieldIndex}_${timeIndex}_${part.part_number}`;
            newPositions.set(positionKey, {
              fieldIndex,
              timeIndex,
              part: part.part_number,
            });
          }
        }
      });
    });

    // 변경 여부 비교 후 필요한 경우에만 업데이트하여 재렌더 루프 방지
    const mapsEqual = (a: Map<string, unknown>, b: Map<string, unknown>) => {
      if (a.size !== b.size) return false;
      for (const [k, v] of a) {
        if (b.get(k) !== v) return false;
      }
      return true;
    };

    setExternalCaddies((prev) =>
      mapsEqual(prev, newExternal) ? prev : newExternal
    );
    setCaddiePositions((prev) =>
      mapsEqual(prev, newPositions) ? prev : newPositions
    );
    setSlotIdMap((prev) => (mapsEqual(prev, newSlotMap) ? prev : newSlotMap));
  }, [scheduleParts, timeSlots]);

  // 특정 위치에 배정된 캐디 찾기
  const getCaddieAtPosition = (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ): CaddieData | null => {
    for (const [positionKey, position] of caddiePositions) {
      if (
        position.fieldIndex === fieldIndex &&
        position.timeIndex === timeIndex &&
        position.part === part
      ) {
        // 위치 키에서 캐디 ID 추출 (형식: "caddieId_fieldIndex_timeIndex_part")
        const caddieId = positionKey.split("_")[0];

        // 기존 캐디 배열에서 먼저 찾기
        const foundCaddie = caddies.find((c) => c.id.toString() === caddieId);
        if (foundCaddie) {
          return foundCaddie;
        }

        // 외부에서 드래그된 캐디들에서 찾기
        const externalCaddie = externalCaddies.get(caddieId);
        if (externalCaddie) {
          return externalCaddie;
        }

        return null;
      }
    }
    return null;
  };

  // 드래그 시작 핸들러
  const handleDragStart = (caddie: CaddieData) => {
    // 외부 드래그 핸들러가 있으면 사용, 없으면 내부 상태 사용
    if (externalOnDragStart) {
      externalOnDragStart(caddie);
    } else {
      setInternalDraggedCaddie(caddie);
    }
  };

  // 드래그 종료 핸들러
  const handleDragEnd = () => {
    // 외부 드래그 핸들러가 있으면 사용, 없으면 내부 상태 사용
    if (externalOnDragEnd) {
      externalOnDragEnd();
    } else {
      setInternalDraggedCaddie(null);
    }
  };

  // 캐디의 배치 횟수 계산 (캐디 특화 로직)
  const getCaddieAssignmentCount = (caddieId: string) => {
    let count = 0;
    for (const [positionKey] of caddiePositions) {
      if (positionKey.startsWith(caddieId + "_")) {
        count++;
      }
    }
    return count;
  };

  // 드롭 핸들러 (캐디 특화 로직 포함)
  const handleDrop = (
    e: React.DragEvent,
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    e.preventDefault();
    const rawData = e.dataTransfer.getData("text/plain");

    try {
      const dragData = JSON.parse(rawData);

      // 타입 검증: 캐디 데이터만 허용
      if (!dragData || dragData.type !== "caddie") {
        console.warn("잘못된 드래그 데이터 타입:", dragData?.type);
        if (externalOnDragEnd) {
          externalOnDragEnd();
        } else {
          setInternalDraggedCaddie(null);
        }
        return;
      }

      const caddie: CaddieData = dragData.data;
      const draggedCaddieId = caddie.id.toString();
      const currentAssignmentCount = getCaddieAssignmentCount(draggedCaddieId);

      // 최대 3번까지만 배치 가능 (캐디 특화 제약)
      if (currentAssignmentCount >= 3) {
        alert(
          `${caddie.name} 캐디는 이미 3번 배치되어 더 이상 배치할 수 없습니다.`
        );
        if (externalOnDragEnd) {
          externalOnDragEnd();
        } else {
          setInternalDraggedCaddie(null);
        }
        return;
      }

      // 캐디를 외부 캐디 맵에 저장
      setExternalCaddies((prev) =>
        new Map(prev).set(caddie.id.toString(), caddie)
      );

      // 위치 업데이트
      setCaddiePositions((prev) => {
        const newPositions = new Map(prev);

        // 해당 위치에 이미 있는 캐디 제거 (드롭 위치에서만)
        const existingPositionKey = Array.from(newPositions.entries()).find(
          ([, position]) =>
            position.fieldIndex === fieldIndex &&
            position.timeIndex === timeIndex &&
            position.part === part
        );

        if (existingPositionKey) {
          newPositions.delete(existingPositionKey[0]);
        }

        // 새로운 위치에 캐디 배치 (고유한 키 생성)
        const positionKey = `${draggedCaddieId}_${fieldIndex}_${timeIndex}_${part}`;
        newPositions.set(positionKey, {
          fieldIndex,
          timeIndex,
          part,
        });

        return newPositions;
      });

      if (externalOnDragEnd) {
        externalOnDragEnd();
      } else {
        setInternalDraggedCaddie(null);
      }
    } catch (error) {
      console.error("Failed to parse caddie data:", error);
    }
  };

  // 드래그 오버 핸들러
  const handleDragOver = (
    e: React.DragEvent,
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    // 드래그 오버 상태 표시를 위한 로직 추가 가능
    void fieldIndex;
    void timeIndex;
    void part;
  };

  // 캐디 제거 핸들러
  const handleRemove = async (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    try {
      const slotKey = `${fieldIndex}_${timeIndex}_${part}`;
      const slotId = slotIdMap.get(slotKey);
      if (scheduleId && slotId) {
        await removeSlotAssignment(scheduleId, {
          slot_id: slotId,
          assignment_type: "caddie",
        });
      }

      // 로컬 상태 업데이트
      setCaddiePositions((prev) => {
        const newPositions = new Map(prev);

        // 해당 위치의 캐디 찾아서 제거
        for (const [positionKey, position] of newPositions) {
          if (
            position.fieldIndex === fieldIndex &&
            position.timeIndex === timeIndex &&
            position.part === part
          ) {
            newPositions.delete(positionKey);
            break; // 첫 번째 매치만 제거 (더블클릭으로 하나씩 제거)
          }
        }

        return newPositions;
      });

      // 스케줄 업데이트 콜백 호출
      if (onScheduleUpdate) {
        onScheduleUpdate();
      }
    } catch (error) {
      console.error("캐디 제거 실패:", error);
      alert("캐디 제거에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 슬롯 상태 토글 핸들러 (available ↔ reserved)
  const handleSlotToggle = async (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    try {
      const slotKey = `${fieldIndex}_${timeIndex}_${part}`;
      const slotId = slotIdMap.get(slotKey);

      if (!slotId) {
        console.warn("슬롯 ID를 찾을 수 없습니다:", slotKey);
        return;
      }

      await toggleSlotStatus(slotId);

      // 스케줄 업데이트 콜백 호출하여 최신 데이터 다시 불러오기
      if (onScheduleUpdate) {
        onScheduleUpdate();
      }
    } catch (error) {
      console.error("슬롯 상태 토글 실패:", error);
      alert("슬롯 상태 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 모든 슬롯을 배치 불가(available)로 변경
  const handleBulkAvailable = async () => {
    try {
      const allSlotIds = Array.from(slotIdMap.values());
      if (allSlotIds.length === 0) {
        alert("변경할 슬롯이 없습니다.");
        return;
      }

      await bulkUpdateSlotStatus(allSlotIds, "available");

      // 스케줄 업데이트 콜백 호출하여 최신 데이터 다시 불러오기
      if (onScheduleUpdate) {
        onScheduleUpdate();
      }
    } catch (error) {
      console.error("일괄 상태 변경 실패:", error);
      alert("일괄 상태 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 모든 슬롯을 배치 가능(reserved)으로 변경
  const handleBulkReserved = async () => {
    try {
      const allSlotIds = Array.from(slotIdMap.values());
      if (allSlotIds.length === 0) {
        alert("변경할 슬롯이 없습니다.");
        return;
      }

      await bulkUpdateSlotStatus(allSlotIds, "reserved");

      // 스케줄 업데이트 콜백 호출하여 최신 데이터 다시 불러오기
      if (onScheduleUpdate) {
        onScheduleUpdate();
      }
    } catch (error) {
      console.error("일괄 상태 변경 실패:", error);
      alert("일괄 상태 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 셀 렌더러 (캐디 특화 로직)
  const renderCell = (fieldIndex: number, timeIndex: number, part: number) => {
    const caddie = getCaddieAtPosition(fieldIndex, timeIndex, part);

    if (caddie) {
      return (
        <CaddieCard
          key={`${caddie.id}-${fieldIndex}-${timeIndex}-${part}`}
          caddie={caddie}
          onDragStart={() => handleDragStart(caddie)}
          onDragEnd={() => handleDragEnd()}
          isDragging={draggedCaddie?.id === caddie.id}
        />
      );
    }

    // 빈 슬롯일 때 텍스트: API 워크 슬롯 상태에 따라 표기
    let emptyText = "미배정";

    const partTimes =
      part === 1
        ? timeSlots.part1
        : part === 2
        ? timeSlots.part2
        : timeSlots.part3;
    const targetTime = partTimes?.[timeIndex];
    const currentPart = scheduleParts.find((p) => p.part_number === part);
    const slot = currentPart?.slots.find(
      (s) =>
        s.field_number === fieldIndex + 1 &&
        (s.start_time || "").slice(0, 5) === targetTime
    );

    if (slot) {
      if (slot.status === "available") {
        emptyText = "배치 불가";
      } else if (slot.status === "reserved") {
        emptyText = "배치 가능";
      }
    } else if (part === 2 && timeIndex >= 2) {
      emptyText = "예약없음";
    }

    return (
      <CaddieCard
        key={`empty-${fieldIndex}-${timeIndex}-${part}`}
        isEmpty={true}
        emptyText={emptyText}
        onClick={
          slot ? () => handleSlotToggle(fieldIndex, timeIndex, part) : undefined
        }
      />
    );
  };

  return (
    <BaseSchedule<CaddieData>
      fields={fields}
      timeSlots={timeSlots}
      personnelStats={personnelStats}
      onResetClick={onResetClick || (() => {})}
      hideHeader={hideHeader}
      isFullWidth={isFullWidth}
      onRoundingSettingsClick={onRoundingSettingsClick}
      onFillClick={onFillClick}
      onBulkAvailableClick={handleBulkAvailable}
      onBulkReservedClick={handleBulkReserved}
      renderCell={renderCell}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onRemove={handleRemove}
      getItemAtPosition={getCaddieAtPosition}
      draggedItem={draggedCaddie}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      activeParts={scheduleParts.map((p) => ({
        part_number: p.part_number,
        name: p.name,
      }))}
    />
  );
}
