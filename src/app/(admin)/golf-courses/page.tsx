"use client";

import React, { useState, useMemo } from "react";
import RoleGuard from "@/shared/components/auth/role-guard";
import { Button, Search, DataTable, Pagination } from "@/shared/components/ui";

// 골프장 데이터 타입
interface GolfCourse extends Record<string, unknown> {
  id: string;
  no: number;
  name: string;
  region: string;
  contractStatus: string;
  phone: string;
  membershipType: string;
  caddies: number;
  fields: number;
  isEmpty?: boolean; // 빈 행 식별용
}

const GolfCoursesPage: React.FC = () => {
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 샘플 데이터 (실제로는 API에서 가져옴)
  const allGolfCourses: GolfCourse[] = Array.from(
    { length: 32 },
    (_, index) => ({
      id: `golf-${index + 1}`,
      no: index + 1,
      name: "제이캐디 아카데미",
      region: "서울시 종로구",
      contractStatus: "완료",
      phone: "02-1111-2222",
      membershipType: "회원제",
      caddies: 6,
      fields: 32,
    })
  );

  // 현재 페이지 데이터 계산
  const totalPages = Math.ceil(allGolfCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGolfCourses = allGolfCourses.slice(startIndex, endIndex);

  // 빈 행을 추가하여 항상 20개 row 유지
  const paddedGolfCourses: GolfCourse[] = useMemo(() => {
    const result: GolfCourse[] = [...currentGolfCourses];
    const emptyRowsCount = itemsPerPage - currentGolfCourses.length;

    // 빈 행 추가
    for (let i = 0; i < emptyRowsCount; i++) {
      result.push({
        id: `empty-${i}`,
        no: 0,
        name: "",
        region: "",
        contractStatus: "",
        phone: "",
        membershipType: "",
        caddies: 0,
        fields: 0,
        isEmpty: true,
      });
    }

    return result;
  }, [currentGolfCourses, itemsPerPage]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      key: "no",
      title: "No.",
      width: 80,
      align: "center" as const,
      render: (value: unknown, record: GolfCourse): React.ReactNode => {
        if (record.isEmpty) return null;
        return String(value || "");
      },
    },
    {
      key: "name",
      title: "골프장명",
      width: 200,
      align: "left" as const,
      render: (value: unknown, record: GolfCourse): React.ReactNode => {
        if (record.isEmpty) return null;
        return String(value || "");
      },
    },
    {
      key: "region",
      title: "시/구",
      align: "center" as const,
      render: (value: unknown, record: GolfCourse): React.ReactNode => {
        if (record.isEmpty) return null;
        return String(value || "");
      },
    },
    {
      key: "contractStatus",
      title: "계약 현황",
      align: "center" as const,
      render: (value: unknown, record: GolfCourse): React.ReactNode => {
        if (record.isEmpty) return null;
        return String(value || "");
      },
    },
    {
      key: "phone",
      title: "대표 번호",
      width: 150,
      align: "center" as const,
      render: (value: unknown, record: GolfCourse): React.ReactNode => {
        if (record.isEmpty) return null;
        return String(value || "");
      },
    },
    {
      key: "membershipType",
      title: "회원제/퍼블릭",
      align: "center" as const,
      render: (value: unknown, record: GolfCourse): React.ReactNode => {
        if (record.isEmpty) return null;
        return String(value || "");
      },
    },
    {
      key: "caddies",
      title: "캐디",
      width: 80,
      align: "center" as const,
      render: (value: unknown, record: GolfCourse): React.ReactNode => {
        if (record.isEmpty) return null;
        return String(value || "");
      },
    },
    {
      key: "fields",
      title: "필드",
      width: 80,
      align: "center" as const,
      render: (value: unknown, record: GolfCourse): React.ReactNode => {
        if (record.isEmpty) return null;
        return String(value || "");
      },
    },
  ];

  const handleRowClick = (record: GolfCourse) => {
    // 빈 행인 경우 클릭 이벤트 무시
    if (record.isEmpty) {
      return;
    }
    console.log("골프장 상세:", record);
    // 실제로는 상세 페이지로 이동
  };

  return (
    <RoleGuard requiredRole="DEVELOPER">
      <div className="bg-white rounded-xl p-8 space-y-6">
        {/* 제목 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">골프장 리스트</h2>
        </div>

        {/* 상단 정보 및 검색, 버튼 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-base font-bold text-gray-900">
              총 {allGolfCourses.length}건
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Search placeholder="검색어 입력" containerClassName="w-80" />
            <Button variant="primary" size="md">
              생성
            </Button>
          </div>
        </div>

        {/* 골프장 목록 - DataTable 사용 */}
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={paddedGolfCourses}
            onRowClick={handleRowClick}
            layout="flexible"
          />

          {/* 페이지네이션 */}
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default GolfCoursesPage;
