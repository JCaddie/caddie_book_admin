"use client";

import { SpecialTeam } from "../types";
import SpecialTeamCard from "./special-team-card";

interface SpecialTeamStatusProps {
  specialTeams: SpecialTeam[];
  onDragStart?: (team: SpecialTeam) => void;
  onDragEnd?: () => void;
  draggedTeam?: SpecialTeam | null;
}

export default function SpecialTeamStatus({
  specialTeams,
  onDragStart,
  onDragEnd,
  draggedTeam,
}: SpecialTeamStatusProps) {
  return (
    <div className="w-[474px] bg-white rounded-lg p-4 h-fit">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[22px] font-bold text-black">특수반 현황</h3>
        <div className="flex items-center gap-4">
          <span className="text-base font-medium">
            총 {specialTeams.length}개 특수반
          </span>
        </div>
      </div>

      {/* 특수반 카드 목록 */}
      <div className="space-y-3">
        {specialTeams.map((team) => (
          <SpecialTeamCard
            key={team.id}
            team={team}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggedTeam?.id === team.id}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {specialTeams.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-base">등록된 특수반이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
