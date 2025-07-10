import React from "react";
import { Button, Dropdown, Search } from "@/shared/components/ui";
import { Trash2, Plus } from "lucide-react";
import { USER_CONSTANTS, USER_ROLE_LABELS } from "../constants";

export interface UserActionBarProps {
  totalCount: number;
  selectedCount: number;
  searchTerm: string;
  roleFilter: string;
  onSearchChange: (term: string) => void;
  onRoleFilterChange: (role: string) => void;
  onDeleteClick: () => void;
  onCreateClick: () => void;
}

export const UserActionBar: React.FC<UserActionBarProps> = ({
  totalCount,
  selectedCount,
  searchTerm,
  roleFilter,
  onSearchChange,
  onRoleFilterChange,
  onDeleteClick,
  onCreateClick,
}) => {
  const roleOptions = [
    { value: "", label: USER_CONSTANTS.UI_TEXT.ROLE_FILTER_PLACEHOLDER },
    { value: "master", label: USER_ROLE_LABELS.master },
    { value: "admin", label: USER_ROLE_LABELS.admin },
    { value: "user", label: USER_ROLE_LABELS.user },
  ];

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="font-bold text-base">
          {USER_CONSTANTS.UI_TEXT.TOTAL_COUNT.replace(
            "{count}",
            totalCount.toString()
          )}
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* 삭제 버튼 */}
        <Button
          variant="outline"
          size="sm"
          onClick={onDeleteClick}
          disabled={selectedCount === 0}
          className="flex items-center gap-2 opacity-60"
        >
          <Trash2 size={16} />
          삭제
        </Button>

        {/* 권한 필터 */}
        <Dropdown
          value={roleFilter}
          onChange={onRoleFilterChange}
          options={roleOptions}
          className="w-[106px]"
        />

        {/* 검색 */}
        <Search
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={USER_CONSTANTS.UI_TEXT.SEARCH_PLACEHOLDER}
          className="w-[360px]"
        />

        {/* 생성 버튼 */}
        <Button
          variant="primary"
          size="sm"
          onClick={onCreateClick}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          {USER_CONSTANTS.UI_TEXT.CREATE_BUTTON}
        </Button>
      </div>
    </div>
  );
};
