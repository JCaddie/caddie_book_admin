import { useState } from "react";

// 팀 드래그 관련 타입
export interface TeamDragState<T> {
  draggedItem: T | null;
  handleDragStart: (item: T) => void;
  handleDragEnd: () => void;
  isDragging: (item: T) => boolean;
}

/**
 * 팀 드래그 로직을 관리하는 커스텀 훅
 * @template T - 드래그할 아이템의 타입
 * @returns TeamDragState 객체
 */
export function useTeamDrag<T extends { id: string }>(): TeamDragState<T> {
  const [draggedItem, setDraggedItem] = useState<T | null>(null);

  const handleDragStart = (item: T) => {
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const isDragging = (item: T): boolean => {
    return draggedItem?.id === item.id;
  };

  return {
    draggedItem,
    handleDragStart,
    handleDragEnd,
    isDragging,
  };
}
