"use client";

import React, { useEffect, useRef, useState } from "react";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

interface GroupMenuProps {
  groupId: string;
  groupName: string;
  onEditGroup: (groupId: string, newName: string) => void;
  onDeleteGroup: (groupId: string) => void;
}

export const GroupMenu: React.FC<GroupMenuProps> = ({
  groupId,
  groupName,
  onEditGroup,
  onDeleteGroup,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(groupName);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 수정 모드일 때 입력 필드에 포커스
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsOpen(false);
  };

  const handleEditSave = () => {
    if (editName.trim() && editName !== groupName) {
      onEditGroup(groupId, editName.trim());
    }
    setIsEditing(false);
    setEditName(groupName);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditName(groupName);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`"${groupName}" 그룹을 삭제하시겠습니까?`)) {
      onDeleteGroup(groupId);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-yellow-500 rounded transition-colors"
        >
          <MoreVertical className="w-6 h-6 text-white" />
        </button>

        {/* 편집 모드 오버레이 */}
        <div className="fixed inset-0 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-black">
              그룹명 수정
            </h3>
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500 text-black placeholder-gray-500"
              maxLength={20}
              placeholder="그룹명을 입력하세요"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
              >
                저장
              </button>
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-yellow-500 rounded transition-colors"
      >
        <MoreVertical className="w-6 h-6 text-white" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <button
            onClick={handleEditClick}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-gray-100 transition-colors"
          >
            <Edit className="w-4 h-4 text-black" />
            그룹명 수정
          </button>
          <div className="border-t border-gray-200" />
          <button
            onClick={handleDeleteClick}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
            그룹 삭제
          </button>
        </div>
      )}
    </div>
  );
};
