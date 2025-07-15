"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button, Input } from "@/shared/components/ui";
import { BaseSettingItem, SettingModalConfig } from "@/shared/types";
import { Team, TEAM_COLORS } from "../index";

// 팀 설정 아이템 타입 (BaseSettingItem 확장)
export interface TeamSettingItem extends BaseSettingItem {
  color: string;
  description?: string;
  isActive: boolean;
}

// Team 타입을 TeamSettingItem으로 변환
export const teamToSettingItem = (
  team: Team,
  order: number
): TeamSettingItem => ({
  id: team.id,
  name: team.name,
  order: order,
  color: team.color,
  description: team.description,
  isActive: team.isActive,
});

// TeamSettingItem을 Team 타입으로 변환
export const settingItemToTeam = (item: TeamSettingItem): Team => ({
  id: item.id,
  name: item.name,
  color: item.color,
  description: item.description,
  isActive: item.isActive,
});

// 팀 설정 모달 설정
export const teamSettingModalConfig: SettingModalConfig<TeamSettingItem> = {
  title: "팀 설정",
  emptyMessage: "생성된 팀이 없습니다.\n팀을 생성해주세요.",
  createButtonText: "팀 생성",

  createNewItem: (): TeamSettingItem => {
    const newOrder = Date.now(); // 임시로 타임스탬프 사용
    return {
      id: `team-${Date.now()}`,
      name: `팀`,
      order: newOrder,
      color: TEAM_COLORS[0].value, // 기본 색상
      description: "",
      isActive: true,
    };
  },

  validateItem: (item: TeamSettingItem): string | null => {
    if (!item.name || item.name.trim().length === 0) {
      return "팀 이름을 입력해주세요.";
    }
    if (item.name.trim().length < 2) {
      return "팀 이름은 최소 2자 이상이어야 합니다.";
    }
    if (item.name.trim().length > 20) {
      return "팀 이름은 최대 20자까지 가능합니다.";
    }
    if (!item.color) {
      return "팀 색상을 선택해주세요.";
    }
    return null;
  },

  renderItem: (
    item: TeamSettingItem,
    isSelected: boolean,
    onNameChange: (name: string) => void,
    onDelete: () => void
  ) => (
    <>
      {/* 팀 색상 표시 */}
      <div className="w-6 flex justify-center">
        <div className={`w-3 h-3 rounded-full ${item.color}`} />
      </div>

      {/* 팀 이름 입력 */}
      <Input
        type="text"
        value={item.name}
        onChange={(e) => onNameChange(e.target.value)}
        className="flex-1 h-8 text-sm"
        placeholder="팀 이름"
      />

      {/* 활성 상태 표시 */}
      <div className="w-12 flex justify-center">
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            item.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {item.isActive ? "활성" : "비활성"}
        </span>
      </div>

      {/* 삭제 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </>
  ),
};

// 향상된 생성 함수 (기존 팀들을 고려)
export const createTeamSettingModalConfig = (
  existingTeams: Team[] = []
): SettingModalConfig<TeamSettingItem> => {
  return {
    ...teamSettingModalConfig,
    createNewItem: (): TeamSettingItem => {
      const newOrder = existingTeams.length + 1;
      const colorIndex = existingTeams.length % TEAM_COLORS.length;
      return {
        id: `team-${Date.now()}`,
        name: `팀 ${newOrder}`,
        order: newOrder,
        color: TEAM_COLORS[colorIndex].value,
        description: "",
        isActive: true,
      };
    },
  };
};
