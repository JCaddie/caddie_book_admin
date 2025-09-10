"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import type {
  NavigationItem as NavigationItemType,
  SubMenuItem,
} from "@/shared/types";

interface NavigationItemProps {
  item: NavigationItemType;
  onToggleExpand?: (itemId: string) => void;
  isExpanded?: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  onToggleExpand,
  isExpanded = false,
}) => {
  const pathname = usePathname();

  // 서브메뉴가 있는지 확인
  const hasSubItems = item.subItems && item.subItems.length > 0;

  // 현재 경로와 일치하는지 확인 (하위 경로 포함)
  const isActive =
    pathname === item.href ||
    pathname.startsWith(item.href + "/") ||
    item.subItems?.some((subItem: SubMenuItem) => pathname === subItem.href);

  const handleToggleExpand = () => {
    if (hasSubItems && onToggleExpand) {
      onToggleExpand(item.id);
    }
  };

  return (
    <div className="w-full">
      {/* 메인 메뉴 아이템 */}
      <div
        className={`
          flex items-center gap-6 px-6 py-4 cursor-pointer transition-colors
          ${
            isActive
              ? "bg-primary-50 border-r-2 border-primary-400"
              : "hover:bg-gray-50"
          }
        `}
        onClick={(e) => {
          if (hasSubItems) {
            e.preventDefault();
            e.stopPropagation();
            handleToggleExpand();
          }
        }}
      >
        {/* 아이콘 */}
        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
          {item.icon && <item.icon size={20} className="text-gray-600" />}
        </div>

        {/* 메뉴 링크 또는 텍스트 */}
        {hasSubItems ? (
          <div className="flex-1 flex items-center justify-between">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleExpand();
              }}
              className="flex-1 text-left"
            >
              <span
                className={`
                  text-lg font-medium
                  ${isActive ? "text-primary-600 font-bold" : "text-gray-900"}
                `}
              >
                {item.label}
              </span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleExpand();
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown size={20} className="text-gray-500" />
              ) : (
                <ChevronRight size={20} className="text-gray-500" />
              )}
            </button>
          </div>
        ) : (
          <Link href={item.href} className="flex-1">
            <span
              className={`
                text-lg font-medium
                ${isActive ? "text-primary-600 font-bold" : "text-gray-900"}
              `}
            >
              {item.label}
            </span>
          </Link>
        )}
      </div>

      {/* 서브메뉴 */}
      {hasSubItems && isExpanded && (
        <div className="bg-gray-100">
          {item.subItems?.map((subItem: SubMenuItem) => (
            <SubMenuItemComponent key={subItem.id} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
};

// 서브메뉴 아이템 컴포넌트
interface SubMenuItemComponentProps {
  item: SubMenuItem;
}

const SubMenuItemComponent: React.FC<SubMenuItemComponentProps> = ({
  item,
}) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link href={item.href}>
      <div
        className={`
          flex items-center gap-6 px-6 py-3 pl-16 transition-colors
          ${
            isActive
              ? "bg-primary-100 border-r-2 border-primary-400"
              : "hover:bg-gray-200"
          }
        `}
      >
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
        <span
          className={`
            text-base font-medium
            ${isActive ? "text-primary-600 font-bold" : "text-gray-800"}
          `}
        >
          {item.label}
        </span>
      </div>
    </Link>
  );
};

export default NavigationItem;
