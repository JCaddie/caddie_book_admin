"use client";

import React, { useRef, useState } from "react";
import { MoreVertical, Settings, Shield, UserMinus } from "lucide-react";
import { CaddieCardProps, CaddieData } from "../types";
import {
  getCaddieCardStyle,
  getSpecialBadgeStyle,
} from "../utils/work-detail-utils";

export default function CaddieCard({
  caddie,
  isEmpty = false,
  emptyText = "미배정",
  onDragStart,
  onDragEnd,
  isDragging = false,
  draggable = true,
  onClick,
  onStatusToggle,
  onCaddieRemove,
  onSpareToggle,
  onDoubleClick,
  isSpare = false,
}: CaddieCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  if (isEmpty) {
    return (
      <div
        className={`w-[218px] h-auto flex items-center justify-center px-2 py-1.5 bg-white rounded-md border border-[#DDDDDD] ${
          onClick ? "cursor-pointer hover:bg-gray-50" : ""
        }`}
        onClick={
          onClick
            ? () => {
                if (typeof onClick === "function") {
                  if (onClick.length === 0) {
                    (onClick as () => void)();
                  } else {
                    (onClick as (caddie: CaddieData) => void)(caddie!);
                  }
                }
              }
            : undefined
        }
      >
        <span className="text-sm font-medium text-[#AEAAAA]">{emptyText}</span>
      </div>
    );
  }

  if (!caddie) return null;

  const cardStyle = getCaddieCardStyle(caddie);
  const specialBadgeStyle = getSpecialBadgeStyle(caddie.specialBadge);

  const handleDragStart = (e: React.DragEvent) => {
    // 타입 식별자와 함께 데이터 설정
    const dragData = {
      type: "caddie",
      data: caddie,
    };
    e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = "move";
    onDragStart?.(e);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    onDragEnd?.(e);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDoubleClick) {
      onDoubleClick();
    }
  };

  return (
    <div
      className={`w-[218px] flex items-center justify-between px-2 py-1.5 bg-white rounded-md border border-[#DDDDDD] ${cardStyle} ${
        isDragging ? "opacity-50" : ""
      } ${draggable ? "cursor-move" : ""}`}
      draggable={draggable}
      onDragStart={draggable ? handleDragStart : undefined}
      onDragEnd={draggable ? handleDragEnd : undefined}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex items-center gap-1.5">
        {/* 조 배지 */}
        <div className="w-9 h-5 bg-[#DDE9FF] text-[#1061F9] text-xs font-bold rounded-xl flex items-center justify-center flex-shrink-0">
          {caddie.groupName ||
            (caddie.group > 0 ? `${caddie.group}조` : "미배정")}
        </div>

        {/* 이름 */}
        <span className="text-sm font-medium text-black flex-shrink-0">
          {caddie.name}
        </span>

        {/* 특수반 배지 - 있을 때만 표시 */}
        {caddie.badge && (
          <div className="w-12 h-5 bg-[#FFF5E6] text-black/30 text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
            {caddie.badge}
          </div>
        )}

        {/* 상태 구분선 및 배지 */}
        {(caddie.status === "휴무" ||
          caddie.specialBadge ||
          caddie.isSpare ||
          isSpare) && (
          <>
            <div className="w-0.5 h-4 bg-[#E3E3E3] flex-shrink-0"></div>
            {caddie.status === "휴무" && (
              <div className="w-10 h-5 bg-[#FFF5E6] text-[#FEB912] text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                휴무
              </div>
            )}
            {(caddie.isSpare || isSpare) && (
              <div className="w-10 h-5 bg-[#E8F5E8] text-[#22C55E] text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                스페어
              </div>
            )}
            {specialBadgeStyle && (
              <div
                className="w-12 h-5 text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: specialBadgeStyle.bg,
                  color: specialBadgeStyle.text,
                }}
              >
                {caddie.specialBadge}
              </div>
            )}
          </>
        )}
      </div>

      {/* 메뉴 아이콘 (클릭 시 팝오버 메뉴 표시) */}
      <div
        className="relative flex-shrink-0"
        ref={menuRef}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <MoreVertical className="w-5 h-4 text-black/80" />
        </button>

        {/* 팝오버 메뉴 */}
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="py-1">
              {onStatusToggle ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusToggle();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  상태 변경
                </button>
              ) : (
                <div className="px-3 py-2 text-sm text-gray-400">
                  상태 변경 불가
                </div>
              )}
              {onSpareToggle ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpareToggle();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  {caddie?.isSpare || isSpare ? "스페어 해제" : "스페어 설정"}
                </button>
              ) : (
                <div className="px-3 py-2 text-sm text-gray-400">
                  스페어 설정 불가
                </div>
              )}
              {onCaddieRemove ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCaddieRemove();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <UserMinus className="w-4 h-4" />
                  캐디 제거
                </button>
              ) : (
                <div className="px-3 py-2 text-sm text-gray-400">
                  캐디 제거 불가
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
