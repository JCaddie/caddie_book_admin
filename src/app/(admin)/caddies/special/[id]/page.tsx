"use client";

import React, { use, useState } from "react";
import { Button } from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useDocumentTitle } from "@/shared/hooks";
import { Settings } from "lucide-react";
import {
  DEFAULT_SPECIAL_GROUPS,
  SPECIAL_GROUP_UI_TEXT,
  SpecialGroup,
  SpecialGroupSchedule,
  SpecialGroupSettingModal,
  SpecialGroupStatus,
  useSpecialGroupDrag,
} from "@/modules/special";
import {
  FIELDS,
  generateTimeSlots,
  PERSONNEL_STATS,
} from "@/modules/work/constants/work-detail";

interface SpecialGroupsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const SpecialGroupsDetailPage: React.FC<SpecialGroupsDetailPageProps> = ({
  params,
}) => {
  const { id } = use(params);

  // "me"인 경우 현재 사용자의 골프장 ID 사용, 아니면 전달받은 ID 사용
  const isOwnGolfCourse = id === "me";

  // 페이지 타이틀 설정
  const pageTitle = isOwnGolfCourse ? "내 골프장 특수반 관리" : `특수반 관리`;
  useDocumentTitle({ title: pageTitle });

  // 특수반 드래그 상태 관리
  const { draggedItem, handleDragStart, handleDragEnd } =
    useSpecialGroupDrag<SpecialGroup>();

  // 모달 상태 관리
  const [isSpecialGroupSettingModalOpen, setIsSpecialGroupSettingModalOpen] =
    useState(false);
  const [specialGroups, setSpecialGroups] = useState<SpecialGroup[]>(
    DEFAULT_SPECIAL_GROUPS
  );

  // 시간 슬롯 생성
  const timeSlots = generateTimeSlots();

  // 특수반 설정 모달 핸들러
  const handleOpenSpecialGroupSetting = () => {
    setIsSpecialGroupSettingModalOpen(true);
  };

  const handleCloseSpecialGroupSetting = () => {
    setIsSpecialGroupSettingModalOpen(false);
  };

  const handleSaveSpecialGroups = (newSpecialGroups: SpecialGroup[]) => {
    setSpecialGroups(newSpecialGroups);
    setIsSpecialGroupSettingModalOpen(false);
    console.log("특수반 설정 저장:", newSpecialGroups);
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <AdminPageHeader title={pageTitle} />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-yellow-400 text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
            onClick={handleOpenSpecialGroupSetting}
          >
            <Settings className="w-4 h-4" />
            {SPECIAL_GROUP_UI_TEXT.buttons.setting}
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex gap-8">
        {/* 왼쪽: 특수반 관리 스케줄 */}
        <div className="flex-1">
          <SpecialGroupSchedule
            fields={FIELDS}
            timeSlots={timeSlots}
            personnelStats={PERSONNEL_STATS}
            onResetClick={() => {
              console.log("Reset clicked");
            }}
            draggedGroup={draggedItem}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            hideHeader={true}
            isFullWidth={true}
          />
        </div>

        {/* 오른쪽: 특수반 현황 */}
        <SpecialGroupStatus
          groups={specialGroups}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggedGroup={draggedItem}
        />
      </div>

      {/* 특수반 설정 모달 */}
      <SpecialGroupSettingModal
        isOpen={isSpecialGroupSettingModalOpen}
        onClose={handleCloseSpecialGroupSetting}
        onSave={handleSaveSpecialGroups}
        initialGroups={specialGroups}
      />
    </div>
  );
};

export default SpecialGroupsDetailPage;
