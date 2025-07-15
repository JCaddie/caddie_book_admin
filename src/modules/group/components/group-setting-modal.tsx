"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button, Input } from "@/shared/components/ui";
import { GroupData, GroupSettingModalProps } from "../types";

const GroupSettingModal: React.FC<GroupSettingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGroups = [],
  isLoading = false,
}) => {
  const [groups, setGroups] = useState<GroupData[]>(initialGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // 모달이 열릴 때마다 초기 그룹으로 리셋
  useEffect(() => {
    if (isOpen) {
      setGroups(initialGroups);
      setSelectedGroupId(null);
    }
  }, [isOpen, initialGroups]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGroupNameChange = (groupId: string, newName: string) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, name: newName } : group
      )
    );
  };

  const handleAddGroup = () => {
    const newOrder = Math.max(...groups.map((g) => g.order), 0) + 1;
    const newGroup: GroupData = {
      id: `group-${Date.now()}`,
      name: `${newOrder}조`,
      order: newOrder,
    };
    setGroups((prev) => [...prev, newGroup]);
    setSelectedGroupId(newGroup.id);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((group) => group.id !== groupId));
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
    }
  };

  const hasGroups = groups.length > 0;

  // 모달 높이 계산 - 안전한 최대 높이 제한
  const getModalHeight = () => {
    if (!hasGroups) return "508px"; // 빈 상태일 때 고정 높이

    const headerHeight = 72; // 헤더 높이
    const footerHeight = 138; // 하단 버튼 영역 높이
    const minContentHeight = 96; // 최소 컨텐츠 높이
    const itemHeight = 48; // 각 그룹 아이템 높이
    const safeMaxHeight = 600; // 안전한 최대 높이

    // 그룹 수에 따른 이상적인 높이 계산
    const idealContentHeight = Math.max(
      minContentHeight,
      groups.length * itemHeight + 8
    );
    const idealTotalHeight = headerHeight + idealContentHeight + footerHeight;

    // 안전한 최대 높이를 넘지 않도록 제한
    return `${Math.min(idealTotalHeight, safeMaxHeight)}px`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl shadow-xl flex flex-col"
        style={{
          width: "400px",
          height: getModalHeight(),
        }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-black">그룹 설정</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 컨텐츠 */}
        {hasGroups ? (
          <div className="px-0 pt-2 flex-1 flex flex-col">
            <div
              className="w-full overflow-y-auto flex-1"
              style={{
                maxHeight: "390px",
              }}
            >
              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`flex items-center px-4 py-2 gap-2.5 ${
                    selectedGroupId === group.id ? "bg-yellow-50" : ""
                  }`}
                  onClick={() => setSelectedGroupId(group.id)}
                >
                  <div className="w-3 flex justify-center">
                    <span className="text-sm font-bold text-primary">
                      {group.order}
                    </span>
                  </div>
                  <Input
                    type="text"
                    value={group.name}
                    onChange={(e) =>
                      handleGroupNameChange(group.id, e.target.value)
                    }
                    className="flex-1 h-8 text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGroup(group.id);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center px-4 flex-1"
            style={{ minHeight: "288px" }}
          >
            <div className="text-center">
              <p
                className="text-sm font-medium text-black opacity-40"
                style={{
                  fontFamily: "Pretendard",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "1.7142857142857142em",
                }}
              >
                생성된 그룹이 없습니다.
                <br />
                그룹을 생성해주세요.
              </p>
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex flex-col p-4 flex-shrink-0">
          {/* 생성 버튼 영역 */}
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleAddGroup}
              disabled={isLoading}
              variant="outline"
              className="text-yellow-600 border-yellow-400 hover:bg-yellow-50 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              그룹 생성
            </Button>
          </div>

          {/* 액션 버튼 영역 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              취소
            </Button>
            <Button
              onClick={() => onSave(groups)}
              disabled={isLoading}
              className="bg-yellow-400 hover:bg-yellow-500 text-white"
            >
              {isLoading ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSettingModal;
