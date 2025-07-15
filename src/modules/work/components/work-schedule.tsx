"use client";

import React, { useState } from "react";
import BaseSchedule from "@/shared/components/schedule/base-schedule";
import { CaddieData, Field, PersonnelStats, TimeSlots } from "../types";
import { SAMPLE_CADDIES } from "../constants/work-detail";
import CaddieCard from "./caddie-card";

interface CaddiePosition {
  fieldIndex: number;
  timeIndex: number;
  part: number;
}

interface WorkScheduleProps {
  fields: Field[];
  timeSlots: TimeSlots;
  personnelStats: PersonnelStats;
  onResetClick: () => void;
  draggedCaddie?: CaddieData | null;
  onDragStart?: (caddie: CaddieData) => void;
  onDragEnd?: () => void;
  hideHeader?: boolean;
  isFullWidth?: boolean;
}

export default function WorkSchedule({
  fields,
  timeSlots,
  personnelStats,
  onResetClick,
  draggedCaddie: externalDraggedCaddie,
  onDragStart: externalOnDragStart,
  onDragEnd: externalOnDragEnd,
  hideHeader = false,
  isFullWidth = false,
}: WorkScheduleProps) {
  // 캐디 위치 상태 관리
  const [caddiePositions, setCaddiePositions] = useState<
    Map<string, CaddiePosition>
  >(new Map());

  // 외부에서 드래그된 캐디들을 저장
  const [externalCaddies, setExternalCaddies] = useState<
    Map<string, CaddieData>
  >(new Map());

  // 드래그 상태 관리 (내부 드래그용)
  const [internalDraggedCaddie, setInternalDraggedCaddie] =
    useState<CaddieData | null>(null);

  // 전체 드래그 상태 (외부 + 내부)
  const draggedCaddie = externalDraggedCaddie || internalDraggedCaddie;

  // 스케줄용 캐디 데이터 (첫 6명만 사용)
  const caddies = SAMPLE_CADDIES.slice(0, 6);

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
    const caddieData = e.dataTransfer.getData("text/plain");

    try {
      const caddie: CaddieData = JSON.parse(caddieData);
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

  // 리셋 핸들러
  const handleReset = () => {
    setCaddiePositions(new Map());
    setExternalCaddies(new Map()); // 외부 캐디들도 초기화
    onResetClick();
  };

  // 캐디 제거 핸들러
  const handleRemove = (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
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
  };

  // 셀 렌더러 (캐디 특화 로직)
  const renderCell = (fieldIndex: number, timeIndex: number, part: number) => {
    const caddie = getCaddieAtPosition(fieldIndex, timeIndex, part);

    if (caddie) {
      return (
        <CaddieCard
          key={`${caddie.id}-${fieldIndex}-${timeIndex}-${part}`}
          caddie={caddie}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          isDragging={draggedCaddie?.id === caddie.id}
        />
      );
    }

    // 빈 슬롯일 때 캐디 특화 텍스트
    let emptyText = "미배정";
    if (part === 2 && timeIndex >= 2) {
      emptyText = "예약없음";
    }

    return (
      <CaddieCard
        key={`empty-${fieldIndex}-${timeIndex}-${part}`}
        isEmpty={true}
        emptyText={emptyText}
      />
    );
  };

  return (
    <BaseSchedule<CaddieData>
      fields={fields}
      timeSlots={timeSlots}
      personnelStats={personnelStats}
      onResetClick={handleReset}
      hideHeader={hideHeader}
      isFullWidth={isFullWidth}
      renderCell={renderCell}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onRemove={handleRemove}
      getItemAtPosition={getCaddieAtPosition}
      draggedItem={draggedCaddie}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />
  );
}
