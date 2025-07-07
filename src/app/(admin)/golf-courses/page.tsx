"use client";

import React from "react";
import RoleGuard from "@/shared/components/auth/role-guard";
import { Button, Search } from "@/shared/components/ui";
import {
  AdminPageHeader,
  TableWithPagination,
} from "@/shared/components/layout";
import {
  usePagination,
  useTableData,
  defaultCellRenderer,
  TableItem,
} from "@/shared/hooks";

// 골프장 데이터 타입
interface GolfCourse extends TableItem {
  no: number;
  name: string;
  region: string;
  contractStatus: string;
  phone: string;
  membershipType: string;
  caddies: number;
  fields: number;
}

const GolfCoursesPage: React.FC = () => {
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

  // 페이지네이션 훅 사용
  const { currentPage, totalPages, currentData, handlePageChange } =
    usePagination({
      data: allGolfCourses,
      itemsPerPage: 20,
    });

  // 테이블 데이터 패딩 훅 사용
  const { paddedData } = useTableData({
    data: currentData,
    itemsPerPage: 20,
    emptyRowTemplate: {
      no: 0,
      name: "",
      region: "",
      contractStatus: "",
      phone: "",
      membershipType: "",
      caddies: 0,
      fields: 0,
    },
  });

  // 테이블 컬럼 정의
  const columns = [
    {
      key: "no",
      title: "No.",
      width: 80,
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "name",
      title: "골프장명",
      width: 200,
      align: "left" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "region",
      title: "시/구",
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "contractStatus",
      title: "계약 현황",
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "phone",
      title: "대표 번호",
      width: 150,
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "membershipType",
      title: "회원제/퍼블릭",
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "caddies",
      title: "캐디",
      width: 80,
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
    },
    {
      key: "fields",
      title: "필드",
      width: 80,
      align: "center" as const,
      render: defaultCellRenderer<GolfCourse>,
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

  // 헤더 액션 컴포넌트
  const headerAction = (
    <>
      <Search placeholder="검색어 입력" containerClassName="w-80" />
      <Button variant="primary" size="md">
        생성
      </Button>
    </>
  );

  return (
    <RoleGuard requiredRole="DEVELOPER">
      <div className="bg-white rounded-xl p-8 space-y-6">
        <AdminPageHeader
          title="골프장 리스트"
          totalCount={allGolfCourses.length}
          action={headerAction}
        />

        <TableWithPagination
          columns={columns}
          data={paddedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
          layout="flexible"
        />
      </div>
    </RoleGuard>
  );
};

export default GolfCoursesPage;
