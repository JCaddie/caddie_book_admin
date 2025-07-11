/**
 * 테이블 렌더러 유틸리티
 */

import React from "react";
import {
  formatDate,
  formatDateOnly,
  formatNumber,
  formatPhoneNumber,
  safeString,
  truncateText,
} from "@/shared/lib/format-utils";

// 렌더러 함수 타입 정의
export type TableRenderer<T = Record<string, unknown>> = (
  value: unknown,
  record: T,
  index?: number
) => React.ReactNode;

// 렌더러 옵션 타입
export interface RendererOptions {
  align?: "left" | "center" | "right";
  className?: string;
  style?: React.CSSProperties;
}

// Badge 스타일 타입
export interface BadgeStyle {
  bg: string;
  text: string;
  border?: string;
}

// Badge 설정 타입
export interface BadgeConfig {
  [key: string]: BadgeStyle;
}

// 기본 렌더러 팩토리 함수
export const createTableRenderer = <T extends Record<string, unknown>>(
  renderFn: (value: unknown, record: T, index?: number) => React.ReactNode,
  options: RendererOptions = {}
): TableRenderer<T> => {
  return (value: unknown, record: T, index?: number): React.ReactNode => {
    // isEmpty 체크 - 모든 렌더러에서 공통으로 처리
    if ((record as { isEmpty?: boolean })?.isEmpty) return null;

    const { align = "center", className = "", style = {} } = options;

    const content = renderFn(value, record, index);

    // 정렬 클래스 생성
    const alignClass = {
      left: "text-left justify-start",
      center: "text-center justify-center",
      right: "text-right justify-end",
    }[align];

    return (
      <div
        className={`flex items-center ${alignClass} ${className}`}
        style={style}
      >
        {content}
      </div>
    );
  };
};

// 기본 텍스트 스타일 컴포넌트
function BaseText({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      className={`text-sm font-medium text-gray-800 ${className}`}
      title={title}
    >
      {children}
    </span>
  );
}

BaseText.displayName = "BaseText";

