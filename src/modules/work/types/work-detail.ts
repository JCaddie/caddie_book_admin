export interface WorkDetailPageProps {
  params: Promise<{
    id: string; // 골프장 ID
  }>;
  searchParams: Promise<{
    date?: string;
  }>;
}

export interface CaddieCardProps {
  caddie?: {
    id: number;
    name: string;
    group: number;
    badge: string;
    status: string;
    specialBadge?: string;
  };
  isEmpty?: boolean;
  emptyText?: string;
  onDragStart?: (caddie: CaddieData) => void;
  onDragEnd?: (caddie: CaddieData) => void;
  isDragging?: boolean;
}

export interface CaddieData {
  id: number;
  name: string;
  group: number;
  badge: string;
  status: string;
  specialBadge?: string;
}

export interface Field {
  id: number;
  name: string;
}

export interface PersonnelFilter {
  status: string;
  group: string;
  badge: string;
}

export interface TimeSlots {
  part1: string[];
  part2: string[];
  part3: string[];
}

export interface PersonnelStats {
  total: number;
  available: number;
}
