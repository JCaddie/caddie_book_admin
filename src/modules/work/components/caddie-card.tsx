"use client";

import { MoreVertical } from "lucide-react";
import { CaddieCardProps } from "../types";
import {
  getCaddieCardStyle,
  getSpecialBadgeStyle,
} from "../utils/work-detail-utils";

export default function CaddieCard({
  caddie,
  isEmpty = false,
  emptyText = "미배정",
  onDragStart,
  onDragEnd,
  isDragging = false,
  draggable = true,
}: CaddieCardProps) {
  if (isEmpty) {
    return (
      <div className="w-[218px] h-auto flex items-center justify-center px-2 py-1.5 bg-white rounded-md border border-[#DDDDDD]">
        <span className="text-sm font-medium text-[#AEAAAA]">{emptyText}</span>
      </div>
    );
  }

  if (!caddie) return null;

  const cardStyle = getCaddieCardStyle(caddie.status);
  const specialBadgeStyle = getSpecialBadgeStyle(caddie.specialBadge);

  const handleDragStart = (e: React.DragEvent) => {
    // 타입 식별자와 함께 데이터 설정
    const dragData = {
      type: "caddie",
      data: caddie,
    };
    e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = "move";
    onDragStart?.(e);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    onDragEnd?.(e);
  };

  return (
    <div
      className={`w-[218px] flex items-center justify-between px-2 py-1.5 bg-white rounded-md border border-[#DDDDDD] ${cardStyle} ${
        isDragging ? "opacity-50" : ""
      } ${draggable ? "cursor-move" : ""}`}
      draggable={draggable}
      onDragStart={draggable ? handleDragStart : undefined}
      onDragEnd={draggable ? handleDragEnd : undefined}
    >
      <div className="flex items-center gap-1.5">
        {/* 조 배지 */}
        <div className="w-9 h-5 bg-[#DDE9FF] text-[#1061F9] text-xs font-bold rounded-xl flex items-center justify-center flex-shrink-0">
          {caddie.groupName || `${caddie.group}조`}
        </div>

        {/* 이름 */}
        <span className="text-sm font-medium text-black flex-shrink-0">
          {caddie.name}
        </span>

        {/* 특수반 배지 - 고정 너비 */}
        <div className="w-12 h-5 bg-[#FFF5E6] text-black/30 text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
          {caddie.badge}
        </div>

        {/* 상태 구분선 및 배지 */}
        {(caddie.status === "휴무" || caddie.specialBadge) && (
          <>
            <div className="w-0.5 h-4 bg-[#E3E3E3] flex-shrink-0"></div>
            {caddie.status === "휴무" && (
              <div className="w-10 h-5 bg-[#FFF5E6] text-[#FEB912] text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                휴무
              </div>
            )}
            {specialBadgeStyle && (
              <div
                className="w-12 h-5 text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: specialBadgeStyle.bg,
                  color: specialBadgeStyle.text,
                }}
              >
                {caddie.specialBadge}
              </div>
            )}
          </>
        )}
      </div>

      {/* 메뉴 아이콘 (hover 시에만 표시) */}
      <div className="opacity-0 hover:opacity-100 transition-opacity flex-shrink-0">
        <MoreVertical className="w-5 h-5 text-black/80" />
      </div>
    </div>
  );
}
