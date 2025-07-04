"use client";

import RoleGuard from "@/shared/components/auth/role-guard";
import { Button, Search, Badge, DataTable } from "@/shared/components/ui";

// 골프장 데이터 타입
interface GolfCourse extends Record<string, unknown> {
  id: string;
  no: number;
  name: string;
  region: string;
  holes: string;
  registrationDate: string;
  status: string;
}

const GolfCoursesPage: React.FC = () => {
  // 샘플 데이터 (실제로는 API에서 가져옴)
  const golfCourses: GolfCourse[] = Array.from({ length: 20 }, (_, index) => ({
    id: `golf-${index + 1}`,
    no: index + 1,
    name: `골프장 ${index + 1}`,
    region: "경기도",
    holes: "18홀",
    registrationDate: `2024.01.${10 + (index % 20)}`,
    status: "운영중",
  }));

  // 테이블 컬럼 정의
  const columns = [
    {
      key: "no",
      title: "No.",
      width: 80,
      align: "center" as const,
    },
    {
      key: "name",
      title: "골프장명",
      width: 200,
      align: "center" as const,
    },
    {
      key: "region",
      title: "지역",
      align: "center" as const,
    },
    {
      key: "holes",
      title: "홀 수",
      align: "center" as const,
    },
    {
      key: "registrationDate",
      title: "등록일",
      align: "center" as const,
    },
    {
      key: "status",
      title: "상태",
      width: 100,
      align: "center" as const,
      render: (value: unknown) => (
        <Badge variant="green">{String(value)}</Badge>
      ),
    },
    {
      key: "actions",
      title: "관리",
      width: 150,
      align: "center" as const,
      render: () => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-900"
          >
            수정
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-900"
          >
            삭제
          </Button>
        </div>
      ),
    },
  ];

  const handleRowClick = (record: GolfCourse) => {
    console.log("골프장 상세:", record);
    // 실제로는 상세 페이지로 이동
  };
  return (
    <RoleGuard requiredRole="DEVELOPER">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">골프장 관리</h2>
          <p className="text-gray-600 mt-2">
            등록된 골프장을 관리할 수 있습니다. (개발사 권한 전용)
          </p>
        </div>

        {/* 골프장 추가 버튼 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Search placeholder="골프장 검색..." containerClassName="w-64" />
            <Button variant="secondary" size="md">
              검색
            </Button>
          </div>
          <Button variant="primary" size="md">
            새 골프장 추가
          </Button>
        </div>

        {/* 골프장 목록 - DataTable 사용 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">등록된 골프장</h3>
          <DataTable
            columns={columns}
            data={golfCourses}
            onRowClick={handleRowClick}
            maxHeight={600}
          />
        </div>
      </div>
    </RoleGuard>
  );
};

export default GolfCoursesPage;
