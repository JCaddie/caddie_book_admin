"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui";
import Search from "@/shared/components/ui/search";

interface FieldActionBarProps {
  totalCount: number;
  selectedCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDeleteClick: () => void;
  onCreateClick: () => void;
}

export const FieldActionBar: React.FC<FieldActionBarProps> = ({
  totalCount,
  selectedCount,
  searchTerm,
  onSearchChange,
  onDeleteClick,
  onCreateClick,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 총 건수 */}
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-black">
            총 {totalCount}건
          </span>
        </div>
        {/* 오른쪽: 검색창 + 버튼들 */}
        <div className="flex items-center gap-8">
          {/* 검색 */}
          <Search
            placeholder="필드명 검색"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearchChange(e.target.value)
            }
            containerClassName="w-[360px]"
          />
          {/* 버튼 그룹 */}
          <div className="flex items-center gap-2">
            {/* 삭제 버튼 */}
            <Button
              variant="secondary"
              size="md"
              onClick={onDeleteClick}
              disabled={selectedCount === 0}
              className="w-24"
            >
              삭제
            </Button>
            {/* 생성 버튼 */}
            <Button
              variant="primary"
              size="md"
              onClick={onCreateClick}
              icon={<Plus size={24} />}
              className="w-24"
            >
              생성
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
