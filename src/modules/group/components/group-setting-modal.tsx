"use client";

import React from "react";
import { BaseSettingModal } from "@/shared/components/ui";
import { GroupData, GroupSettingModalProps } from "../types";
import { createGroupSettingModalConfig } from "./group-setting-config";

const GroupSettingModal: React.FC<GroupSettingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGroups = [],
  isLoading = false,
}) => {
  // 그룹용 설정 생성
  const config = createGroupSettingModalConfig(initialGroups);

  return (
    <BaseSettingModal<GroupData>
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      initialItems={initialGroups}
      isLoading={isLoading}
      config={config}
    />
  );
};

export default GroupSettingModal;
