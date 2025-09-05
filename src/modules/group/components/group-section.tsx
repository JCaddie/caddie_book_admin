"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { CaddieCard } from "@/modules/work/components";
import { CaddieData } from "@/modules/work/types";
import { CaddieGroupManagement } from "../types/group-status";
import { GroupMenu } from "./group-menu";
import { CaddieSearchDropdown } from "./caddie-search-dropdown";
import { UnassignedCaddie } from "@/modules/user/types/user";

interface GroupSectionProps {
  group: CaddieGroupManagement;
  onDragStart: (caddie: CaddieData, groupId: string) => void;
  onDragEnd: () => void;
  onDrop: (targetGroupId: string, insertIndex?: number) => void;
  draggedCaddie: CaddieData | null;
  onEditGroup?: (groupId: string, newName: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  unassignedCaddies?: UnassignedCaddie[];
  onAddCaddieToGroup?: (groupId: string, caddieId: string) => Promise<void>;
  onTemporaryCaddieDelete?: (caddieId: string) => void;
}

const GroupSection: React.FC<GroupSectionProps> = ({
  group,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedCaddie,
  onEditGroup,
  onDeleteGroup,
  unassignedCaddies = [],
  onAddCaddieToGroup,
  onTemporaryCaddieDelete,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  // 캐디 추가 핸들러
  const handleAddCaddie = async (caddieId: string) => {
    if (onAddCaddieToGroup) {
      await onAddCaddieToGroup(group.id, caddieId);
      setIsSearchDropdownOpen(false);
    }
  };

  // 검색 드롭다운 토글
  const toggleSearchDropdown = () => {
    setIsSearchDropdownOpen(!isSearchDropdownOpen);
  };

  // 그룹 영역에 드래그 오버
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);

    // 그룹 영역에 드래그 오버할 때 마지막 위치 인덱스 설정
    if (dragOverIndex !== group.caddies.length) {
      setDragOverIndex(group.caddies.length);
    }
  };

  // 그룹 영역에서 드래그 리브
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // 그룹 영역을 벗어날 때만 드래그 오버 상태 해제
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDragOverIndex(null);
    }
  };

  // 그룹 영역에 드롭
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("GroupSection 드롭:", {
      dragOverIndex,
      groupId: group.id,
      draggedCaddieGroup: draggedCaddie?.group,
      isSameGroup: draggedCaddie && draggedCaddie.group === parseInt(group.id),
    });

    setIsDragOver(false);
    setDragOverIndex(null);

    // 드롭 인덱스 결정
    let insertIndex: number;

    if (dragOverIndex !== null) {
      // 특정 위치에 드롭
      insertIndex = dragOverIndex;
    } else {
      // 그룹 영역에 드롭 (마지막 위치)
      insertIndex = group.caddies.length;
    }

    onDrop(group.id, insertIndex);
  };

  // 캐디 카드 위에 드래그 오버
  const handleCaddieDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (dragOverIndex !== index) {
      console.log("GroupSection 드래그오버:", {
        index,
        dragOverIndex,
        groupId: group.id,
        totalCaddies: group.caddies.length,
      });
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
      <div className="bg-yellow-400 text-white px-4 py-2 flex justify-between items-center h-12 rounded-t-md relative">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">{group.name}</span>
          <div className="bg-yellow-100 text-black px-1 rounded text-sm font-bold">
            {group.memberCount}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* 캐디 추가 버튼 */}
          {onAddCaddieToGroup && unassignedCaddies.length > 0 && (
            <button
              onClick={toggleSearchDropdown}
              className="p-1 hover:bg-yellow-500 rounded transition-colors"
              title="캐디 추가"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          )}
          {/* 그룹 메뉴 */}
          {onEditGroup && onDeleteGroup ? (
            <GroupMenu
              groupId={group.id}
              groupName={group.name}
              onEditGroup={onEditGroup}
              onDeleteGroup={onDeleteGroup}
            />
          ) : (
            <div className="w-6 h-6" />
          )}
        </div>

        {/* 검색 드롭다운 */}
        {isSearchDropdownOpen && (
          <CaddieSearchDropdown
            isOpen={isSearchDropdownOpen}
            onClose={() => setIsSearchDropdownOpen(false)}
            unassignedCaddies={unassignedCaddies}
            onAddCaddie={handleAddCaddie}
          />
        )}
      </div>

      {/* 캐디 카드들 */}
      <div className="bg-transparent p-4 flex flex-col gap-2 h-[824px] overflow-y-auto rounded-b-md">
        {group.caddies
          .sort((a, b) => (a.order || 1) - (b.order || 1))
          .map((caddie, index) => (
            <div
              key={caddie.originalId || `caddie-${index}`}
              className="relative"
            >
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
                <CaddieCard
                  caddie={caddie}
                  draggable={true}
                  onTemporaryCaddieDelete={
                    caddie.isTemporary && onTemporaryCaddieDelete
                      ? () =>
                          onTemporaryCaddieDelete(
                            caddie.originalId || caddie.id.toString()
                          )
                      : undefined
                  }
                />
              </div>
            </div>
          ))}

        {/* 마지막 위치 드롭 인디케이터 */}
        {dragOverIndex === group.caddies.length && (
          <div className="h-0.5 bg-yellow-400 z-10" />
        )}

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
