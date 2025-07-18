"use client";

import { use, useMemo, useState } from "react";
import { DataTable, Dropdown, Pagination } from "@/shared/components/ui";
import { useCaddieDetail } from "@/modules/caddie/hooks";

interface CaddieDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 근무 이력 데이터 타입
interface WorkHistory extends Record<string, unknown> {
  id: string;
  no: number;
  date: string;
  time: string;
  field: string;
  group: string;
  groupOrder: string;
  cart: string;
}

// 경력 데이터 타입
interface Career {
  id: string;
  period: string;
  status: string;
  company: {
    name: string;
    group: string;
    position: string;
    role: string;
    workScore: string;
  };
  description: string;
}

const CaddieDetailPage: React.FC<CaddieDetailPageProps> = ({ params }) => {
  const resolvedParams = use(params);
  const [selectedRole, setSelectedRole] = useState("캐디");
  const [selectedGroup, setSelectedGroup] = useState("1조");

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

      return {
        id: caddie.id,
        name: caddie.name,
        contractType:
          employmentTypeMap[caddie.employment_type] || caddie.employment_type,
        workplace: `${caddie.golf_course.name} (${caddie.golf_course.region})`,
        role: "캐디",
        group: caddie.primary_group.name,
        class: "2부", // API 응답에 없는 경우 기본값
        phone: caddie.phone,
        email: "abc@test.com", // API 응답에 없는 경우 기본값
        address:
          "충청북도 청주시 청원구 오창읍 양청송대길 10, 406호(청주미래누리터(지식산업센터))", // 기본값
        specialGroups:
          caddie.special_groups.map((g) => g.name).join(", ") || "없음",
        workScore: caddie.work_score.toString(),
        gender: caddie.gender === "M" ? "남" : "여",
      };
    }

    // 로딩 중이거나 에러시 기본값
    return {
      id: resolvedParams.id,
      name: isLoading ? "로딩 중..." : error ? "데이터 없음" : "홍길동",
      contractType: "정규직",
      workplace: "제이캐디 아카데미",
      role: "캐디",
      group: "1조",
      class: "2부",
      phone: "010-1234-5678",
      email: "abc@test.com",
      address:
        "충청북도 청주시 청원구 오창읍 양청송대길 10, 406호(청주미래누리터(지식산업센터))",
      specialGroups: "없음",
      workScore: "0",
      gender: "남",
    };
  }, [caddie, resolvedParams.id, isLoading, error]);

  // 근무 이력 샘플 데이터
  const workHistory: WorkHistory[] = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        id: `work-${index + 1}`,
        no: index + 1,
        date: "2025.05.26",
        time: "09:00",
        field: "한울(서남)",
        group: "1조",
        groupOrder: index % 2 === 0 ? "1" : "5",
        cart: "카트1",
      })),
    []
  );

  // 경력 샘플 데이터
  const careerHistory: Career[] = useMemo(
    () => [
      {
        id: "career-1",
        period: "YYYY.MM ~ ",
        status: "재직 중",
        company: {
          name: "그룹",
          group: "XX부서",
          position: "사원",
          role: "PPT디자인",
          workScore: "상",
        },
        description:
          "주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.",
      },
      {
        id: "career-2",
        period: "YYYY.MM ~ YYYY.MM",
        status: "",
        company: {
          name: "그룹",
          group: "XX부서",
          position: "사원",
          role: "PPT디자인",
          workScore: "상",
        },
        description:
          "주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.주요 성과입니다.",
      },
    ],
    []
  );

  // 페이지네이션 계산
  const itemsPerPage = 10;
  const totalPages = Math.ceil(workHistory.length / itemsPerPage);
  const currentWorkHistory = workHistory.slice(0, itemsPerPage);

  // 테이블 컬럼 정의 - Figma 디자인 기반 유연한 레이아웃
  const workColumns = [
    { key: "no", title: "No.", width: 48, align: "center" as const },
    { key: "date", title: "일자", width: 160, align: "center" as const },
    { key: "time", title: "시간", align: "center" as const }, // flex
    { key: "field", title: "필드", align: "center" as const }, // flex
    { key: "group", title: "조", align: "center" as const }, // flex
    { key: "groupOrder", title: "조 순서", align: "center" as const }, // flex
    { key: "cart", title: "카트", align: "center" as const }, // flex
  ];

  const roleOptions = [
    { value: "캐디", label: "캐디" },
    { value: "관리자", label: "관리자" },
    { value: "수습", label: "수습" },
  ];

  const groupOptions = [
    { value: "1조", label: "1조" },
    { value: "2조", label: "2조" },
    { value: "3조", label: "3조" },
    { value: "4조", label: "4조" },
  ];

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
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-600">기본 정보</h2>
            <div className="flex gap-4">
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
                      <span className="text-sm text-black">
                        {caddieData.name}
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">계약 형태</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="bg-green-400 text-white px-2 py-1 rounded text-sm font-medium">
                        {caddieData.contractType}
                      </span>
                    </div>
                  </div>

                  {/* 두 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">근무처</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {caddieData.workplace}
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">역할</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <div className="w-[106px]">
                        <Dropdown
                          options={roleOptions}
                          value={selectedRole}
                          onChange={setSelectedRole}
                          placeholder="역할"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 세 번째 행 */}
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
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">그룹</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <div className="w-[106px]">
                        <Dropdown
                          options={groupOptions}
                          value={selectedGroup}
                          onChange={setSelectedGroup}
                          placeholder="그룹"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 네 번째 행 */}
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">특수반</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {caddieData.specialGroups}
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 flex">
                    <div className="w-[120px] bg-gray-50 flex items-center justify-center py-3 px-4 border-r border-gray-200">
                      <span className="text-sm font-bold">근무점수</span>
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3">
                      <span className="text-sm text-black">
                        {caddieData.workScore}
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
                      <span className="text-sm font-bold">거주지</span>
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

          {/* 배정 근무 섹션 */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-600">배정 근무</h2>
            <div className="space-y-6">
              {/* 테이블 */}
              <div className="flex justify-center">
                <DataTable
                  columns={workColumns}
                  data={currentWorkHistory}
                  onRowClick={() => {}}
                  layout="flexible"
                  containerWidth="auto"
                />
              </div>

              {/* 페이지네이션 */}
              <div className="flex justify-center">
                <Pagination totalPages={totalPages} />
              </div>
            </div>
          </div>

          {/* 경력 섹션 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-600">경력</h2>
            <div className="h-px bg-gray-300 w-full"></div>

            <div className="space-y-8">
              {careerHistory.map((career) => (
                <div key={career.id} className="flex gap-8">
                  {/* 기간 및 상태 */}
                  <div className="w-[162px] flex-shrink-0 space-y-2">
                    <div className="text-base text-gray-600">
                      {career.period}
                    </div>
                    {career.status && (
                      <div className="flex gap-2">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                          {career.status}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 경력 상세 정보 */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-3">
                      <div className="text-base font-bold text-gray-600">
                        업체명
                      </div>
                      <div className="bg-gray-50 rounded-md p-6 space-y-6">
                        {/* 기본 정보 */}
                        <div className="grid grid-cols-2 gap-6">
                          <div className="flex items-center gap-6">
                            <div className="w-24 text-gray-600">그룹</div>
                            <div className="bg-white border border-gray-200 rounded px-2 py-1 text-sm text-black">
                              {career.company.group}
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="w-24 text-gray-600">직책</div>
                            <div className="bg-white border border-gray-200 rounded px-2 py-1 text-sm text-black">
                              {career.company.position}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="flex items-center gap-6">
                            <div className="w-24 text-gray-600">직무</div>
                            <div className="bg-white border border-gray-200 rounded px-2 py-1 text-sm text-black">
                              {career.company.role}
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="w-24 text-gray-600">근태 점수</div>
                            <div className="bg-white border border-gray-200 rounded px-2 py-1 text-sm text-black">
                              {career.company.workScore}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 담당업무 및 주요성과 */}
                    <div className="space-y-2">
                      <div className="text-base text-gray-600">
                        담당업무 및 주요성과
                      </div>
                      <div className="bg-white border border-gray-200 rounded-md p-4">
                        <div className="text-sm text-black leading-relaxed">
                          {career.description}
                        </div>
                      </div>
                    </div>
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

export default CaddieDetailPage;
