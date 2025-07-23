import { CaddieCard } from "@/modules/work/components";
import { CaddieData } from "@/modules/work/types";
import { UnassignedCaddie } from "@/modules/user/types/user";

interface UnassignedCaddieListProps {
  unassignedCaddies: UnassignedCaddie[];
  isLoading: boolean;
  error: string | null;
  onDragStart: (caddie: CaddieData, groupId: string) => void;
  onDragEnd: () => void;
  onDrop: (targetGroupId: string) => void;
  draggedCaddie: CaddieData | null;
  transformUnassignedCaddieToCaddieData: (
    caddie: UnassignedCaddie,
    index?: number
  ) => CaddieData;
}

export const UnassignedCaddieList: React.FC<UnassignedCaddieListProps> = ({
  unassignedCaddies,
  isLoading,
  error,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedCaddie,
  transformUnassignedCaddieToCaddieData,
}) => {
  if (isLoading) {
    return (
      <div className="text-sm text-gray-500">캐디 정보를 불러오는 중...</div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  // 미배정 캐디가 없을 때의 드롭 영역
  if (unassignedCaddies.length === 0) {
    return (
      <div
        className="space-y-2 min-h-[200px] p-2 border-2 border-dashed border-gray-300 rounded-lg"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={() => onDrop("unassigned")}
      >
        <div className="text-xs text-gray-500 mb-2 text-center">
          캐디를 여기로 드래그하여 배정 해제
        </div>
        <div className="text-sm text-gray-500 text-center py-8">
          미배정 캐디가 없습니다.
        </div>
      </div>
    );
  }

  // 미배정 캐디 목록
  return (
    <div
      className="space-y-2 min-h-[200px] p-2 border-2 border-dashed border-gray-300 rounded-lg"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={() => onDrop("unassigned")}
    >
      <div className="text-xs text-gray-500 mb-2 text-center">
        캐디를 여기로 드래그하여 배정 해제
      </div>
      {unassignedCaddies
        .map((caddie, index) =>
          transformUnassignedCaddieToCaddieData(caddie, index)
        )
        .map((caddieData) => (
          <div
            key={caddieData.originalId}
            draggable
            onDragStart={() => onDragStart(caddieData, "")}
            onDragEnd={onDragEnd}
            className={`cursor-move ${
              draggedCaddie?.id === caddieData.id ? "opacity-50" : ""
            }`}
          >
            <CaddieCard caddie={caddieData} />
          </div>
        ))}
    </div>
  );
};
