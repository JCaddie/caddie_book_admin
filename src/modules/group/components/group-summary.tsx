interface GroupSummaryProps {
  primaryGroupCount: number;
  totalCaddies: number;
}

export const GroupSummary: React.FC<GroupSummaryProps> = ({
  primaryGroupCount,
  totalCaddies,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="text-sm text-blue-600">주그룹</div>
        <div className="text-2xl font-bold text-blue-900">
          {primaryGroupCount}조
        </div>
      </div>
      <div className="bg-green-50 rounded-lg p-4">
        <div className="text-sm text-green-600">총 캐디수</div>
        <div className="text-2xl font-bold text-green-900">
          {totalCaddies}명
        </div>
      </div>
    </div>
  );
};
