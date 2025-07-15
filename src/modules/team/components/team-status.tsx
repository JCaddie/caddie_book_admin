"use client";

import { Team } from "../types";
import TeamCard from "./team-card";

interface TeamStatusProps {
  teams: Team[];
  onDragStart?: (team: Team) => void;
  onDragEnd?: () => void;
  draggedTeam?: Team | null;
}

export default function TeamStatus({
  teams,
  onDragStart,
  onDragEnd,
  draggedTeam,
}: TeamStatusProps) {
  return (
    <div className="w-[474px] bg-white rounded-lg p-4 h-fit">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[22px] font-bold text-black">팀 현황</h3>
        <div className="flex items-center gap-4">
          <span className="text-base font-medium">총 {teams.length}개 팀</span>
        </div>
      </div>

      {/* 팀 카드 목록 */}
      <div className="space-y-3">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggedTeam?.id === team.id}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {teams.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-base">등록된 팀이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
