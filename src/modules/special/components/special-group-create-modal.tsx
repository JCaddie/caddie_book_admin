"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button, Input } from "@/shared/components/ui";
import { createSpecialGroup } from "@/modules/work/api/work-api";

interface SpecialGroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  golfCourseId: string;
  golfCourseName?: string;
}

const SpecialGroupCreateModal: React.FC<SpecialGroupCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  golfCourseId,
  golfCourseName,
}) => {
  const [groupName, setGroupName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  // 모달이 열릴 때마다 초기화
  React.useEffect(() => {
    if (isOpen) {
      setGroupName("");
      setError("");
      setIsCreating(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("특수반 이름을 입력해주세요.");
      return;
    }

    try {
      setIsCreating(true);
      setError("");

      await createSpecialGroup(golfCourseId, {
        name: groupName.trim(),
        group_type: "SPECIAL",
      });

      // 성공 시 콜백 호출
      onSuccess();
      onClose();
    } catch (error) {
      console.error("특수반 생성 실패:", error);
      setError("특수반 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-xl shadow-xl flex flex-col"
        style={{ width: "400px" }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">특수반 생성</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 골프장 정보 */}
          {golfCourseName && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                골프장
              </label>
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                {golfCourseName}
              </div>
            </div>
          )}

          {/* 특수반 이름 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="groupName"
              className="text-sm font-medium text-gray-700"
            >
              특수반 이름 *
            </label>
            <Input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="예: 특수반A, 특수반B"
              className="w-full"
              disabled={isCreating}
            />
          </div>

          {/* 에러 메시지 */}
          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* 버튼 */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isCreating}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !groupName.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {isCreating ? "생성 중..." : "생성"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecialGroupCreateModal;
