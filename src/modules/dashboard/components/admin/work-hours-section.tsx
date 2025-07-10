"use client";

import { AdminDashboardData } from "../../types";

interface WorkHoursSectionProps {
  data: AdminDashboardData;
}

const WorkHoursSection = ({ data }: WorkHoursSectionProps) => {
  return (
    <div className="bg-white rounded-xl flex flex-col gap-2 w-[272px] h-[366px]">
      {/* 헤더 - 토글 버튼과 동일한 높이 맞추기 */}
      <div className="flex justify-between items-center px-2 min-h-[40px]">
        <h3 className="text-lg font-bold text-gray-800">주간 평균 근무 횟수</h3>
        {/* PeriodToggle과 높이를 맞추기 위한 빈 공간 */}
        <div className="w-[72px] h-[32px]"></div>
      </div>

      {/* 근무 통계 그리드 */}
      <div
        className="border border-gray-200 rounded-xl p-4 flex-1"
        style={{ backgroundColor: "#FFFAF2" }}
      >
        <div className="flex flex-col gap-1 h-full justify-between">
          {data.workStatistics.map((stat, index) => (
            <div
              key={stat.position}
              className="bg-white border border-gray-200 rounded-md px-2 h-[36px] w-[240px]"
            >
              <div className="flex items-center h-full">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#F5F7FF" }}
                  >
                    <span className="text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-black">
                    {stat.position}
                  </span>
                </div>
                <div className="flex-1"></div>
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
