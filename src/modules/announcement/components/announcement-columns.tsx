"use client";

import React, { useMemo } from "react";
import { Column } from "@/shared/types/table";
import { Announcement } from "../types";
import { ANNOUNCEMENT_COLUMN_WIDTHS } from "../constants";

// 날짜 포맷팅 함수
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 조회수 포맷팅 함수
const formatViews = (views: number): string => {
  return views.toLocaleString();
};

// 제목 컴포넌트
const TitleCell: React.FC<{ title: string; isPublished: boolean }> = ({
  title,
  isPublished,
}) => {
  return (
    <div className="flex items-center justify-start gap-2">
      <span className="text-sm font-medium text-gray-800 truncate">
        {title}
      </span>
      {!isPublished && (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300">
          비공개
        </span>
      )}
    </div>
  );
};

// 공지사항 테이블 컬럼 정의
export const useAnnouncementColumns = (): Column<Announcement>[] => {
  return useMemo(
    () => [
      {
        key: "no",
        title: "No.",
        width: ANNOUNCEMENT_COLUMN_WIDTHS.no,
        render: (value: unknown) => (
          <div className="text-center">
            <span className="text-sm font-medium text-gray-800">
              {value as number}
            </span>
          </div>
        ),
      },
      {
        key: "title",
        title: "제목",
        width: ANNOUNCEMENT_COLUMN_WIDTHS.title,
        render: (value: unknown, record: Announcement) => (
          <TitleCell title={value as string} isPublished={record.isPublished} />
        ),
      },
      {
        key: "views",
        title: "조회수",
        width: ANNOUNCEMENT_COLUMN_WIDTHS.views,
        render: (value: unknown) => (
          <div className="text-center">
            <span className="text-sm font-medium text-gray-800">
              {formatViews(value as number)}
            </span>
          </div>
        ),
      },
      {
        key: "createdAt",
        title: "등록일자",
        width: ANNOUNCEMENT_COLUMN_WIDTHS.createdAt,
        render: (value: unknown) => (
          <div className="text-center">
            <span className="text-sm font-medium text-gray-800">
              {formatDate(value as string)}
            </span>
          </div>
        ),
      },
      {
        key: "updatedAt",
        title: "수정일자",
        width: ANNOUNCEMENT_COLUMN_WIDTHS.updatedAt,
        render: (value: unknown) => (
          <div className="text-center">
            <span className="text-sm font-medium text-gray-800">
              {formatDate(value as string)}
            </span>
          </div>
        ),
      },
    ],
    []
  );
};
