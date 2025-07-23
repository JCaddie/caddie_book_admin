interface GolfCourseInfoProps {
  name: string;
  address: string;
  contractStatus: string;
}

export const GolfCourseInfo: React.FC<GolfCourseInfoProps> = ({
  name,
  address,
  contractStatus,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-600">{address}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">계약상태</div>
          <div
            className={`text-sm font-medium ${
              contractStatus === "active" ? "text-green-600" : "text-red-600"
            }`}
          >
            {contractStatus === "active" ? "활성" : "비활성"}
          </div>
        </div>
      </div>
    </div>
  );
};
