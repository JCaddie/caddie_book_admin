"use client";

import { memo, ReactNode } from "react";
import { DASHBOARD_STYLES } from "../../constants/styles";

interface SectionHeaderProps {
  title: string;
  rightElement?: ReactNode;
  className?: string;
}

const SectionHeader = memo(
  ({ title, rightElement, className }: SectionHeaderProps) => {
    return (
      <div className={`${DASHBOARD_STYLES.SECTION_HEADER} ${className || ""}`}>
        <h3 className={DASHBOARD_STYLES.SECTION_TITLE}>{title}</h3>
        {rightElement && rightElement}
      </div>
    );
  }
);

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
