"use client";

import { use, useMemo } from "react";
import { Pagination } from "@/shared/components/ui";
import { useCaddieDetail } from "@/modules/caddie/hooks";

interface CaddieDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const CaddieDetailPage: React.FC<CaddieDetailPageProps> = ({ params }) => {
  const resolvedParams = use(params);

  // 캐디 상세정보 API 연결
  const { caddie, isLoading, error } = useCaddieDetail(resolvedParams.id);

  // 캐디 데이터 (API 응답 또는 기본값)
  const caddieData = useMemo(() => {
    if (caddie) {
      // 고용 형태 한글 변환
      const employmentTypeMap: Record<string, string> = {
        FULL_TIME: "정규직",
        PART_TIME: "시간제",
        CONTRACT: "계약직",
        TEMPORARY: "임시직",
      };

      // 주 그룹 찾기
      const primaryGroup = caddie.group_memberships.find((gm) => gm.is_primary);

      // 기타 활성 그룹들
      const otherGroups = caddie.group_memberships.filter(
        (gm) => !gm.is_primary && gm.is_active
      );

      return {
        id: caddie.id,
        name: caddie.name,
        gender: caddie.gender === "M" ? "남" : "여",
        employmentType:
          employmentTypeMap[caddie.employment_type] || caddie.employment_type,
        golfCourse: `${caddie.golf_course.name} (${caddie.golf_course.region})`,
        role: caddie.role_display.role,
        isTeamLeader: caddie.is_team_leader,
        primaryGroup: primaryGroup ? primaryGroup.group.name : "없음",
        primaryGroupDescription: primaryGroup
          ? primaryGroup.group.description
          : "",
        otherGroups:
          otherGroups.map((gm) => gm.group.name).join(", ") || "없음",
        phone: caddie.phone,
        email: caddie.email,
        address: caddie.address,
        workScore: caddie.work_score.toString(),
        assignedWork: caddie.assigned_work,
        careers: caddie.careers,
      };
    }

    // 로딩 중이거나 에러시 기본값
    return {
      id: resolvedParams.id,
      name: isLoading ? "로딩 중..." : error ? "데이터 없음" : "홍길동",
      gender: "남",
      employmentType: "정규직",
      golfCourse: "제이캐디 아카데미",
      role: "캐디",
      isTeamLeader: false,
      primaryGroup: "1조",
      primaryGroupDescription: "",
      otherGroups: "없음",
      phone: "010-1234-5678",
      email: "abc@test.com",
      address: "충청북도 청주시 청원구 오창읍 양청송대길 10, 406호",
      workScore: "0",
      assignedWork: {
        message: "데이터 없음",
        upcoming_schedules: [],
        current_assignment: null,
      },
      careers: [],
    };
  }, [caddie, resolvedParams.id, isLoading, error]);

  // 배정근무 데이터 (나중에 API에서 가져올 예정)
  // 현재는 빈 상태로 페이지네이션만 기본값 제공
  const totalPages = 1;

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        style={{ minWidth: "1600px" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">캐디 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        style={{ minWidth: "1600px" }}
      >
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">오류가 발생했습니다</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ minWidth: "1600px" }}>
      <div className="bg-white rounded-xl flex-1 flex flex-col">
        {/* 메인 콘텐츠 */}
        <div className="flex-1 p-8 space-y-10">
          {/* 기본 정보 섹션 */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-600">기본 정보</h2>
            <div className="flex gap-6">
              {/* 캐디 사진 */}
              <div className="w-[180px] h-[240px] bg-gray-300 rounded-md flex-shrink-0"></div>

              {/* 정보 테이블 */}
              <div className="flex-1 border border-gray-200 rounded-md">
                <div className="grid grid-cols-2 gap-0">
                  {/* 첫 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">이름</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black font-semibold">
                        {caddieData.name}
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">성별</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {caddieData.gender}
                      </span>
                    </div>
                  </div>

                  {/* 두 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">고용형태</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="bg-green-500 text-white px-3 py-1 rounded text-sm font-medium">
                        {caddieData.employmentType}
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">근무점수</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold">
                        {caddieData.workScore}
                      </span>
                    </div>
                  </div>

                  {/* 세 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">골프장</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {caddieData.golfCourse}
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">역할</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3 gap-2">
                      <span className="text-sm text-black">
                        {caddieData.role}
                      </span>
                      {caddieData.isTeamLeader && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                          팀장
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 네 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">주 그룹</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <div>
                        <div className="text-sm text-black font-medium">
                          {caddieData.primaryGroup}
                        </div>
                        {caddieData.primaryGroupDescription && (
                          <div className="text-xs text-gray-500 mt-1">
                            {caddieData.primaryGroupDescription}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">기타 그룹</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {caddieData.otherGroups}
                      </span>
                    </div>
                  </div>

                  {/* 다섯 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">연락처</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {caddieData.phone}
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">이메일</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {caddieData.email}
                      </span>
                    </div>
                  </div>

                  {/* 여섯 번째 행 */}
                  <div className="col-span-2 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">주소</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {caddieData.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 배정근무 섹션 */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-600">배정근무</h2>
            <div className="space-y-6">
              {/* 빈 상태 표시 - 나중에 API 데이터로 교체될 예정 */}
              <div className="bg-gray-50 border border-gray-200 rounded-md p-8">
                <div className="text-center text-gray-500">
                  <p className="text-sm">배정근무 데이터가 준비 중입니다.</p>
                  <p className="text-xs text-gray-400 mt-2">
                    향후 API에서 데이터를 불러올 예정입니다.
                  </p>
                </div>
              </div>

              {/* 페이지네이션 (현재 비활성화) */}
              <div className="flex justify-center">
                <Pagination totalPages={totalPages} />
              </div>
            </div>
          </div>

          {/* 경력 섹션 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-600">경력</h2>
            <div className="h-px bg-gray-300 w-full"></div>

            {caddieData.careers.length > 0 ? (
              <div className="space-y-6">
                {caddieData.careers.map((career, index) => (
                  <div
                    key={career.id || index}
                    className="bg-gray-50 border border-gray-200 rounded-md p-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm font-bold text-gray-600 mb-2">
                          회사명
                        </div>
                        <div className="text-sm text-black">
                          {career.company || "정보 없음"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-600 mb-2">
                          직책
                        </div>
                        <div className="text-sm text-black">
                          {career.position || "정보 없음"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-600 mb-2">
                          근무기간
                        </div>
                        <div className="text-sm text-black">
                          {career.period || "정보 없음"}
                        </div>
                      </div>
                      <div></div>
                      {career.description && (
                        <div className="col-span-2">
                          <div className="text-sm font-bold text-gray-600 mb-2">
                            상세 설명
                          </div>
                          <div className="text-sm text-black leading-relaxed">
                            {career.description}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-8">
                <div className="text-center text-gray-500">
                  <p className="text-sm">등록된 경력이 없습니다.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaddieDetailPage;
