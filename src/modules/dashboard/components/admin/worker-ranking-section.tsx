"use client";

import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { AdminDashboardData } from "../../types";

interface WorkerRankingSectionProps {
  data: AdminDashboardData;
}

const WorkerRankingSection = ({ data }: WorkerRankingSectionProps) => {
  const { topWorker, bottomWorker } = data;

  // 직종별 데이터 (10개 항목씩)
  const positions = [
    {
      name: "하우스",
      workers: Array.from({ length: 10 }, (_, i) => ({
        rank: i + 1,
        name: "홍길동",
        count: 6 - (i % 6),
      })),
    },
    {
      name: "마샬",
      workers: Array.from({ length: 10 }, (_, i) => ({
        rank: i + 1,
        name: "홍길동",
        count: 6 - (i % 6),
      })),
    },
    {
      name: "2·3부",
      workers: Array.from({ length: 10 }, (_, i) => ({
        rank: i + 1,
        name: "홍길동",
        count: 6 - (i % 6),
      })),
    },
    {
      name: "3부",
      workers: Array.from({ length: 10 }, (_, i) => ({
        rank: i + 1,
        name: "홍길동",
        count: 6 - (i % 6),
      })),
    },
    {
      name: "새싹",
      workers: Array.from({ length: 10 }, (_, i) => ({
        rank: i + 1,
        name: "홍길동",
        count: 6 - (i % 6),
      })),
    },
  ];

  return (
    <div className="bg-white rounded-xl flex flex-col gap-2">
      {/* 헤더 */}
      <div className="flex justify-between items-center px-2">
        <h3 className="text-lg font-bold text-gray-800">
          이달의 최다/최소 근무자 현황
        </h3>
      </div>

      <div className="flex gap-2.5 bg-gray-50 border border-gray-200 rounded-xl p-4">
        {/* 최다/최소 근무자 카드 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex flex-col space-y-4 w-[120px]">
            {/* 최다 근무자 */}
            <div className="text-center space-y-2.5">
              <div className="flex justify-center items-center gap-2.5">
                <ThumbsUpIcon className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-bold text-yellow-600">
                  최다 근무자
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-[100px] h-[100px] bg-gray-300 rounded-full"></div>
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
                <div className="w-[100px] h-[100px] bg-gray-300 rounded-full"></div>
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

        {/* 직종별 카드들 */}
        <div className="flex gap-2.5 flex-1">
          {positions.map((position) => (
            <div
              key={position.name}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex-1"
            >
              <div className="flex flex-col gap-1 h-full">
                {/* 직종 제목 */}
                <div className="text-center mb-1">
                  <h4 className="text-sm font-bold text-black">
                    {position.name}
                  </h4>
                </div>

                {/* 근무자 목록 */}
                <div className="space-y-1 flex-1">
                  {position.workers.map((worker) => (
                    <div
                      key={worker.rank}
                      className="bg-white border border-gray-200 rounded-md px-2 py-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "#F5F7FF" }}
                          >
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
        </div>
      </div>
    </div>
  );
};

export default WorkerRankingSection;
