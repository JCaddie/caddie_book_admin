"use client";

import React from "react";
import { VacationActionBar } from "@/modules/vacation/components";
import { useVacationManagement } from "@/modules/vacation/hooks";
import { VACATION_TABLE_COLUMNS } from "@/modules/vacation/constants";
import { AdminPageHeader } from "@/shared/components/layout";
import { DataTable, Pagination, Button } from "@/shared/components/ui";
import { useDocumentTitle } from "@/shared/hooks";
import { VacationRequest } from "@/modules/vacation/types";

export default function VacationManagementPage() {
  const {
    data,
    filters,
    totalCount,
    handleApprove,
    handleReject,
    handleFilterChange,
    handleRowClick,
  } = useVacationManagement();

  // 페이지 타이틀 설정
  useDocumentTitle({ title: "휴무관리" });

  // 액션 컬럼을 포함한 컬럼 정의
  const columns = [
    ...VACATION_TABLE_COLUMNS,
    {
      key: "actions",
      title: "",
      width: 100,
      align: "center" as const,
      render: (_: unknown, record: VacationRequest) => (
        <div className="flex gap-2 justify-center">
          {record.status === "검토 중" && (
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(record.id);
              }}
              className="px-4 py-2 text-sm"
            >
              승인
            </Button>
          )}
          {record.status === "승인" && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleReject(record.id);
              }}
              className="px-4 py-2 text-sm border-primary text-primary"
            >
              취소
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      {/* 페이지 헤더 */}
      <AdminPageHeader title="휴무관리" />

      {/* 상단 액션 바 */}
      <VacationActionBar
        totalCount={totalCount}
        selectedCount={0}
        filters={filters}
        onFilterChange={handleFilterChange}
        onDelete={undefined}
      />

      {/* 테이블 */}
      <div className="rounded-md overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          onRowClick={handleRowClick}
          layout="flexible"
          containerWidth="auto"
          emptyText="휴무 신청 내역이 없습니다."
        />
      </div>

      {/* 페이지네이션 */}
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    </div>
  );
}
