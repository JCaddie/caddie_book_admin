"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button, Input } from "@/shared/components/ui";
import { useAuth } from "@/shared/hooks";
import { createGroup } from "../api/group-api";
import { CreateGroupRequest } from "../types";
import { fetchGolfCourseGroupDetail } from "@/modules/golf-course/api/golf-course-api";

export interface GroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  golfCourseId?: string; // UUID 문자열로 변경
  golfCourseInfo?: {
    name: string;
    contractStatus?: string;
  };
}

const GroupCreateModal: React.FC<GroupCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  golfCourseId,
  golfCourseInfo,
}) => {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [golfCourseName, setGolfCourseName] = useState<string>("");

  const { user } = useAuth();
  const isMaster = user?.role === "MASTER" || user?.role === "DEV";

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setGroupName("");
      setError(null);

      // 골프장 이름 가져오기
      const fetchGolfCourseName = async () => {
        try {
          // 이미 골프장 정보가 제공된 경우 바로 사용
          if (golfCourseInfo) {
            setGolfCourseName(golfCourseInfo.name);
            return;
          }

          if (isMaster && golfCourseId) {
            const response = await fetchGolfCourseGroupDetail(golfCourseId);
            setGolfCourseName(response.data.name);
          } else if (user?.golfCourseId) {
            const response = await fetchGolfCourseGroupDetail(
              user.golfCourseId
            );
            setGolfCourseName(response.data.name);
          }
        } catch (error) {
          console.error("골프장 정보 가져오기 실패:", error);
          setGolfCourseName("골프장 정보 없음");
        }
      };

      fetchGolfCourseName();
    }
  }, [isOpen, isMaster, golfCourseId, user?.golfCourseId, golfCourseInfo]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    setError(null);

    // 유효성 검사
    if (!groupName.trim()) {
      setError("그룹 이름을 입력해주세요.");
      return;
    }

    if (groupName.trim().length < 2) {
      setError("그룹 이름은 최소 2자 이상이어야 합니다.");
      return;
    }

    if (groupName.trim().length > 20) {
      setError("그룹 이름은 최대 20자까지 가능합니다.");
      return;
    }

    // golf_course ID 결정
    let targetGolfCourseId: string;

    if (isMaster) {
      // MASTER: URL의 ID 사용
      if (!golfCourseId) {
        setError("골프장 ID가 필요합니다.");
        return;
      }
      targetGolfCourseId = golfCourseId;
    } else {
      // ADMIN: 자신이 속한 골프장 ID 사용
      if (!user?.golfCourseId) {
        setError("골프장 정보가 없습니다. 관리자에게 문의해주세요.");
        return;
      }
      targetGolfCourseId = user.golfCourseId;
    }

    setIsLoading(true);

    try {
      const createData: CreateGroupRequest = {
        name: groupName.trim(),
        group_type: "PRIMARY",
        golf_course: targetGolfCourseId, // UUID 문자열
        is_active: true,
      };

      await createGroup(createData);

      // 성공 시 모달 닫기 및 콜백 호출
      onSuccess();
      onClose();
    } catch (error) {
      console.error("그룹 생성 중 오류 발생:", error);
      setError("그룹 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">새 그룹 생성</h2>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* 폼 */}
        <div className="space-y-4">
          {/* 그룹 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              그룹 이름 <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="예: 1조, A조, 특수반"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* 골프장 정보 표시 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              골프장 정보
            </label>
            <div className="p-3 bg-gray-50 rounded-lg space-y-1">
              <div className="text-sm font-medium text-gray-900">
                {golfCourseName || "골프장 정보를 불러오는 중..."}
              </div>
              {golfCourseInfo?.contractStatus && (
                <div className="text-xs text-gray-500">
                  계약 상태:{" "}
                  <span className="font-medium">
                    {golfCourseInfo.contractStatus}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white"
          >
            {isLoading ? "생성 중..." : "생성하기"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupCreateModal;
