import { EmptyGroupsState, GroupSection } from "@/modules/group";
import { CaddieData } from "@/modules/work/types";
import { Group } from "@/modules/user/types/user";

interface GroupManagementAreaProps {
  groups: Group[];
  onDragStart: (caddie: CaddieData, groupId: string) => void;
  onDragEnd: () => void;
  onDrop: (targetGroupId: string, insertIndex?: number) => void;
  draggedCaddie: CaddieData | null;
  onCreateGroup: () => void;
  transformGroupToGroupSection: (group: Group) => {
    id: string;
    name: string;
    memberCount: number;
    caddies: CaddieData[];
  };
}

export const GroupManagementArea: React.FC<GroupManagementAreaProps> = ({
  groups,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedCaddie,
  onCreateGroup,
  transformGroupToGroupSection,
}) => {
  if (groups.length === 0) {
    return <EmptyGroupsState onCreateGroup={onCreateGroup} />;
  }

  return (
    <>
      {/* 필터 및 액션바 */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              총 {groups.reduce((sum, group) => sum + group.member_count, 0)}명
            </span>
          </div>
        </div>
      </div>

      {/* 그룹들 - 최대 3개 고정 너비 + 스크롤 */}
      <div className="overflow-x-auto">
        <div
          className="flex gap-4"
          style={{ width: "max-content", minWidth: "100%" }}
        >
          {groups
            .sort((a, b) => a.order - b.order)
            .map((group) => (
              <div key={group.id} className="w-80 flex-shrink-0">
                <GroupSection
                  group={transformGroupToGroupSection(group)}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onDrop={onDrop}
                  draggedCaddie={draggedCaddie}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
