"use client";

import React from "react";
import { BaseSettingModal } from "@/shared/components/ui";
import { SpecialGroup, SpecialGroupSettingModalProps } from "../types";
import {
  createSpecialGroupSettingModalConfig,
  settingItemToSpecialGroup,
  SpecialGroupSettingItem,
  specialGroupToSettingItem,
} from "./special-group-setting-config";

const SpecialGroupSettingModal: React.FC<SpecialGroupSettingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGroups = [],
  isLoading = false,
}) => {
  // SpecialGroup 배열을 SpecialGroupSettingItem 배열로 변환
  const initialItems: SpecialGroupSettingItem[] = initialGroups.map(
    (group, index) => specialGroupToSettingItem(group, index + 1)
  );

  // 특수반용 설정 생성
  const config = createSpecialGroupSettingModalConfig(initialGroups);

  // 저장 핸들러 (SpecialGroupSettingItem을 SpecialGroup으로 변환)
  const handleSave = (items: SpecialGroupSettingItem[]) => {
    const groups: SpecialGroup[] = items.map(settingItemToSpecialGroup);
    onSave(groups);
  };

  return (
    <BaseSettingModal<SpecialGroupSettingItem>
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      initialItems={initialItems}
      isLoading={isLoading}
      config={config}
    />
  );
};

export default SpecialGroupSettingModal;
