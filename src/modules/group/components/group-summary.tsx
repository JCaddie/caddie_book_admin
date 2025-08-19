interface GroupSummaryProps {
  primaryGroupCount: number;
  totalCaddies: number;
  groupType?: "PRIMARY" | "SPECIAL";
}

export const GroupSummary: React.FC<GroupSummaryProps> = ({
  primaryGroupCount,
  totalCaddies,
  groupType = "PRIMARY",
}) => {
  const isSpecial = groupType === "SPECIAL";

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div
        className={`rounded-lg p-4 ${
          isSpecial ? "bg-purple-50" : "bg-blue-50"
        }`}
      >
        <div
          className={`text-sm ${
            isSpecial ? "text-purple-600" : "text-blue-600"
          }`}
        >
          {isSpecial ? "특수그룹" : "주그룹"}
        </div>
        <div
          className={`text-2xl font-bold ${
            isSpecial ? "text-purple-900" : "text-blue-900"
          }`}
        >
          {primaryGroupCount}
          {isSpecial ? "개" : "조"}
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
