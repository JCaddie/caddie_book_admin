"use client";

import { memo } from "react";
import { DASHBOARD_STYLES } from "../../constants/styles";

export type PeriodType = "daily" | "monthly";

interface PeriodToggleProps {
  value: PeriodType;
  onChange: (period: PeriodType) => void;
  className?: string;
}

const PeriodToggle = memo(
  ({ value, onChange, className }: PeriodToggleProps) => {
    return (
      <div
        className={`${DASHBOARD_STYLES.TOGGLE_CONTAINER} ${className || ""}`}
      >
        <div className="flex">
          <button
            onClick={() => onChange("daily")}
            className={`${DASHBOARD_STYLES.TOGGLE_BUTTON_BASE} ${
              value === "daily"
                ? DASHBOARD_STYLES.TOGGLE_BUTTON_ACTIVE
                : DASHBOARD_STYLES.TOGGLE_BUTTON_INACTIVE
            }`}
          >
            일간
          </button>
          <button
            onClick={() => onChange("monthly")}
            className={`${DASHBOARD_STYLES.TOGGLE_BUTTON_BASE} ${
              value === "monthly"
                ? DASHBOARD_STYLES.TOGGLE_BUTTON_ACTIVE
                : DASHBOARD_STYLES.TOGGLE_BUTTON_INACTIVE
            }`}
          >
            월간
          </button>
        </div>
      </div>
    );
  }
);

PeriodToggle.displayName = "PeriodToggle";

export default PeriodToggle;
