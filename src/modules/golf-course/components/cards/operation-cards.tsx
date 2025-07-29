"use client";

import React from "react";

export interface OperationCard {
  title: string;
  value: string;
  route: string;
  searchParam: string;
}

interface OperationCardsProps {
  cards: OperationCard[];
}

const OperationCards: React.FC<OperationCardsProps> = ({ cards }) => {
  const handleCardClick = (route: string, searchParam: string) => {
    // URL 생성 및 네비게이션
    const url = `${route}?search=${encodeURIComponent(searchParam)}`;
    window.location.href = url;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">운영현황</h2>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(card.route, card.searchParam)}
            className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationCards;
