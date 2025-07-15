"use client";

import React, { use, useState } from "react";
import { Button } from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useDocumentTitle } from "@/shared/hooks";
import { Plus, Settings } from "lucide-react";
import { CaddieData } from "@/modules/work/types";
import { SAMPLE_CADDIES } from "@/modules/work/constants/work-detail";
import {
  DEFAULT_SPECIAL_TEAMS,
  SPECIAL_TEAM_UI_TEXT,
  TIME_SLOTS,
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
  const [draggedCaddie, setDraggedCaddie] = useState<CaddieData | null>(null);

  // 특수반 데이터 (상수에서 가져옴)
  const specialTeams = DEFAULT_SPECIAL_TEAMS.map((team, index) => ({
    ...team,
    caddies: SAMPLE_CADDIES.slice(index * 3, (index + 1) * 3),
  }));

  // 미배정 캐디들
  const unassignedCaddies = SAMPLE_CADDIES.slice(9);

  // 시간 슬롯 (상수에서 가져옴)
  const timeSlots = TIME_SLOTS;

  // 드래그 이벤트 핸들러
  const handleDragStart = (caddie: CaddieData) => {
    setDraggedCaddie(caddie);
  };

  const handleDragEnd = () => {
    setDraggedCaddie(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, teamId: string, timeSlot: string) => {
    e.preventDefault();
    // TODO: 드래그 드롭 로직 구현
    console.log(
      `Drop caddie ${draggedCaddie?.id} to team ${teamId} at ${timeSlot}`
    );
    setDraggedCaddie(null);
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
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {SPECIAL_TEAM_UI_TEXT.buttons.addCaddie}
          </Button>
        </div>
      </div>

      {/* 특수반 관리 테이블 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="w-24 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  시간
                </th>
                {specialTeams.map((team) => (
                  <th
                    key={team.id}
                    className="w-48 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${team.color}`} />
                      {team.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot} className="hover:bg-gray-50">
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {timeSlot}
                  </td>
                  {specialTeams.map((team) => (
                    <td
                      key={team.id}
                      className="px-2 py-4 whitespace-nowrap text-sm text-gray-500"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, team.id, timeSlot)}
                    >
                      <div className="min-h-[40px] border-2 border-dashed border-gray-200 rounded-md p-2 flex items-center justify-center">
                        {/* TODO: 시간대별 캐디 배치 로직 구현 */}
                        <span className="text-gray-400 text-xs">배치 가능</span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 미배정 캐디 목록 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          미배정 캐디
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {unassignedCaddies.map((caddie) => (
            <div
              key={caddie.id}
              className="bg-white rounded-lg p-4 border border-gray-200 cursor-move hover:shadow-md transition-shadow"
              draggable
              onDragStart={() => handleDragStart(caddie)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{caddie.name}</h4>
                  <p className="text-sm text-gray-500">{caddie.badge}</p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    caddie.status === "available"
                      ? "bg-green-400"
                      : "bg-gray-400"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamsDetailPage;
