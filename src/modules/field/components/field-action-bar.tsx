"use client";

import { Plus } from "lucide-react";
import { Button, Search, DeleteButton } from "@/shared/components/ui";

interface FieldActionBarProps {
  totalCount: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onDeleteClick: () => void;
  onCreateClick: () => void;
  selectedCount?: number;
}

const FieldActionBar: React.FC<FieldActionBarProps> = ({
  totalCount,
  searchValue,
  onSearchChange,
  onDeleteClick,
  onCreateClick,
  selectedCount = 0,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-base font-bold text-black">총 {totalCount}건</div>

      <div className="flex items-center gap-8">
        <DeleteButton
          onClick={onDeleteClick}
          selectedCount={selectedCount}
          variant="text"
          size="md"
          showCount={false}
        />

        <div className="flex items-center gap-2">
          <Search
            placeholder="검색어 입력"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            containerClassName="w-[360px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={onCreateClick}
            icon={<Plus size={24} />}
          >
            생성
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FieldActionBar;
