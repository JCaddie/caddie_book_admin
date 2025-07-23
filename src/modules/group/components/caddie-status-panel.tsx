interface CaddieStatusPanelProps {
  totalAssignedCaddies: number;
  totalUnassignedCaddies: number;
}

export const CaddieStatusPanel: React.FC<CaddieStatusPanelProps> = ({
  totalAssignedCaddies,
  totalUnassignedCaddies,
}) => {
  const totalCaddies = totalAssignedCaddies + totalUnassignedCaddies;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">캐디 현황</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">전체 캐디</span>
          <span className="text-sm font-medium">{totalCaddies}명</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">배정된 캐디</span>
          <span className="text-sm font-medium">{totalAssignedCaddies}명</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">미배정 캐디</span>
          <span className="text-sm font-medium">
            {totalUnassignedCaddies}명
          </span>
        </div>
      </div>
    </div>
  );
};
