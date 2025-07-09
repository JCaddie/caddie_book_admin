"use client";

import React from "react";
import { Button, DeleteButton, Search } from "@/shared/components/ui";

interface FieldActionBarProps {
  totalCount: number;
  selectedCount: number;
  canDelete: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDeleteClick: () => void;
  onCreateClick: () => void;
}

export const FieldActionBar: React.FC<FieldActionBarProps> = ({
  totalCount,
  selectedCount,
  canDelete,
  searchTerm,
  onSearchChange,
  onDeleteClick,
  onCreateClick,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-base font-bold text-black">
          총 {totalCount}건
        </span>
        <DeleteButton
          onClick={onDeleteClick}
          selectedCount={selectedCount}
          disabled={!canDelete}
          variant="text"
          size="md"
          showCount={false}
        />
      </div>

      <div className="flex items-center gap-8">
        <Search
          placeholder="필드명, 골프장명 검색"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          containerClassName="w-[360px]"
        />
        <Button variant="primary" onClick={onCreateClick}>
          + 필드 등록
        </Button>
      </div>
    </div>
  );
};
