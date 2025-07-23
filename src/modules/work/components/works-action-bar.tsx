"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button, SearchWithButton } from "@/shared/components/ui";

interface WorksActionBarProps {
  totalCount: number;
  selectedCount: number;
  onDelete: () => void;
  onCreate: () => void;
}

const WorksActionBar: React.FC<WorksActionBarProps> = ({
  totalCount,
  selectedCount,
  onDelete,
  onCreate,
}) => {
  return (
    <div className="flex items-center justify-between">
      {/* 왼쪽: 총 건수 */}
      <div className="text-base font-bold text-black">총 {totalCount}건</div>

      {/* 오른쪽: 검색창 + 버튼들 */}
      <div className="flex items-center gap-8">
        {/* 검색 필드 */}
        <SearchWithButton placeholder="골프장명 검색" />

        {/* 버튼 그룹 */}
        <div className="flex items-center gap-2">
          {/* 삭제 버튼 */}
          <Button
            variant="secondary"
            size="md"
            onClick={onDelete}
            disabled={selectedCount === 0}
            className="w-24"
          >
            삭제
          </Button>

          {/* 생성 버튼 */}
          <Button
            variant="primary"
            size="md"
            icon={<Plus size={24} />}
            onClick={onCreate}
            className="bg-[#FEB912] hover:bg-[#E5A50F] text-white font-semibold w-24"
          >
            생성
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorksActionBar;
