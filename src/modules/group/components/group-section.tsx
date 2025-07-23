"use client";

import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import { CaddieCard } from "@/modules/work/components";
import { CaddieGroupManagement } from "../types";
import { CaddieData } from "@/modules/work/types";

interface GroupSectionProps {
  group: CaddieGroupManagement;
  onDragStart: (caddie: CaddieData, groupId: string) => void;
  onDragEnd: () => void;
  onDrop: (targetGroupId: string, insertIndex?: number) => void;
  draggedCaddie: CaddieData | null;
}

const GroupSection: React.FC<GroupSectionProps> = ({
  group,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedCaddie,
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 컨테이너를 벗어날 때만 상태 초기화
    const rect = e.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = e;

    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      setIsDragOver(false);
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragOver(false);
    setDragOverIndex(null);

    // 드래그된 캐디가 같은 그룹 내에서 순서 변경인지 확인
    if (draggedCaddie && draggedCaddie.group === parseInt(group.id)) {
      // 같은 그룹 내 순서 변경
      if (dragOverIndex !== null) {
        onDrop(group.id, dragOverIndex);
      } else {
        // 마지막 위치로 드롭 (dragOverIndex가 null이면 마지막)
        onDrop(group.id, group.caddies.length);
      }
    } else {
      // 다른 그룹으로 이동
      if (dragOverIndex !== null) {
        onDrop(group.id, dragOverIndex);
      } else {
        // 마지막 위치로 드롭
        onDrop(group.id, group.caddies.length);
      }
    }
  };

  const handleCaddieDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  return (
    <div
      className={`rounded-md ${
        isDragOver
          ? "bg-yellow-50 border-2 border-yellow-400 border-dashed"
          : "bg-gray-100"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 그룹 헤더 */}
      <div className="bg-yellow-400 text-white px-4 py-2 flex justify-between items-center h-12 rounded-t-md">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">{group.name}</span>
          <div className="bg-yellow-100 text-black px-1 rounded text-sm font-bold">
            {group.memberCount}
          </div>
        </div>
        <button className="p-1">
          <MoreVertical className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* 캐디 카드들 */}
      <div className="bg-transparent p-4 flex flex-col gap-2 h-[824px] overflow-y-auto rounded-b-md">
        {group.caddies
          .sort((a, b) => (a.order || 1) - (b.order || 1))
          .map((caddie, index) => (
            <div key={caddie.id} className="relative">
              {/* 드롭 인디케이터 */}
              {dragOverIndex === index && (
                <div className="absolute -top-1 left-0 right-0 h-0.5 bg-yellow-400 z-10" />
              )}

              <div
                draggable
                onDragStart={() => {
                  // 드래그 시작 시 현재 위치 정보를 캐디 데이터에 추가
                  const caddieWithPosition = {
                    ...caddie,
                    currentIndex: index,
                  };
                  onDragStart(caddieWithPosition, group.id);
                }}
                onDragEnd={() => {
                  onDragEnd();
                  setIsDragOver(false);
                  setDragOverIndex(null);
                }}
                onDragOver={(e) => handleCaddieDragOver(e, index)}
                className={`cursor-move ${
                  draggedCaddie?.id === caddie.id ? "opacity-50" : ""
                }`}
              >
                <CaddieCard caddie={caddie} draggable={true} />
              </div>
            </div>
          ))}

        {/* 빈 그룹일 때 드롭 영역 */}
        {group.caddies.length === 0 && (
          <div className="text-center text-gray-500 py-8 h-[824px] flex items-center justify-center">
            캐디를 여기로 드래그하세요
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSection;
