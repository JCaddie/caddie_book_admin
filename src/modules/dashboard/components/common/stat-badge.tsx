"use client";

import { memo } from "react";
import { DASHBOARD_STYLES } from "../../constants/styles";

export interface StatBadgeItem {
  label: string;
  value: number;
  color: string;
}

interface StatBadgeProps {
  items: StatBadgeItem[];
  className?: string;
}

const StatBadge = memo(({ items, className }: StatBadgeProps) => {
  return (
    <div
      className={`${DASHBOARD_STYLES.STAT_BADGE_CONTAINER} ${className || ""}`}
    >
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-2">
          {index > 0 && (
            <div className={DASHBOARD_STYLES.STAT_BADGE_DIVIDER}></div>
          )}
          <div className={DASHBOARD_STYLES.STAT_BADGE_ITEM}>
            <div
              className={DASHBOARD_STYLES.STAT_BADGE_LABEL}
              style={{ backgroundColor: item.color }}
            >
              {item.label}
            </div>
            <span className={DASHBOARD_STYLES.STAT_BADGE_VALUE}>
              {item.value.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
});

StatBadge.displayName = "StatBadge";

export default StatBadge;
