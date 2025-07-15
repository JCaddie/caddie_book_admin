"use client";

import React from "react";
import { BaseSettingModal } from "@/shared/components/ui";
import { Team, TeamSettingModalProps } from "../types";
import {
  createTeamSettingModalConfig,
  settingItemToTeam,
  TeamSettingItem,
  teamToSettingItem,
} from "./team-setting-config";

const TeamSettingModal: React.FC<TeamSettingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTeams = [],
  isLoading = false,
}) => {
  // Team 배열을 TeamSettingItem 배열로 변환
  const initialItems: TeamSettingItem[] = initialTeams.map((team, index) =>
    teamToSettingItem(team, index + 1)
  );

  // 팀용 설정 생성
  const config = createTeamSettingModalConfig(initialTeams);

  // 저장 핸들러 (TeamSettingItem을 Team으로 변환)
  const handleSave = (items: TeamSettingItem[]) => {
    const teams: Team[] = items.map(settingItemToTeam);
    onSave(teams);
  };

  return (
    <BaseSettingModal<TeamSettingItem>
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      initialItems={initialItems}
      isLoading={isLoading}
      config={config}
    />
  );
};

export default TeamSettingModal;
