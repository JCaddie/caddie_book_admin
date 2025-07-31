"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button, Input } from "@/shared/components/ui";
import { BaseSettingItem, SettingModalConfig } from "@/shared/types";
import { SPECIAL_GROUP_COLORS, SpecialGroup } from "../index";

// 특수반 설정 아이템 타입 (BaseSettingItem 확장)
export interface SpecialGroupSettingItem extends BaseSettingItem {
  order: number;
  color: string;
  description?: string;
  isActive: boolean;
}

// SpecialGroup 타입을 SpecialGroupSettingItem으로 변환
export const specialGroupToSettingItem = (
  group: SpecialGroup,
  order: number
): SpecialGroupSettingItem => ({
  id: group.id,
  name: group.name,
  order: order,
  color: group.color,
  description: group.description,
  isActive: group.isActive,
});

// SpecialGroupSettingItem을 SpecialGroup 타입으로 변환
export const settingItemToSpecialGroup = (
  item: SpecialGroupSettingItem
): SpecialGroup => ({
  id: item.id,
  name: item.name,
  color: item.color,
  description: item.description,
  isActive: item.isActive,
});

// 특수반 설정 모달 설정
export const specialGroupSettingModalConfig: SettingModalConfig<SpecialGroupSettingItem> =
  {
    title: "특수반 설정",

    createNewItem: (): SpecialGroupSettingItem => {
      const newOrder = Date.now(); // 임시로 타임스탬프 사용
      return {
        id: `special-group-${Date.now()}`,
        name: `특수반`,
        order: newOrder,
        color: SPECIAL_GROUP_COLORS[0].value, // 기본 색상
        description: "",
        isActive: true,
      };
    },

    validateItem: (item: SpecialGroupSettingItem): string | null => {
      if (!item.name || item.name.trim().length === 0) {
        return "특수반 이름을 입력해주세요.";
      }
      if (item.name.trim().length < 2) {
        return "특수반 이름은 최소 2자 이상이어야 합니다.";
      }
      if (item.name.trim().length > 20) {
        return "특수반 이름은 최대 20자까지 가능합니다.";
      }
      if (!item.color) {
        return "특수반 색상을 선택해주세요.";
      }
      return null;
    },

    renderItem: (
      item: SpecialGroupSettingItem,
      index: number,
      onUpdate: (item: SpecialGroupSettingItem) => void,
      onDelete: (index: number) => void
    ) => (
      <>
        {/* 특수반 색상 표시 */}
        <div className="w-6 flex justify-center">
          <div className={`w-3 h-3 rounded-full ${item.color}`} />
        </div>

        {/* 특수반 이름 입력 */}
        <Input
          type="text"
          value={item.name}
          onChange={(e) => onUpdate({ ...item, name: e.target.value })}
          className="flex-1 h-8 text-sm"
          placeholder="특수반 이름"
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
            onDelete(index);
          }}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </>
    ),
  };

// 향상된 생성 함수 (기존 특수반들을 고려)
export const createSpecialGroupSettingModalConfig = (
  existingGroups: SpecialGroup[] = []
): SettingModalConfig<SpecialGroupSettingItem> => {
  return {
    ...specialGroupSettingModalConfig,
    createNewItem: (): SpecialGroupSettingItem => {
      const newOrder = existingGroups.length + 1;
      const colorIndex = existingGroups.length % SPECIAL_GROUP_COLORS.length;
      return {
        id: `special-group-${Date.now()}`,
        name: `특수반 ${newOrder}`,
        order: newOrder,
        color: SPECIAL_GROUP_COLORS[colorIndex].value,
        description: "",
        isActive: true,
      };
    },
  };
};
