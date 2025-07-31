"use client";

import { SpecialGroup } from "../types";
import SpecialGroupCard from "./special-group-card";

interface SpecialGroupStatusProps {
  groups: SpecialGroup[];
  onDragStart?: (group: SpecialGroup) => void;
  onDragEnd?: () => void;
  draggedGroup?: SpecialGroup | null;
}

export default function SpecialGroupStatus({
  groups,
  onDragStart,
  onDragEnd,
  draggedGroup,
}: SpecialGroupStatusProps) {
  return (
    <div className="w-[474px] bg-white rounded-lg p-4 h-fit">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[22px] font-bold text-black">특수반 현황</h3>
        <div className="flex items-center gap-4">
          <span className="text-base font-medium">
            총 {groups.length}개 특수반
          </span>
        </div>
      </div>

      {/* 특수반 카드 목록 */}
      <div className="space-y-3">
        {groups.map((group) => (
          <SpecialGroupCard
            key={group.id}
            group={group}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggedGroup?.id === group.id}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {groups.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-base">등록된 특수반이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
