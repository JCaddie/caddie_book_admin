"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SelectableDataTable, Pagination } from "@/shared/components/ui";
import { AdminPageHeader } from "@/shared/components/layout";
import { useCaddieList } from "@/shared/hooks";
import { CaddieFilterBar } from "@/modules/caddie/components";
import { CADDIE_COLUMNS } from "@/shared/constants/caddie";
import { Caddie } from "@/shared/types/caddie";

const CaddieListPage: React.FC = () => {
  const router = useRouter();

  // 캐디 리스트 상태 관리
  const {
    filteredCaddies,
    paddedData,
    filters,
    updateSearchTerm,
    updateSelectedGroup,
    updateSelectedSpecialTeam,
    selection,
    updateSelection,
    handleDeleteSelected,
    currentPage,
    totalPages,
    handlePageChange,
  } = useCaddieList();

  // 행 클릭 핸들러 (상세 페이지로 이동)
  const handleRowClick = (caddie: Caddie) => {
    router.push(`/caddies/${caddie.id}`);
  };

  return (
    <div className="bg-white rounded-xl p-8 space-y-6">
      <AdminPageHeader title="캐디" />

      <CaddieFilterBar
        totalCount={filteredCaddies.length}
        selectedCount={selection.selectedRows.length}
        filters={filters}
        onSearchChange={updateSearchTerm}
        onGroupChange={updateSelectedGroup}
        onSpecialTeamChange={updateSelectedSpecialTeam}
        onDeleteSelected={handleDeleteSelected}
      />

      <div className="space-y-6">
        <SelectableDataTable
          columns={CADDIE_COLUMNS}
          data={paddedData}
          selectable={true}
          selectedRowKeys={selection.selectedRowKeys}
          onSelectChange={updateSelection}
          onRowClick={handleRowClick}
          rowKey="id"
          layout="flexible"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CaddieListPage;
