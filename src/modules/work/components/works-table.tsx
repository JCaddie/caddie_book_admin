"use client";

import React from "react";
import { SelectableDataTable } from "@/shared/components/ui";
import { Work } from "@/modules/work/types";
import { WORKS_TABLE_COLUMNS } from "@/modules/work/constants";

interface WorksTableProps {
  data: Work[];
  selectedRowKeys: string[];
  onSelectChange: (selectedRowKeys: string[], selectedRows: Work[]) => void;
  onRowClick: (work: Work) => void;
  totalCount: number;
}

const WorksTable: React.FC<WorksTableProps> = ({
  data,
  selectedRowKeys,
  onSelectChange,
  onRowClick,
  totalCount,
}) => {
  return (
    <div className="rounded-md overflow-hidden">
      <SelectableDataTable
        columns={WORKS_TABLE_COLUMNS}
        data={data}
        selectable={true}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={onSelectChange}
        onRowClick={onRowClick}
        layout="flexible"
        containerWidth="auto"
        emptyText="검색된 결과가 없습니다."
        realDataCount={totalCount}
      />
    </div>
  );
};

export default WorksTable;
