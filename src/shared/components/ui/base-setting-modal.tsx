"use client";

import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "./index";
import { BaseSettingItem, BaseSettingModalProps } from "@/shared/types";

function BaseSettingModal<T extends BaseSettingItem>({
  isOpen,
  onClose,
  onSave,
  initialItems = [],
  isLoading = false,
  config,
}: BaseSettingModalProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // 모달이 열릴 때마다 초기 아이템으로 리셋
  useEffect(() => {
    if (isOpen) {
      setItems(initialItems);
      setSelectedItemId(null);
    }
  }, [isOpen, initialItems]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleItemNameChange = (itemId: string, newName: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, name: newName } : item
      )
    );
  };

  const handleAddItem = () => {
    const newItem = config.createNewItem();
    setItems((prev) => [...prev, newItem]);
    setSelectedItemId(newItem.id);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    }
  };

  const handleSave = () => {
    // 각 아이템 검증
    for (const item of items) {
      const error = config.validateItem(item);
      if (error) {
        alert(error);
        return;
      }
    }

    onSave(items);
  };

  const hasItems = items.length > 0;

  // 모달 높이 계산 - 안전한 최대 높이 제한
  const getModalHeight = () => {
    if (!hasItems) return "508px"; // 빈 상태일 때 고정 높이

    const headerHeight = 72; // 헤더 높이
    const footerHeight = 138; // 하단 버튼 영역 높이
    const minContentHeight = 96; // 최소 컨텐츠 높이
    const itemHeight = 48; // 각 아이템 높이
    const safeMaxHeight = 600; // 안전한 최대 높이

    // 아이템 수에 따른 이상적인 높이 계산
    const idealContentHeight = Math.max(
      minContentHeight,
      items.length * itemHeight + 8
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
          <h2 className="text-lg font-semibold text-black">{config.title}</h2>
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
        {hasItems ? (
          <div className="px-0 pt-2 flex-1 flex flex-col">
            <div
              className="w-full overflow-y-auto flex-1"
              style={{
                maxHeight: "390px",
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center px-4 py-2 gap-2.5 ${
                    selectedItemId === item.id ? "bg-yellow-50" : ""
                  }`}
                  onClick={() => setSelectedItemId(item.id)}
                >
                  {config.renderItem(
                    item,
                    selectedItemId === item.id,
                    (newName: string) => handleItemNameChange(item.id, newName),
                    () => handleDeleteItem(item.id)
                  )}
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
                {config.emptyMessage}
              </p>
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex flex-col p-4 flex-shrink-0">
          {/* 생성 버튼 영역 */}
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleAddItem}
              disabled={isLoading}
              variant="outline"
              className="text-yellow-600 border-yellow-400 hover:bg-yellow-50 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              {config.createButtonText}
            </Button>
          </div>

          {/* 액션 버튼 영역 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              취소
            </Button>
            <Button
              onClick={handleSave}
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
}

export default BaseSettingModal;
