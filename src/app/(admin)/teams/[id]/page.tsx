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
import {
  DEFAULT_SPECIAL_TEAMS,
  SPECIAL_TEAM_UI_TEXT,
  SpecialTeam,
  SpecialTeamSchedule,
  SpecialTeamStatus,
} from "@/modules/special-team";

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
  const pageTitle = isOwnGolfCourse ? "내 골프장 특수반 관리" : `특수반 관리`;
  useDocumentTitle({ title: pageTitle });

  // 드래그 상태 관리
  const [draggedTeam, setDraggedTeam] = useState<SpecialTeam | null>(null);

  // 시간 슬롯 생성
  const timeSlots = generateTimeSlots();

  // 특수반 데이터
  const specialTeams = DEFAULT_SPECIAL_TEAMS;

  // 특수반 드래그 이벤트 핸들러
  const handleTeamDragStart = (team: SpecialTeam) => {
    setDraggedTeam(team);
  };

  const handleTeamDragEnd = () => {
    setDraggedTeam(null);
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <AdminPageHeader title={pageTitle} />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-yellow-400 text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            {SPECIAL_TEAM_UI_TEXT.buttons.setting}
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex gap-8">
        {/* 왼쪽: 특수반 관리 스케줄 */}
        <div className="flex-1">
          <SpecialTeamSchedule
            fields={FIELDS}
            timeSlots={timeSlots}
            personnelStats={PERSONNEL_STATS}
            onResetClick={() => {
              console.log("Reset clicked");
            }}
            draggedTeam={draggedTeam}
            onDragStart={handleTeamDragStart}
            onDragEnd={handleTeamDragEnd}
            hideHeader={true}
            isFullWidth={true}
          />
        </div>

        {/* 오른쪽: 특수반 현황 */}
        <SpecialTeamStatus
          specialTeams={specialTeams}
          onDragStart={handleTeamDragStart}
          onDragEnd={handleTeamDragEnd}
          draggedTeam={draggedTeam}
        />
      </div>
    </div>
  );
};

export default TeamsDetailPage;
