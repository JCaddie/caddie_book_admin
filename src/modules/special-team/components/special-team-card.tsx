"use client";

import { MoreVertical } from "lucide-react";
import { SpecialTeam } from "../types";

interface SpecialTeamCardProps {
  team: SpecialTeam;
  onDragStart?: (team: SpecialTeam) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}

export default function SpecialTeamCard({
  team,
  onDragStart,
  onDragEnd,
  isDragging,
}: SpecialTeamCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(team));
    e.dataTransfer.effectAllowed = "move";
    if (onDragStart) {
      onDragStart(team);
    }
  };

  const handleDragEnd = () => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  return (
    <div
      className={`w-[218px] flex items-center justify-between px-2 py-1.5 bg-white rounded-md border border-[#DDDDDD] ${
        isDragging ? "opacity-50" : ""
      } cursor-move`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center gap-1.5">
        {/* 특수반 색상 배지 */}
        <div className={`w-3 h-3 rounded-full ${team.color} flex-shrink-0`} />

        {/* 특수반 이름 */}
        <span className="text-sm font-medium text-black flex-shrink-0">
          {team.name}
        </span>

        {/* 상태 배지 */}
        <div className="w-0.5 h-4 bg-[#E3E3E3] flex-shrink-0"></div>
        <div
          className={`w-10 h-5 text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 ${
            team.isActive
              ? "bg-[#E8F5E8] text-[#4CAF50]"
              : "bg-[#F5F5F5] text-[#9E9E9E]"
          }`}
        >
          {team.isActive ? "활성" : "비활성"}
        </div>
      </div>

      {/* 메뉴 아이콘 (hover 시에만 표시) */}
      <div className="opacity-0 hover:opacity-100 transition-opacity flex-shrink-0">
        <MoreVertical className="w-5 h-5 text-black/80" />
      </div>
    </div>
  );
}
