"use client";

import React, { useCallback } from "react";
import type { AnnouncementFormData } from "../../types";

interface AnnouncementPublishSettingsProps {
  formData: Pick<AnnouncementFormData, "isPublished">;
  isReadonly?: boolean;
  onPublishToggle: () => void;
}

/**
 * 공지사항 게시 설정 컴포넌트
 * 게시 상태 토글을 담당합니다.
 */
export const AnnouncementPublishSettings: React.FC<
  AnnouncementPublishSettingsProps
> = ({ formData, isReadonly = false, onPublishToggle }) => {
  const handleToggle = useCallback(() => {
    if (!isReadonly) {
      onPublishToggle();
    }
  }, [isReadonly, onPublishToggle]);

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">게시 설정</h3>

      <div className="space-y-4">
        {/* 게시 상태 토글 */}
        <div className="flex items-center justify-between">
          <div>
            <label
              htmlFor="publish-toggle"
              className="text-sm font-medium text-gray-700"
            >
              게시 상태
            </label>
            <p className="text-xs text-gray-500 mt-1">
              {formData.isPublished
                ? "공지사항이 사용자에게 공개됩니다"
                : "공지사항이 초안 상태로 저장됩니다"}
            </p>
          </div>

          <div className="flex items-center">
            <span
              className={`mr-3 text-sm ${
                formData.isPublished
                  ? "text-gray-400"
                  : "text-gray-700 font-medium"
              }`}
            >
              초안
            </span>
            <button
              id="publish-toggle"
              type="button"
              onClick={handleToggle}
              disabled={isReadonly}
              className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                ${formData.isPublished ? "bg-primary-600" : "bg-gray-200"}
                ${isReadonly ? "opacity-50 cursor-not-allowed" : ""}
              `}
              role="switch"
              aria-checked={formData.isPublished}
              aria-label="게시 상태 토글"
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                  transition duration-200 ease-in-out
                  ${formData.isPublished ? "translate-x-5" : "translate-x-0"}
                `}
              />
            </button>
            <span
              className={`ml-3 text-sm ${
                formData.isPublished
                  ? "text-primary-600 font-medium"
                  : "text-gray-400"
              }`}
            >
              게시
            </span>
          </div>
        </div>

        {/* 게시 상태 안내 */}
        <div
          className={`
          p-3 rounded-md text-sm
          ${
            formData.isPublished
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
          }
        `}
        >
          {formData.isPublished ? (
            <div className="flex items-start">
              <svg
                className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-medium">게시 중</p>
                <p className="text-xs mt-1">
                  이 공지사항은 사용자에게 공개됩니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start">
              <svg
                className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-medium">초안 상태</p>
                <p className="text-xs mt-1">
                  저장 후 게시 상태로 변경할 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
