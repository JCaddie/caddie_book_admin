"use client";

import React, { useMemo } from "react";
import { Column } from "@/shared/types/table";
import { basicRenderers } from "@/shared/components/ui";
import { AnnouncementWithNo } from "../types";
import { ANNOUNCEMENT_COLUMN_WIDTHS } from "../constants";

// 제목 컴포넌트 (복잡한 로직이 있어서 유지)
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
export const useAnnouncementColumns = (): Column<AnnouncementWithNo>[] => {
  return useMemo(
    () => [
      {
        key: "no",
        title: "No.",
        width: ANNOUNCEMENT_COLUMN_WIDTHS.no,
        render: basicRenderers.index, // 🎉 중복 제거!
      },
      {
        key: "title",
        title: "제목",
        width: ANNOUNCEMENT_COLUMN_WIDTHS.title,
        render: (value: unknown, record: AnnouncementWithNo) => {
          if (record.isEmpty) return null;
          return (
            <TitleCell
              title={value as string}
              isPublished={record.isPublished}
            />
          );
        },
      },
      {
        key: "views",
        title: "조회수",
        width: ANNOUNCEMENT_COLUMN_WIDTHS.views,
        render: basicRenderers.number, // 🎉 중복 제거!
      },
      {
        key: "createdAt",
        title: "등록일자",
        width: ANNOUNCEMENT_COLUMN_WIDTHS.createdAt,
        render: basicRenderers.date, // 🎉 중복 제거!
      },
      {
        key: "authorName",
        title: "작성자",
        width: ANNOUNCEMENT_COLUMN_WIDTHS.author,
        render: basicRenderers.text,
      },
      {
        key: "golfCourseName",
        title: "골프장",
        width: 150,
        render: basicRenderers.text,
      },
      {
        key: "announcementTypeDisplay",
        title: "공지 유형",
        width: 120,
        render: basicRenderers.text,
      },
      {
        key: "targetGroup",
        title: "대상 그룹",
        width: 120,
        render: (value: unknown) => {
          if (!value) return "-";
          return String(value);
        },
      },
    ],
    []
  );
};
