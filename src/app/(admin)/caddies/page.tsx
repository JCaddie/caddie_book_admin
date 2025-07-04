"use client";

import { Button, Search, Badge, DataTable } from "@/shared/components/ui";

// 캐디 데이터 타입 (Figma 디자인에 맞춤)
interface Caddie extends Record<string, unknown> {
  id: string;
  no: number;
  name: string;
  gender: string;
  workStatus: string;
  group: string;
  groupOrder: number;
  phone: string;
  workScore: string;
}

const CaddieListPage: React.FC = () => {
  // 샘플 데이터 (Figma 디자인에 맞춤)
  const caddies: Caddie[] = Array.from({ length: 20 }, (_, index) => ({
    id: `caddie-${index + 1}`,
    no: index + 1,
    name: "홍길동",
    gender: index % 2 === 0 ? "남" : "여",
    workStatus: index % 3 === 0 ? "근무 중" : "휴무",
    group: `${Math.floor(index / 4) + 1}조`,
    groupOrder: (index % 4) + 1,
    phone: "010-1234-5678",
    workScore: ["상", "중", "하"][index % 3],
  }));

  // 테이블 컬럼 정의 (Figma 디자인에 정확히 맞춤)
  const columns = [
    {
      key: "no",
      title: "No.",
      width: 80, // Figma 스펙: 48px + 패딩
      align: "center" as const,
    },
    {
      key: "name",
      title: "이름",
      width: 240, // Figma 스펙: 240px
      align: "center" as const,
    },
    {
      key: "gender",
      title: "성별",
      align: "center" as const, // 동적 너비
    },
    {
      key: "workStatus",
      title: "근무",
      align: "center" as const, // 동적 너비
    },
    {
      key: "group",
      title: "그룹",
      align: "center" as const, // 동적 너비
    },
    {
      key: "groupOrder",
      title: "그룹 순서",
      align: "center" as const, // 동적 너비
    },
    {
      key: "phone",
      title: "연락처",
      width: 240, // Figma 스펙: 240px
      align: "center" as const,
    },
    {
      key: "workScore",
      title: "근무점수",
      align: "center" as const, // 동적 너비
    },
  ];

  const handleRowClick = (record: Caddie) => {
    console.log("캐디 상세:", record);
    // 실제로는 캐디 상세 페이지로 이동
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">캐디 리스트</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline">엑셀 다운로드</Button>
          <Button className="bg-primary text-white hover:bg-primary/90">
            캐디 등록
          </Button>
        </div>
      </div>

      {/* 검색 영역 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Search placeholder="이름으로 검색" />
          </div>
          <div>
            <Search placeholder="그룹으로 검색" />
          </div>
          <div>
            <Search placeholder="연락처로 검색" />
          </div>
          <div>
            <Button className="bg-primary text-white hover:bg-primary/90">
              검색
            </Button>
          </div>
        </div>
      </div>

      {/* 캐디 목록 - Figma 디자인 정확히 적용 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            전체 캐디 현황 ({caddies.length}명)
          </h3>
          <div className="flex items-center space-x-4">
            <Badge variant="green">
              근무중 {caddies.filter((c) => c.workStatus === "근무 중").length}
              명
            </Badge>
            <Badge variant="gray">
              휴무 {caddies.filter((c) => c.workStatus === "휴무").length}명
            </Badge>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={caddies}
          onRowClick={handleRowClick}
          maxHeight={600}
        />
      </div>
    </div>
  );
};

export default CaddieListPage;
