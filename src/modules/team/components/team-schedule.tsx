"use client";

import React, { useState } from "react";
import BaseSchedule from "@/shared/components/schedule/base-schedule";
import { Field, PersonnelStats, TimeSlots } from "@/modules/work/types";
import { Team } from "../types";
import TeamCard from "./team-card";

interface TeamPosition {
  fieldIndex: number;
  timeIndex: number;
  part: number;
}

interface TeamScheduleProps {
  fields: Field[];
  timeSlots: TimeSlots;
  personnelStats: PersonnelStats;
  onResetClick: () => void;
  draggedTeam?: Team | null;
  onDragStart?: (team: Team) => void;
  onDragEnd?: () => void;
  hideHeader?: boolean;
  isFullWidth?: boolean;
}

export default function TeamSchedule({
  fields,
  timeSlots,
  personnelStats,
  onResetClick,
  draggedTeam,
  onDragStart,
  onDragEnd,
  hideHeader = false,
  isFullWidth = false,
}: TeamScheduleProps) {
  // 팀 위치 상태 관리
  const [teamPositions, setTeamPositions] = useState<Map<string, TeamPosition>>(
    new Map()
  );

  // 외부에서 드래그된 팀들을 저장
  const [externalTeams, setExternalTeams] = useState<Map<string, Team>>(
    new Map()
  );

  // 특정 위치에 배정된 팀 찾기
  const getTeamAtPosition = (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ): Team | null => {
    for (const [positionKey, position] of teamPositions) {
      if (
        position.fieldIndex === fieldIndex &&
        position.timeIndex === timeIndex &&
        position.part === part
      ) {
        // 위치 키에서 팀 ID 추출
        const teamId = positionKey.split("_")[0];

        // 외부에서 드래그된 팀들에서 찾기
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
    const teamData = e.dataTransfer.getData("text/plain");

    try {
      const team: Team = JSON.parse(teamData);

      // 팀을 외부 팀 맵에 저장
      setExternalTeams((prev) => new Map(prev).set(team.id, team));

      // 위치 업데이트 (교체 로직 추가)
      setTeamPositions((prev) => {
        const newPositions = new Map(prev);

        // 해당 위치에 이미 있는 팀들을 모두 제거 (교체를 위해)
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

        // 새로운 위치에 팀 배치
        const newPositionKey = `${team.id}_${Date.now()}`;
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
      console.error("Failed to parse team data:", error);
    }
  };

  // 팀 제거 핸들러
  const handleRemove = (
    fieldIndex: number,
    timeIndex: number,
    part: number
  ) => {
    setTeamPositions((prev) => {
      const newPositions = new Map(prev);

      // 해당 위치의 팀 찾아서 제거
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
    const team = getTeamAtPosition(fieldIndex, timeIndex, part);

    if (team) {
      return (
        <TeamCard
          key={`${team.id}-${fieldIndex}-${timeIndex}-${part}`}
          team={team}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          isDragging={draggedTeam?.id === team.id}
        />
      );
    }

    // 빈 슬롯일 때 미배정 카드 표시
    return (
      <TeamCard
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
    // 팀 드래그 시각적 피드백을 위한 로직 추가 가능
    void fieldIndex;
    void timeIndex;
    void part;
  };

  return (
    <BaseSchedule<Team>
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
      getItemAtPosition={getTeamAtPosition}
      draggedItem={draggedTeam}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    />
  );
}
