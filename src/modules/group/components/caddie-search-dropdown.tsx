"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, UserPlus } from "lucide-react";
import { UnassignedCaddie } from "@/modules/user/types/user";

interface CaddieSearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  unassignedCaddies: UnassignedCaddie[];
  onAddCaddie: (caddieId: string) => void;
  isLoading?: boolean;
}

export const CaddieSearchDropdown: React.FC<CaddieSearchDropdownProps> = ({
  isOpen,
  onClose,
  unassignedCaddies,
  onAddCaddie,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 드롭다운이 열릴 때 검색창에 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // ESC 키로 드롭다운 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 검색어로 미배정 캐디 필터링
  const filteredCaddies = unassignedCaddies.filter((caddie) =>
    caddie.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 캐디 추가 핸들러
  const handleAddCaddie = async (caddieId: string) => {
    setIsAdding(caddieId);
    try {
      await onAddCaddie(caddieId);
      // 성공 시 검색어 초기화
      setSearchTerm("");
    } catch (error) {
      console.error("캐디 추가 실패:", error);
    } finally {
      setIsAdding(null);
    }
  };

  // 검색어 초기화
  const handleClearSearch = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1"
    >
      {/* 검색 헤더 */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="캐디 이름으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 text-sm border-none outline-none placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="max-h-64 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            캐디 정보를 불러오는 중...
          </div>
        ) : filteredCaddies.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {searchTerm ? "검색 결과가 없습니다" : "미배정 캐디가 없습니다"}
          </div>
        ) : (
          <div className="py-1">
            {filteredCaddies.map((caddie) => (
              <button
                key={caddie.id}
                onClick={() => handleAddCaddie(caddie.id)}
                disabled={isAdding === caddie.id}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-yellow-800">
                      {caddie.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {caddie.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {isAdding === caddie.id ? (
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 푸터 */}
      {filteredCaddies.length > 0 && (
        <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
          {searchTerm
            ? `검색 결과: ${filteredCaddies.length}명`
            : `미배정 캐디: ${filteredCaddies.length}명`}
        </div>
      )}
    </div>
  );
};
