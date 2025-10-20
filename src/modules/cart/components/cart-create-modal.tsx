"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button, Dropdown, Input } from "@/shared/components/ui";
import { useAuth } from "@/shared/hooks";
import { useGolfCoursesSimple } from "@/modules/golf-course/hooks/use-golf-courses-simple";

export interface CartCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; golf_course_id: string }) => void;
  isLoading?: boolean;
}

const CartCreateModal: React.FC<CartCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [cartName, setCartName] = useState("");
  const [selectedGolfCourseId, setSelectedGolfCourseId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const isMaster = user?.role === "MASTER";

  // 골프장 간소 목록 데이터 가져오기 (MASTER 권한일 때만)
  const {
    data: golfCoursesData,
    isLoading: isLoadingGolfCourses,
    error: golfCourseError,
  } = useGolfCoursesSimple();

  // 드롭다운 옵션 생성
  const dropdownOptions = React.useMemo(() => {
    if (!golfCoursesData?.data) {
      return [];
    }

    return golfCoursesData.data.map((golfCourse) => ({
      value: golfCourse.id,
      label: golfCourse.name,
    }));
  }, [golfCoursesData]);

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setCartName("");
      setError(null);

      if (isMaster) {
        setSelectedGolfCourseId("");
      } else {
        // ADMIN일 때는 자동으로 자신의 골프장 설정
        setSelectedGolfCourseId(user?.golfCourseId || "");
      }
    }
  }, [isOpen, isMaster, user?.golfCourseId]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = () => {
    setError(null);

    // 유효성 검사
    if (!cartName.trim()) {
      setError("카트 이름을 입력해주세요.");
      return;
    }

    if (isMaster && !selectedGolfCourseId) {
      setError("골프장을 선택해주세요.");
      return;
    }

    if (!isMaster && !user?.golfCourseId) {
      setError("골프장 정보가 없습니다. 관리자에게 문의해주세요.");
      return;
    }

    // 카트 생성 데이터
    const golfCourseId = isMaster ? selectedGolfCourseId : user?.golfCourseId;
    if (!golfCourseId) {
      setError("골프장 정보가 없습니다.");
      return;
    }

    const createData = {
      name: cartName.trim(),
      golf_course_id: golfCourseId,
    };

    onSubmit(createData);
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // 현재 사용자의 골프장명 찾기 (ADMIN용)
  const getCurrentGolfCourseName = () => {
    if (!user?.golfCourseId) return "미설정";

    // MASTER 권한이고 골프장 데이터가 있으면 API 데이터에서 찾기
    if (isMaster && golfCoursesData?.data) {
      const course = golfCoursesData.data.find(
        (golfCourse) => golfCourse.id === user.golfCourseId
      );
      return course ? course.name : "알 수 없음";
    }

    // ADMIN 권한이거나 데이터가 없으면 기본값
    return user.golf_course_name || "알 수 없음";
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">새 카트 생성</h2>
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
          {/* 카트 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카트 이름 <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={cartName}
              onChange={(e) => setCartName(e.target.value)}
              placeholder="카트 이름을 입력하세요"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* 골프장 선택 (MASTER만) */}
          {isMaster && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                골프장 <span className="text-red-500">*</span>
              </label>
              {isLoadingGolfCourses ? (
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md"></div>
              ) : golfCourseError ? (
                <div className="w-full h-10 bg-red-100 border border-red-300 rounded-md flex items-center justify-center">
                  <span className="text-red-600 text-sm">
                    골프장 목록 조회 실패
                  </span>
                </div>
              ) : (
                <Dropdown
                  options={dropdownOptions}
                  value={selectedGolfCourseId}
                  onChange={setSelectedGolfCourseId}
                  placeholder="골프장을 선택하세요"
                  disabled={isLoading}
                  className="w-full"
                />
              )}
            </div>
          )}

          {/* ADMIN일 때 골프장 정보 표시 */}
          {!isMaster && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                골프장
              </label>
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                {getCurrentGolfCourseName()}
              </div>
            </div>
          )}

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
            className="flex-1"
          >
            {isLoading ? "생성 중..." : "생성하기"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartCreateModal;
