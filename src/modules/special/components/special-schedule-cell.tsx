import React from "react";
import { SpecialGroupUI } from "../types";
import SpecialGroupCard from "./special-group-card";

interface SpecialScheduleCellProps {
  group: SpecialGroupUI | null;
  fieldIndex: number;
  timeIndex: number;
  part: number;
  draggedGroup?: SpecialGroupUI | null;
  onDragStart?: (group: SpecialGroupUI) => void;
  onDragEnd?: () => void;
}

const SpecialScheduleCell: React.FC<SpecialScheduleCellProps> = ({
  group,
  fieldIndex,
  timeIndex,
  part,
  draggedGroup,
  onDragStart,
  onDragEnd,
}) => {
  // 특수반이 배치된 슬롯
  if (group && !group.isEmpty) {
    return (
      <SpecialGroupCard
        key={`${group.id}-${fieldIndex}-${timeIndex}-${part}`}
        group={group}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        isDragging={draggedGroup?.id === group.id}
        showDeleteButton={false} // 워크슬롯에 있는 특수반은 삭제 버튼 숨김
      />
    );
  }

  // 빈 슬롯일 때 미배정 카드 표시
  return (
    <SpecialGroupCard
      key={`empty-${fieldIndex}-${timeIndex}-${part}`}
      isEmpty={true}
      emptyText="배치 가능"
    />
  );
};

export default SpecialScheduleCell;
