import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "green"
    | "yellow"
    | "red"
    | "orange"
    | "primary"
    | "secondary"
    | "gray";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className = "",
}) => {
  // Figma 스펙에 따른 variant별 스타일
  const getVariantStyles = () => {
    const variants = {
      green: "bg-green-500 text-white", // #94D447 (사용 중)
      yellow: "bg-yellow-500 text-white", // #D4C147 (대기)
      red: "bg-red-500 text-white", // #D44947 (충전 중)
      orange: "bg-orange-500 text-white", // #D48447 (정비 중)
      primary: "bg-primary text-white",
      secondary: "bg-gray-100 text-gray-700",
      gray: "bg-gray-500 text-white",
    };

    return variants[variant] || variants.primary;
  };

  // Figma 스펙에 맞는 CSS 커스텀 스타일
  const customStyles = {
    backgroundColor:
      variant === "green"
        ? "#94D447"
        : variant === "yellow"
        ? "#D4C147"
        : variant === "red"
        ? "#D44947"
        : variant === "orange"
        ? "#D48447"
        : undefined,
  };

  return (
    <span
      className={[
        // Figma 스펙: 56px width, 24px height, 2px 8px padding, 6px radius
        "inline-flex items-center justify-center",
        "w-14 h-6 px-2 py-0.5",
        "rounded-md",
        // Figma 스펙: Pretendard 500 13px, 흰색 텍스트
        "text-xs font-medium text-white text-center",
        "whitespace-nowrap",
        getVariantStyles(),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={customStyles}
    >
      {children}
    </span>
  );
};

export default Badge;
