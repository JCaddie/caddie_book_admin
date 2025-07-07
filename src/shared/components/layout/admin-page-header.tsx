import React from "react";

interface AdminPageHeaderProps {
  title: string;
  totalCount?: number;
  action?: React.ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  totalCount,
  action,
}) => {
  return (
    <div className="space-y-6">
      {/* 제목 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      {/* 상단 정보 및 액션 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {totalCount !== undefined && (
            <div className="text-base font-bold text-gray-900">
              총 {totalCount}건
            </div>
          )}
        </div>
        {action && <div className="flex items-center gap-4">{action}</div>}
      </div>
    </div>
  );
};

export default AdminPageHeader;
