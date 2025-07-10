"use client";

import { memo } from "react";
import { DASHBOARD_STYLES } from "../../constants/styles";

export interface LegendItem {
  label: string;
  color: string;
}

interface ChartPlaceholderProps {
  legends?: LegendItem[];
  height?: string;
  className?: string;
}

const ChartPlaceholder = memo(
  ({ legends = [], height = "h-72", className }: ChartPlaceholderProps) => {
    return (
      <div className={`${DASHBOARD_STYLES.CHART_CONTAINER} ${className || ""}`}>
        <div
          className={`${height} bg-gray-50 rounded-md flex items-center justify-center`}
        >
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-2">차트 영역</div>
            <div className="text-xs text-gray-500">
              실제 구현 시 Chart.js나 Recharts 등의 라이브러리 사용
            </div>
          </div>
        </div>

        {legends.length > 0 && (
          <div className={DASHBOARD_STYLES.LEGEND_CONTAINER}>
            {legends.map((legend) => (
              <div key={legend.label} className={DASHBOARD_STYLES.LEGEND_ITEM}>
                <div
                  className={DASHBOARD_STYLES.LEGEND_DOT}
                  style={{ backgroundColor: legend.color }}
                ></div>
                <span className={DASHBOARD_STYLES.LEGEND_TEXT}>
                  {legend.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ChartPlaceholder.displayName = "ChartPlaceholder";

export default ChartPlaceholder;
