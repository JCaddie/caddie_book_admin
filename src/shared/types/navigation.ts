import { LucideIcon } from "lucide-react";
import { UserRole } from "./user";

// 네비게이션 서브메뉴 인터페이스
export interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

// 네비게이션 메뉴 아이템 인터페이스
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  isActive?: boolean;
  subItems?: SubMenuItem[];
  isExpanded?: boolean;
}

// 권한별 네비게이션 메뉴 타입
export type NavigationConfig = {
  [key in UserRole]: NavigationItem[];
};

// 네비게이션 상태 타입
export interface NavigationState {
  activeItemId: string | null;
  expandedItemIds: Set<string>;
}
