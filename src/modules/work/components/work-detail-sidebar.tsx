"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui";
import { Work } from "@/modules/work/types";

interface WorkDetailSidebarProps {
  work: Work;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function WorkDetailSidebar({
  work,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: WorkDetailSidebarProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="sticky top-6 space-y-6">
      {/* 액션 버튼들 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">액션</h3>
        <div className="space-y-3">
          {!isEditing ? (
            <>
              <Button
                onClick={onEdit}
                variant="primary"
                className="w-full bg-[#FEB912] hover:bg-[#E6A610] text-black"
              >
                수정하기
              </Button>
              <Button
                onClick={onDelete}
                variant="outline"
                className="w-full text-red-600 border-red-600 hover:bg-red-50"
              >
                삭제하기
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSave}
                variant="primary"
                disabled={isSaving}
                className="w-full bg-[#FEB912] hover:bg-[#E6A610] text-black"
              >
                {isSaving ? "저장 중..." : "저장하기"}
              </Button>
              <Button onClick={onCancel} variant="secondary" className="w-full">
                취소
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 상태 요약 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">상태 요약</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">근무 상태</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                work.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : work.status === "confirmed"
                  ? "bg-blue-100 text-blue-800"
                  : work.status === "planning"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {work.status === "completed"
                ? "완료"
                : work.status === "confirmed"
                ? "확정"
                : work.status === "planning"
                ? "계획중"
                : "취소"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">전체 인원</span>
            <span className="text-sm font-medium">{work.totalStaff}명</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">가용 인원</span>
            <span className="text-sm font-medium text-green-600">
              {work.availableStaff}명
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">부족 인원</span>
            <span
              className={`text-sm font-medium ${
                work.totalStaff - work.availableStaff > 0
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {work.totalStaff - work.availableStaff}명
            </span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">충원율</span>
            <span
              className={`text-sm font-medium ${
                (work.availableStaff / work.totalStaff) * 100 >= 100
                  ? "text-green-600"
                  : (work.availableStaff / work.totalStaff) * 100 >= 80
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {Math.round((work.availableStaff / work.totalStaff) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* 히스토리 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">변경 이력</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">생성일</span>
            <span>{work.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">최종 수정</span>
            <span>2024-01-15 14:30</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">수정자</span>
            <span>관리자</span>
          </div>
        </div>
      </div>

      {/* 빠른 링크 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm p-2 h-auto"
          >
            캐디 배정 관리
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm p-2 h-auto"
          >
            골프장 정보
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm p-2 h-auto"
          >
            근무 이력
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm p-2 h-auto"
          >
            보고서 생성
          </Button>
        </div>
      </div>
    </div>
  );
}
