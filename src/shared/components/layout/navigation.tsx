"use client";

import { useState } from "react";
import { UserRole } from "@/shared/types";
import { NAVIGATION_CONFIG } from "@/shared/constants/navigation";
import NavigationItem from "./navigation-item";

interface NavigationProps {
  userRole: UserRole;
}

const Navigation: React.FC<NavigationProps> = ({ userRole }) => {
  // 확장된 메뉴 아이템들을 관리하는 상태
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // 메뉴 아이템 확장/축소 토글
  const handleToggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // 현재 사용자 권한에 맞는 네비게이션 메뉴 가져오기
  const navigationItems = NAVIGATION_CONFIG[userRole];

  return (
    <nav className="w-full">
      {/* 로고 영역 */}
      <div
        className="bg-primary px-4 py-3 flex items-center justify-center"
        style={{ height: "72px" }}
      >
        <span className="text-white font-bold text-3xl">Caddie Book</span>
      </div>

      {/* 네비게이션 메뉴 리스트 */}
      <div className="bg-white">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            onToggleExpand={handleToggleExpand}
            isExpanded={expandedItems.has(item.id)}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
