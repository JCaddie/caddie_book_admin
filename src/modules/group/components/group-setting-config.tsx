"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button, Input } from "@/shared/components/ui";
import { SettingModalConfig } from "@/shared/types";
import { GroupData } from "../types";

// 그룹 설정 모달 설정
export const groupSettingModalConfig: SettingModalConfig<GroupData> = {
  title: "그룹 설정",
  emptyMessage: "생성된 그룹이 없습니다.\n그룹을 생성해주세요.",
  createButtonText: "그룹 생성",

  createNewItem: (): GroupData => {
    const newOrder = Date.now(); // 임시로 타임스탬프 사용, 실제로는 기존 그룹들의 최대값 + 1
    return {
      id: `group-${Date.now()}`,
      name: `그룹`,
      order: newOrder,
    };
  },

  validateItem: (item: GroupData): string | null => {
    if (!item.name || item.name.trim().length === 0) {
      return "그룹 이름을 입력해주세요.";
    }
    if (item.name.trim().length < 2) {
      return "그룹 이름은 최소 2자 이상이어야 합니다.";
    }
    if (item.name.trim().length > 20) {
      return "그룹 이름은 최대 20자까지 가능합니다.";
    }
    return null;
  },

  renderItem: (
    item: GroupData,
    isSelected: boolean,
    onNameChange: (name: string) => void,
    onDelete: () => void
  ) => (
    <>
      <div className="w-3 flex justify-center">
        <span className="text-sm font-bold text-primary">{item.order}</span>
      </div>
      <Input
        type="text"
        value={item.name}
        onChange={(e) => onNameChange(e.target.value)}
        className="flex-1 h-8 text-sm"
      />
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

// 향상된 생성 함수 (기존 그룹들을 고려)
export const createGroupSettingModalConfig = (
  existingGroups: GroupData[] = []
): SettingModalConfig<GroupData> => {
  return {
    ...groupSettingModalConfig,
    createNewItem: (): GroupData => {
      const maxOrder = Math.max(...existingGroups.map((g) => g.order), 0);
      const newOrder = maxOrder + 1;
      return {
        id: `group-${Date.now()}`,
        name: `${newOrder}조`,
        order: newOrder,
      };
    },
  };
};
