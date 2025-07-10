"use client";

import { useState } from "react";

type ViewType = "daily" | "monthly";

const TeamCountSection = () => {
  const [viewType, setViewType] = useState<ViewType>("daily");

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-800">받은 팀 수</h3>

        {/* 기간 선택 토글 */}
        <div className="bg-gray-100 border border-gray-300 rounded-md p-1">
          <div className="flex">
            <button
              onClick={() => setViewType("daily")}
              className={`px-2 py-1 text-xs font-medium rounded ${
                viewType === "daily"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "bg-transparent text-gray-400"
              }`}
            >
              일간
            </button>
            <button
              onClick={() => setViewType("monthly")}
              className={`px-2 py-1 text-xs font-medium rounded ${
                viewType === "monthly"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "bg-transparent text-gray-400"
              }`}
            >
              월간
            </button>
          </div>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="h-72 bg-gray-50 rounded-md flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-2">차트 영역</div>
            <div className="text-xs text-gray-500">
              실제 구현 시 Chart.js나 Recharts 등의 라이브러리 사용
            </div>
          </div>
        </div>

        {/* 범례 */}
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-800">팀</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCountSection;