// 배지 컴포넌트
function Badge({
  children,
  style,
}: {
  children: React.ReactNode;
  style: BadgeStyle;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
        style.bg
      } ${style.text} ${style.border || "border-gray-300"}`}
    >
      {children}
    </span>
  );
}

Badge.displayName = "Badge";

// === 기본 렌더러들 ===

// 텍스트 렌더러
export const textRenderer = <T extends Record<string, unknown>>(
  options: RendererOptions & { truncate?: number } = {}
): TableRenderer<T> => {
  const { truncate, ...rendererOptions } = options;

  return createTableRenderer<T>((value) => {
    const text = safeString(value);
    const displayText = truncate ? truncateText(text, truncate) : text;

    return <BaseText title={text}>{displayText}</BaseText>;
  }, rendererOptions);
};

// 숫자 렌더러
export const numberRenderer = <T extends Record<string, unknown>>(
  options: RendererOptions = {}
): TableRenderer<T> => {
  return createTableRenderer<T>(
    (value) => {
      const formattedNumber = formatNumber(value as number);

      return <BaseText>{formattedNumber}</BaseText>;
    },
    { align: "center", ...options }
  );
};

// 날짜 렌더러
export const dateRenderer = <T extends Record<string, unknown>>(
  options: RendererOptions & { timeIncluded?: boolean } = {}
): TableRenderer<T> => {
  const { timeIncluded = true, ...rendererOptions } = options;

  return createTableRenderer<T>(
    (value) => {
      const formattedDate = timeIncluded
        ? formatDate(value as string)
        : formatDateOnly(value as string);

      return <BaseText>{formattedDate}</BaseText>;
    },
    { align: "center", ...rendererOptions }
  );
};

// 전화번호 렌더러
export const phoneRenderer = <T extends Record<string, unknown>>(
  options: RendererOptions = {}
): TableRenderer<T> => {
  return createTableRenderer<T>(
    (value) => {
      const formattedPhone = formatPhoneNumber(value as string);

      return <BaseText>{formattedPhone}</BaseText>;
    },
    { align: "center", ...options }
  );
};

// 이메일 렌더러
export const emailRenderer = <T extends Record<string, unknown>>(
  options: RendererOptions & { truncate?: number } = {}
): TableRenderer<T> => {
  const { truncate = 30, ...rendererOptions } = options;

  return createTableRenderer<T>(
    (value) => {
      const email = safeString(value);
      const displayEmail = truncateText(email, truncate);

      return (
        <BaseText title={email} className="text-blue-600">
          {displayEmail}
        </BaseText>
      );
    },
    { align: "left", ...rendererOptions }
  );
};

// 번호(순서) 렌더러 - 특별히 no 필드용
export const indexRenderer = <T extends Record<string, unknown>>(
  options: RendererOptions = {}
): TableRenderer<T> => {
  return createTableRenderer<T>(
    (value, record) => {
      // record.no가 있으면 사용, 없으면 value 사용
      const recordWithNo = record as { no?: number };
      const displayValue =
        recordWithNo.no !== undefined ? recordWithNo.no : value;

      return <BaseText>{String(displayValue)}</BaseText>;
    },
    { align: "center", ...options }
  );
};

// === 고급 렌더러들 ===

// 배지 렌더러
export const badgeRenderer = <T extends Record<string, unknown>>(
  badgeConfig: BadgeConfig,
  options: RendererOptions = {}
): TableRenderer<T> => {
  return createTableRenderer<T>(
    (value) => {
      const stringValue = safeString(value);
      const badgeStyle = badgeConfig[stringValue] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
      };

      return <Badge style={badgeStyle}>{stringValue}</Badge>;
    },
    { align: "center", ...options }
  );
};

// 불린 배지 렌더러 (게시됨/비게시됨 등)
export const booleanBadgeRenderer = <T extends Record<string, unknown>>(
  trueLabel: string = "활성",
  falseLabel: string = "비활성",
  options: RendererOptions = {}
): TableRenderer<T> => {
  const badgeConfig: BadgeConfig = {
    true: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    false: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-300",
    },
  };

  return createTableRenderer<T>(
    (value) => {
      const boolValue = Boolean(value);
      const label = boolValue ? trueLabel : falseLabel;
      const badgeStyle = badgeConfig[String(boolValue)];

      return <Badge style={badgeStyle}>{label}</Badge>;
    },
    { align: "center", ...options }
  );
};

// 상태 렌더러 (미리 정의된 상태들)
export const statusRenderer = <T extends Record<string, unknown>>(
  options: RendererOptions = {}
): TableRenderer<T> => {
  const statusConfig: BadgeConfig = {
    // 공통 상태
    활성: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    비활성: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-300",
    },
    대기: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
    },
    승인: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    반려: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
    완료: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-300",
    },

    // 카트 상태
    사용중: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    점검중: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
    },
    고장: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
    사용불가: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-300",
    },

    // 신청 상태
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
    },
    approved: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
    },
  };

  return badgeRenderer(statusConfig, options);
};

// === 편의 렌더러들 (자주 사용되는 조합) ===

// 기본 렌더러 세트
export const basicRenderers = {
  // 가장 기본적인 텍스트
  text: textRenderer(),

  // 좌측 정렬 텍스트
  textLeft: textRenderer({ align: "left" }),

  // 숫자 (천 단위 콤마)
  number: numberRenderer(),

  // 날짜 (시간 포함)
  date: dateRenderer(),

  // 날짜 (날짜만)
  dateOnly: dateRenderer({ timeIncluded: false }),

  // 순서 번호
  index: indexRenderer(),

  // 전화번호
  phone: phoneRenderer(),

  // 이메일
  email: emailRenderer(),

  // 긴 텍스트 (자동 줄임)
  longText: textRenderer({ truncate: 30, align: "left" }),

  // 상태 배지
  status: statusRenderer(),

  // 게시 상태 (게시됨/비공개)
  published: booleanBadgeRenderer("게시됨", "비공개"),

  // 활성 상태 (활성/비활성)
  active: booleanBadgeRenderer("활성", "비활성"),
};

// 타입 확장을 위한 export
export type BasicRenderers = typeof basicRenderers;
