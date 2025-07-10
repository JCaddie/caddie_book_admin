"use client";

import { AdminDashboardData } from "../../types";

interface WorkHoursSectionProps {
  data: AdminDashboardData;
}

const WorkHoursSection = ({ data }: WorkHoursSectionProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">주간 평균 근무 횟수</h3>
      </div>

      {/* 근무 통계 그리드 */}
      <div className="bg-yellow-50 border border-gray-200 rounded-b-xl p-4">
        <div className="grid grid-cols-1 gap-1">
          {data.workStatistics.map((stat, index) => (
            <div
              key={stat.position}
              className="bg-white border border-gray-200 rounded-md p-2"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 border border-gray-200 w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-600">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-black">
                    {stat.position}
                  </span>
                </div>
                <span className="text-sm font-medium text-black">
                  {stat.averageHours}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkHoursSection;
