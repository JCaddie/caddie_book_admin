"use client";

import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { AdminDashboardData } from "../../types";

interface WorkerRankingSectionProps {
  data: AdminDashboardData;
}

const WorkerRankingSection = ({ data }: WorkerRankingSectionProps) => {
  const { topWorker, bottomWorker, workStatistics } = data;

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">
          이달의 최다/최소 근무자 현황
        </h3>
      </div>

      <div className="flex gap-2.5 p-4">
        {/* 최다/최소 근무자 카드 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 w-[300px]">
          <div className="space-y-4">
            {/* 최다 근무자 */}
            <div className="text-center space-y-2.5">
              <div className="flex justify-center items-center gap-2.5">
                <ThumbsUpIcon className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-bold text-yellow-600">
                  최다 근무자
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-25 h-25 bg-gray-300 rounded-full"></div>
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-800">
                    {topWorker.name}
                  </div>
                  <div className="text-sm font-bold text-gray-400">
                    {topWorker.position}
                  </div>
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="w-full h-0.5 bg-gray-200"></div>

            {/* 최소 근무자 */}
            <div className="text-center space-y-2.5">
              <div className="flex justify-center items-center gap-2.5">
                <ThumbsDownIcon className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-bold text-gray-600">
                  최소 근무자
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-25 h-25 bg-gray-300 rounded-full"></div>
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-800">
                    {bottomWorker.name}
                  </div>
                  <div className="text-sm font-bold text-gray-400">
                    {bottomWorker.position}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 직종별 순위 그리드 */}
        <div className="flex-1 grid grid-cols-2 gap-2.5">
          {workStatistics.map((stat) => (
            <div
              key={stat.position}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4"
            >
              <div className="space-y-2.5">
                <div className="text-center">
                  <div className="text-sm font-bold text-black">
                    {stat.position}
                  </div>
                </div>

                <div className="space-y-1">
                  {stat.ranking.slice(0, 9).map((worker) => (
                    <div
                      key={worker.rank}
                      className="bg-white border border-gray-200 rounded-md p-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 border border-gray-200 w-6 h-6 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-yellow-600">
                              {worker.rank}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-black">
                            {worker.name}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-black">
                          {worker.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* 빈 공간 채우기 */}
          {Array.from({ length: 6 - workStatistics.length }, (_, index) => (
            <div
              key={`empty-${index}`}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4"
            >
              <div className="space-y-2.5">
                <div className="text-center">
                  <div className="text-sm font-bold text-black">
                    {index === 0
                      ? "실버"
                      : index === 1
                      ? "새싹"
                      : index === 2
                      ? "주말"
                      : `직종${index + 4}`}
                  </div>
                </div>

                <div className="space-y-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((rank) => (
                    <div
                      key={rank}
                      className="bg-white border border-gray-200 rounded-md p-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 border border-gray-200 w-6 h-6 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-yellow-600">
                              {rank}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-black">
                            홍길동
                          </span>
                        </div>
                        <span className="text-sm font-medium text-black">
                          2
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerRankingSection;
