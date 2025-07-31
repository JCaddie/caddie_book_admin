"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import { SpecialGroup } from "../types";

interface SpecialGroupCardProps {
  group?: SpecialGroup;
  isEmpty?: boolean;
  emptyText?: string;
  onDragStart?: (group: SpecialGroup) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  showDeleteButton?: boolean;
  onDelete?: (group: SpecialGroup) => void;
}

export default function SpecialGroupCard({
  group,
  isEmpty = false,
  emptyText = "미배정",
  onDragStart,
  onDragEnd,
  isDragging,
  showDeleteButton = false,
  onDelete,
}: SpecialGroupCardProps) {
  // 빈 슬롯 표시
  if (isEmpty) {
    return (
      <div className="w-[218px] h-auto flex items-center justify-center px-2 py-1.5 bg-white rounded-md border border-[#DDDDDD] border-dashed">
        <span className="text-sm font-medium text-[#AEAAAA]">{emptyText}</span>
      </div>
    );
  }

  // 특수반이 없는 경우
  if (!group) return null;

  const handleDragStart = (e: React.DragEvent) => {
    // 타입 식별자와 함께 데이터 설정
    const dragData = {
      type: "special-group",
      data: group,
    };
    e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = "move";
    if (onDragStart) {
      onDragStart(group);
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
        <div className={`w-3 h-3 rounded-full ${group.color} flex-shrink-0`} />

        {/* 특수반 이름 */}
        <span className="text-sm font-medium text-black flex-shrink-0">
          {group.name}
        </span>

        {/* 상태 배지 */}
        <div className="w-0.5 h-4 bg-[#E3E3E3] flex-shrink-0"></div>
        <div
          className={`w-10 h-5 text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 ${
            group.isActive
              ? "bg-[#E8F5E8] text-[#4CAF50]"
              : "bg-[#F5F5F5] text-[#9E9E9E]"
          }`}
        >
          {group.isActive ? "활성" : "비활성"}
        </div>
      </div>

      {/* 삭제 버튼 또는 메뉴 아이콘 */}
      <div className="opacity-0 hover:opacity-100 transition-opacity flex-shrink-0">
        {showDeleteButton && onDelete ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(group);
            }}
            className="p-1 hover:bg-red-50 rounded transition-colors"
            title="특수반 삭제"
          >
            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
          </button>
        ) : (
          <MoreVertical className="w-5 h-5 text-black/80" />
        )}
      </div>
    </div>
  );
}
