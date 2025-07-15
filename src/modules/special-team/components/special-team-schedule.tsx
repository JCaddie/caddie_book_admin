"use client";

import React, { useState } from "react";
import BaseSchedule from "@/shared/components/schedule/base-schedule";
import { Field, PersonnelStats, TimeSlots } from "@/modules/work/types";
import { SpecialTeam } from "../types";
import SpecialTeamCard from "./special-team-card";

interface SpecialTeamPosition {
  fieldIndex: number;
  timeIndex: number;
  part: number;
}

interface SpecialTeamScheduleProps {
  fields: Field[];
  timeSlots: TimeSlots;
  personnelStats: PersonnelStats;
  onResetClick: () => void;
  draggedTeam?: SpecialTeam | null;
  onDragStart?: (team: SpecialTeam) => void;
  onDragEnd?: () => void;
  hideHeader?: boolean;
  isFullWidth?: boolean;
}

export default function SpecialTeamSchedule({
  fields,
  timeSlots,
  personnelStats,
  onResetClick,
  draggedTeam,
  onDragStart,
  onDragEnd,
  hideHeader = false,
  isFullWidth = false,
}: SpecialTeamScheduleProps) {
  // 특수반 위치 상태 관리
  const [teamPositions, setTeamPositions] = useState<
    Map<string, SpecialTeamPosition>
  >(new Map());

  // 외부에서 드래그된 특수반들을 저장
  const [externalTeams, setExternalTeams] = useState<Map<string, SpecialTeam>>(
    new Map()
  );

  // 특정 위치에 배정된 특수반 찾기
  const getTeamAtPosition = (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ): SpecialTeam | null => {
    for (const [positionKey, position] of teamPositions) {
      if (
        position.fieldIndex === fieldIndex &&
        position.timeIndex === timeIndex &&
        position.part === part
      ) {
        // 위치 키에서 특수반 ID 추출
        const teamId = positionKey.split("_")[0];

        // 외부에서 드래그된 특수반들에서 찾기
        const externalTeam = externalTeams.get(teamId);
        if (externalTeam) {
          return externalTeam;
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

    if (!draggedTeam) return;

    const draggedTeamId = draggedTeam.id;

    // 같은 시간대에 동일한 특수반이 여러 필드에 배치되는 것을 허용
    // 특수반은 캐디와 달리 시간대별 중복 배치 가능

    const newPositions = new Map(teamPositions);

    // 해당 위치에 이미 있는 특수반 제거 (드롭 위치에서만)
    const existingPositionKey = Array.from(newPositions.entries()).find(
      ([, position]) =>
        position.fieldIndex === fieldIndex &&
        position.timeIndex === timeIndex &&
        position.part === part
    );

    if (existingPositionKey) {
      newPositions.delete(existingPositionKey[0]);
    }

    // 새로운 위치에 특수반 배치 (고유한 키 생성)
    const positionKey = `${draggedTeamId}_${fieldIndex}_${timeIndex}_${part}`;
    newPositions.set(positionKey, {
      fieldIndex,
      timeIndex,
      part,
    });

    // 외부에서 드래그된 특수반인 경우 별도 저장
    const newExternalTeams = new Map(externalTeams);
    newExternalTeams.set(draggedTeamId, draggedTeam);
    setExternalTeams(newExternalTeams);

    setTeamPositions(newPositions);

    // 드래그 상태 초기화
    onDragEnd?.();
  };

  // 리셋 핸들러
  const handleReset = () => {
    setTeamPositions(new Map());
    setExternalTeams(new Map());
    onResetClick();
  };

  // 셀 렌더링 함수
  const renderCell = (fieldIndex: number, timeIndex: number, part: number) => {
    const team = getTeamAtPosition(fieldIndex, timeIndex, part);

    if (team) {
      return (
        <SpecialTeamCard
          team={team}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          isDragging={draggedTeam?.id === team.id}
        />
      );
    }

    // 빈 슬롯
    return (
      <div className="w-[218px] h-auto flex items-center justify-center px-2 py-1.5 bg-white rounded-md border border-[#DDDDDD] border-dashed">
        <span className="text-sm font-medium text-[#AEAAAA]">배치 가능</span>
      </div>
    );
  };

  // 드래그 오버 핸들러
  const handleDragOver = (
    e: React.DragEvent,
    _fieldIndex: number,
    _timeIndex: number,
    _part: number
  ) => {
    e.preventDefault();
    // 특수반 드래그 시각적 피드백을 위한 로직 추가 가능
    // 매개변수들은 향후 기능 확장 시 사용 예정
    void _fieldIndex;
    void _timeIndex;
    void _part;
  };

  return (
    <BaseSchedule<SpecialTeam>
      fields={fields}
      timeSlots={timeSlots}
      personnelStats={personnelStats}
      onResetClick={handleReset}
      hideHeader={hideHeader}
      isFullWidth={isFullWidth}
      draggedItem={draggedTeam}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      renderCell={renderCell}
      getItemAtPosition={getTeamAtPosition}
    />
  );
}
