"use client";

import React, { useState } from "react";
import BaseSchedule from "@/shared/components/schedule/base-schedule";
import { Field, PersonnelStats, TimeSlots } from "@/modules/work/types";
import { SpecialGroup } from "../types";
import SpecialGroupCard from "./special-group-card";

interface SpecialGroupPosition {
  fieldIndex: number;
  timeIndex: number;
  part: number;
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
}: SpecialGroupScheduleProps) {
  // 특수반 위치 상태 관리
  const [groupPositions, setGroupPositions] = useState<
    Map<string, SpecialGroupPosition>
  >(new Map());

  // 외부에서 드래그된 특수반들을 저장
  const [externalGroups, setExternalGroups] = useState<
    Map<string, SpecialGroup>
  >(new Map());

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

      // 타입 검증: 특수반 데이터만 허용
      if (!dragData || dragData.type !== "special-group") {
        console.warn("잘못된 드래그 데이터 타입:", dragData?.type);
        if (onDragEnd) {
          onDragEnd();
        }
        return;
      }

      const group: SpecialGroup = dragData.data;

      // 특수반을 외부 특수반 맵에 저장
      setExternalGroups((prev) => new Map(prev).set(group.id, group));

      // 위치 업데이트 (교체 로직 추가)
      setGroupPositions((prev) => {
        const newPositions = new Map(prev);

        // 해당 위치에 이미 있는 특수반들을 모두 제거 (교체를 위해)
        const keysToDelete: string[] = [];
        for (const [positionKey, position] of newPositions) {
          if (
            position.fieldIndex === fieldIndex &&
            position.timeIndex === timeIndex &&
            position.part === part
          ) {
            keysToDelete.push(positionKey);
          }
        }
        keysToDelete.forEach((key) => newPositions.delete(key));

        // 새로운 위치에 특수반 배치
        const newPositionKey = `${group.id}_${Date.now()}`;
        newPositions.set(newPositionKey, {
          fieldIndex,
          timeIndex,
          part,
        });

        return newPositions;
      });

      if (onDragEnd) {
        onDragEnd();
      }
    } catch (error) {
      console.error("Failed to parse special group data:", error);
    }
  };

  // 특수반 제거 핸들러
  const handleRemove = (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    setGroupPositions((prev) => {
      const newPositions = new Map(prev);

      // 해당 위치의 특수반 찾아서 제거
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
