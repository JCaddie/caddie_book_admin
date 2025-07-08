"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { OperationCard } from "@/shared/types/golf-course";

interface OperationCardsProps {
  cards: OperationCard[];
}

const OperationCards: React.FC<OperationCardsProps> = ({ cards }) => {
  const router = useRouter();

  // 운영현황 카드 클릭 핸들러
  const handleCardClick = (route: string, searchParam: string) => {
    // 해당 페이지로 이동하면서 골프장 이름으로 검색
    router.push(`${route}?search=${encodeURIComponent(searchParam)}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">운영현황</h2>

      <div className="grid grid-cols-5 gap-12">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(card.route, card.searchParam)}
            className="bg-white border border-gray-200 rounded-md p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            {/* 카드 헤더 */}
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-base font-bold text-gray-900">
                {card.title}
              </span>
              <ChevronRight size={16} className="text-gray-800" />
            </div>

            {/* 카드 값 */}
            <div className="text-center">
              <span className="text-2xl font-bold text-gray-600">
                {card.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationCards;
