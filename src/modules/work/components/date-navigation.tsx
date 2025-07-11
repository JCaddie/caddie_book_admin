"use client";

import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { formatDate } from "../utils/work-detail-utils";

interface DateNavigationProps {
  currentDate: Date;
  onDateChange: (days: number) => void;
}

export default function DateNavigation({
  currentDate,
  onDateChange,
}: DateNavigationProps) {
  return (
    <div className="bg-white">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between pl-4 py-4">
          {/* 왼쪽: 날짜 네비게이션 */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onDateChange(-1)}
              className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#FEB912]" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-black opacity-80" />
              <span className="text-[22px] font-medium text-black opacity-80">
                {formatDate(currentDate)}
              </span>
            </div>
            <button
              onClick={() => onDateChange(1)}
              className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#FEB912]" />
            </button>
          </div>

          {/* 오른쪽: 검색창 */}
          <div className="relative w-[400px]">
            <div className="flex items-center gap-2 px-3 py-2 bg-white">
              <Search className="w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="캐디 검색"
                className="flex-1 text-sm font-medium text-gray-400 bg-transparent outline-none placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
