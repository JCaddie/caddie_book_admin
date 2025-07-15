"use client";

import React, { useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";

export interface CaddieAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedCaddies: string[]) => void;
  isLoading?: boolean;
}

interface CaddieData {
  id: string;
  name: string;
  gender: "남성" | "여성";
  workStatus: "근무" | "당번" | "휴무";
  phone: string;
  workScore: number;
}

const CaddieAssignmentModal: React.FC<CaddieAssignmentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [selectedGroup, setSelectedGroup] = useState("전체");
  const [selectedSpecialTeam, setSelectedSpecialTeam] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCaddies, setSelectedCaddies] = useState<string[]>([]);

  // 임시 데이터 - 실제로는 props나 API로 받아올 데이터
  const caddies: CaddieData[] = [
    {
      id: "1",
      name: "김철수",
      gender: "남성",
      workStatus: "근무",
      phone: "010-1234-5678",
      workScore: 95,
    },
    {
      id: "2",
      name: "이영희",
      gender: "여성",
      workStatus: "당번",
      phone: "010-9876-5432",
      workScore: 88,
    },
    // 더 많은 데이터...
  ];

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm(selectedCaddies);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleCaddieToggle = (caddieId: string) => {
    setSelectedCaddies((prev) =>
      prev.includes(caddieId)
        ? prev.filter((id) => id !== caddieId)
        : [...prev, caddieId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCaddies.length === caddies.length) {
      setSelectedCaddies([]);
    } else {
      setSelectedCaddies(caddies.map((caddie) => caddie.id));
    }
  };

  const filteredCaddies = caddies.filter((caddie) => {
    if (
      searchTerm &&
      !caddie.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div
      className="fixed inset-0 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-md shadow-lg"
        style={{
          width: "880px",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">캐디 배정</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* 필터 섹션 */}
          <div className="flex gap-4">
            {/* 그룹 드롭다운 */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold text-black">그룹</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-28 h-10 px-3 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="전체">전체</option>
                <option value="1조">1조</option>
                <option value="2조">2조</option>
                <option value="3조">3조</option>
                <option value="4조">4조</option>
                <option value="5조">5조</option>
              </select>
            </div>

            {/* 특수반 드롭다운 */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold text-black">특수반</label>
              <select
                value={selectedSpecialTeam}
                onChange={(e) => setSelectedSpecialTeam(e.target.value)}
                className="w-28 h-10 px-3 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="전체">전체</option>
                <option value="새싹캐디">새싹캐디</option>
                <option value="1-2부반">1-2부반</option>
                <option value="2-3부반">2-3부반</option>
                <option value="2부반">2부반</option>
              </select>
            </div>
          </div>

          {/* 캐디 배정 섹션 */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-black">캐디 배정</h3>

            {/* 검색창 */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <SearchIcon size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="캐디 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* 테이블 */}
            <div className="border border-gray-300 rounded-md overflow-hidden">
              {/* 테이블 헤더 */}
              <div className="bg-gray-100 border-b border-gray-300">
                <div className="flex items-center px-4 py-3 gap-8">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCaddies.length === caddies.length}
                      onChange={handleSelectAll}
                      className="w-6 h-6 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                  </div>
                  <div className="w-32 text-center">
                    <span className="text-sm font-bold text-gray-600">
                      이름
                    </span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-sm font-bold text-gray-600">
                      성별
                    </span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-sm font-bold text-gray-600">
                      근무
                    </span>
                  </div>
                  <div className="w-60 text-center">
                    <span className="text-sm font-bold text-gray-600">
                      연락처
                    </span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-sm font-bold text-gray-600">
                      근무점수
                    </span>
                  </div>
                </div>
              </div>

              {/* 테이블 본문 */}
              <div className="max-h-56 overflow-y-auto">
                {filteredCaddies.length === 0 ? (
                  <div className="flex items-center justify-center py-16">
                    <p className="text-sm text-black opacity-40">
                      캐디를 검색해주세요.
                    </p>
                  </div>
                ) : (
                  filteredCaddies.map((caddie) => (
                    <div
                      key={caddie.id}
                      className="flex items-center px-4 py-3 gap-8 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCaddies.includes(caddie.id)}
                          onChange={() => handleCaddieToggle(caddie.id)}
                          className="w-6 h-6 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        />
                      </div>
                      <div className="w-32 text-center">
                        <span className="text-sm font-bold text-black">
                          {caddie.name}
                        </span>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-sm font-bold text-black">
                          {caddie.gender}
                        </span>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-sm font-bold text-black">
                          {caddie.workStatus}
                        </span>
                      </div>
                      <div className="w-60 text-center">
                        <span className="text-sm font-bold text-black">
                          {caddie.phone}
                        </span>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-sm font-bold text-black">
                          {caddie.workScore}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-6 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="w-32 h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-800 font-medium text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-32 h-10 px-4 py-2 rounded-md bg-primary text-white font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{
              backgroundColor: "#FEB912",
              boxShadow: "0px 2px 8px 2px rgba(254, 185, 18, 0.42)",
            }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              "완료"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaddieAssignmentModal;
