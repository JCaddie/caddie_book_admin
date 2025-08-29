import { useCallback, useState } from "react";
import { CaddieData } from "@/modules/work/types";

interface UseDragAndDropReturn {
  draggedCaddie: CaddieData | null;
  handleDragStart: (caddie: CaddieData) => void;
  handleDragEnd: () => void;
  isDragging: (caddie: CaddieData) => boolean;
}

export const useDragAndDrop = (): UseDragAndDropReturn => {
  const [draggedCaddie, setDraggedCaddie] = useState<CaddieData | null>(null);

  const handleDragStart = useCallback((caddie: CaddieData) => {
    setDraggedCaddie(caddie);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedCaddie(null);
  }, []);

  const isDragging = useCallback(
    (caddie: CaddieData) => {
      return draggedCaddie?.id === caddie.id;
    },
    [draggedCaddie]
  );

  return {
    draggedCaddie,
    handleDragStart,
    handleDragEnd,
    isDragging,
  };
};
