"use client";

import React, { use, useState } from "react";
import { Button } from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useDocumentTitle } from "@/shared/hooks";
import { Settings } from "lucide-react";
import {
  FIELDS,
  generateTimeSlots,
  PERSONNEL_STATS,
} from "@/modules/work/constants/work-detail";
/* eslint-disable sort-imports */
import {
  DEFAULT_TEAMS,
  TEAM_UI_TEXT,
  Team,
  TeamSchedule,
  TeamSettingModal,
  TeamStatus,
  useTeamDrag,
} from "@/modules/team";

interface TeamsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const TeamsDetailPage: React.FC<TeamsDetailPageProps> = ({ params }) => {
  const { id } = use(params);

  // "me"인 경우 현재 사용자의 골프장 ID 사용, 아니면 전달받은 ID 사용
  const isOwnGolfCourse = id === "me";

  // 페이지 타이틀 설정
  const pageTitle = isOwnGolfCourse ? "내 골프장 팀 관리" : `팀 관리`;
  useDocumentTitle({ title: pageTitle });

  // 팀 드래그 상태 관리
  const { draggedItem, handleDragStart, handleDragEnd } = useTeamDrag<Team>();

  // 모달 상태 관리
  const [isTeamSettingModalOpen, setIsTeamSettingModalOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);

  // 시간 슬롯 생성
  const timeSlots = generateTimeSlots();

  // 팀 설정 모달 핸들러
  const handleOpenTeamSetting = () => {
    setIsTeamSettingModalOpen(true);
  };

  const handleCloseTeamSetting = () => {
    setIsTeamSettingModalOpen(false);
  };

  const handleSaveTeams = (newTeams: Team[]) => {
    setTeams(newTeams);
    setIsTeamSettingModalOpen(false);
    console.log("팀 설정 저장:", newTeams);
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <AdminPageHeader title={pageTitle} />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-yellow-400 text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
            onClick={handleOpenTeamSetting}
          >
            <Settings className="w-4 h-4" />
            {TEAM_UI_TEXT.buttons.setting}
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex gap-8">
        {/* 왼쪽: 팀 관리 스케줄 */}
        <div className="flex-1">
          <TeamSchedule
            fields={FIELDS}
            timeSlots={timeSlots}
            personnelStats={PERSONNEL_STATS}
            onResetClick={() => {
              console.log("Reset clicked");
            }}
            draggedTeam={draggedItem}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            hideHeader={true}
            isFullWidth={true}
          />
        </div>

        {/* 오른쪽: 팀 현황 */}
        <TeamStatus
          teams={teams}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggedTeam={draggedItem}
        />
      </div>

      {/* 팀 설정 모달 */}
      <TeamSettingModal
        isOpen={isTeamSettingModalOpen}
        onClose={handleCloseTeamSetting}
        onSave={handleSaveTeams}
        initialTeams={teams}
      />
    </div>
  );
};

export default TeamsDetailPage;
