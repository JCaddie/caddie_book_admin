"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useDocumentTitle } from "@/shared/hooks";

interface GroupDetailPageProps {
  params: {
    id: string;
  };
}

const GroupDetailPage: React.FC<GroupDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const { id } = params;

  // 페이지 타이틀 설정
  useDocumentTitle({ title: `그룹 상세 - ${id}조` });

  // 모크 데이터 (실제 구현에서는 API로 그룹 정보 가져오기)
  const groupData = {
    id,
    groupName: `${id}조`,
    leaderName: "김철수",
    memberCount: 12,
    activeCount: 10,
    inactiveCount: 2,
    golfCourse: "송도골프클럽",
    members: [
      { name: "김철수", role: "그룹장", status: "활동", score: 88 },
      { name: "이영희", role: "부그룹장", status: "활동", score: 85 },
      { name: "박민수", role: "일반", status: "활동", score: 82 },
      { name: "최수정", role: "일반", status: "활동", score: 87 },
      { name: "정태영", role: "일반", status: "비활동", score: 80 },
      { name: "이미영", role: "일반", status: "활동", score: 89 },
    ],
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleBackClick}
          className="flex items-center gap-2"
        >
          ← 뒤로
        </Button>
        <AdminPageHeader title={`그룹 상세 - ${groupData.groupName}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 그룹 기본 정보 */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">그룹 기본 정보</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">그룹명:</span>
                <span className="font-medium">{groupData.groupName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">그룹장:</span>
                <span className="font-medium">{groupData.leaderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">골프장:</span>
                <span className="font-medium">{groupData.golfCourse}</span>
              </div>
            </div>
          </div>

          {/* 그룹 통계 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">그룹 통계</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {groupData.memberCount}
                </div>
                <div className="text-sm text-gray-600">총원</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {groupData.activeCount}
                </div>
                <div className="text-sm text-gray-600">활동인원</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {groupData.inactiveCount}
                </div>
                <div className="text-sm text-gray-600">비활동인원</div>
              </div>
            </div>
          </div>
        </div>

        {/* 그룹 멤버 목록 */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">그룹 멤버</h3>
            <div className="space-y-3">
              {groupData.members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {member.score}점
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        member.status === "활동"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
