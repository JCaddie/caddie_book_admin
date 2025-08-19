import {
  Building2,
  Car,
  Clock,
  LayoutDashboard,
  MapPin,
  Megaphone,
  Settings,
  Users,
} from "lucide-react";
import { NavigationConfig } from "@/shared/types";

// 권한별 네비게이션 메뉴 설정
export const NAVIGATION_CONFIG: NavigationConfig = {
  MASTER: [
    {
      id: "dashboard",
      label: "대시보드",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "golf-courses",
      label: "골프장",
      href: "/golf-courses",
      icon: Building2,
    },
    {
      id: "caddies",
      label: "캐디",
      href: "/caddies",
      icon: Users,
      subItems: [
        {
          id: "caddie-list",
          label: "캐디 리스트",
          href: "/caddies",
        },
        {
          id: "new-caddie",
          label: "신규 캐디",
          href: "/caddies/new",
        },
        {
          id: "group-status",
          label: "그룹현황",
          href: "/caddies/groups",
        },
      ],
    },
    {
      id: "works",
      label: "근무",
      href: "/works",
      icon: Clock,
      subItems: [
        {
          id: "work-schedule",
          label: "근무 일정",
          href: "/works",
        },
        {
          id: "special-team",
          label: "특수반 관리",
          href: "/works/special",
        },
        {
          id: "day-off",
          label: "휴무관리",
          href: "/works/day-off",
        },
      ],
    },
    {
      id: "fields",
      label: "필드",
      href: "/fields",
      icon: MapPin,
    },
    {
      id: "carts",
      label: "카트",
      href: "/carts",
      icon: Car,
    },
    {
      id: "announcements",
      label: "공지사항",
      href: "/announcements",
      icon: Megaphone,
    },
    {
      id: "users",
      label: "관리자",
      href: "/users",
      icon: Settings,
    },
  ],
  ADMIN: [
    {
      id: "dashboard",
      label: "대시보드",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "caddies",
      label: "캐디",
      href: "/caddies",
      icon: Users,
      subItems: [
        {
          id: "caddie-list",
          label: "캐디 리스트",
          href: "/caddies",
        },
        {
          id: "new-caddie",
          label: "신규 캐디",
          href: "/caddies/new",
        },
        {
          id: "group-status",
          label: "그룹현황",
          href: "/caddies/groups/me",
        },
      ],
    },
    {
      id: "works",
      label: "근무",
      href: "/works",
      icon: Clock,
      subItems: [
        {
          id: "work-schedule",
          label: "근무 일정",
          href: "/works",
        },
        {
          id: "special-team",
          label: "특수반 관리",
          href: "/works/special",
        },
        {
          id: "day-off",
          label: "휴무관리",
          href: "/works/day-off",
        },
      ],
    },
    {
      id: "fields",
      label: "필드",
      href: "/fields",
      icon: MapPin,
    },
    {
      id: "carts",
      label: "카트",
      href: "/carts",
      icon: Car,
    },
    {
      id: "announcements",
      label: "공지사항",
      href: "/announcements",
      icon: Megaphone,
    },
    {
      id: "users",
      label: "관리자",
      href: "/users",
      icon: Settings,
    },
  ],
  DEV: [
    {
      id: "dashboard",
      label: "대시보드",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "caddies",
      label: "캐디",
      href: "/caddies",
      icon: Users,
      subItems: [
        {
          id: "caddie-list",
          label: "캐디 리스트",
          href: "/caddies",
        },
        {
          id: "new-caddie",
          label: "신규 캐디",
          href: "/caddies/new",
        },
        {
          id: "group-status",
          label: "그룹현황",
          href: "/caddies/groups/me",
        },
      ],
    },
    {
      id: "works",
      label: "근무",
      href: "/works",
      icon: Clock,
      subItems: [
        {
          id: "work-schedule",
          label: "근무 일정",
          href: "/works",
        },
        {
          id: "special-team",
          label: "특수반 관리",
          href: "/works/special",
        },
        {
          id: "day-off",
          label: "휴무관리",
          href: "/works/day-off",
        },
      ],
    },
    {
      id: "fields",
      label: "필드",
      href: "/fields",
      icon: MapPin,
    },
    {
      id: "carts",
      label: "카트",
      href: "/carts",
      icon: Car,
    },
    {
      id: "announcements",
      label: "공지사항",
      href: "/announcements",
      icon: Megaphone,
    },
    {
      id: "users",
      label: "관리자",
      href: "/users",
      icon: Settings,
    },
  ],
};
