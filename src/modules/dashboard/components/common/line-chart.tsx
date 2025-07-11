"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartData } from "../../types";
import {
  addWaitingDataToContract,
  transformChartData,
} from "../../utils/chart-utils";

export interface LegendItem {
  label: string;
  color: string;
}

interface LineChartComponentProps {
  chartData: ChartData;
  legends: LegendItem[];
  type?: "contract" | "user" | "team";
  height?: number;
}

const LineChartComponent = ({
  chartData,
  legends,
  type = "contract",
  height = 286,
}: LineChartComponentProps) => {
  // 계약 현황인 경우 대기 데이터 추가
  const processedChartData =
    type === "contract" ? addWaitingDataToContract(chartData) : chartData;

  // Recharts 형태로 데이터 변환
  const rechartsData = transformChartData(processedChartData);

  // 라인 색상 매핑
  const getLineColor = (key: string) => {
    switch (key) {
      case "total":
      case "totalUsers":
        return "#5372F6";
      case "contract":
        return "#F99807";
      case "waiting":
        return "#66C6B4";
      case "active":
        return "#217F81";
      case "inactive":
        return "#D44947";
      case "team":
        return "#FEB912";
      default:
        return "#5372F6";
    }
  };

  // 데이터 키 추출 (name 제외)
  const dataKeys = Object.keys(rechartsData[0] || {}).filter(
    (key) => key !== "name"
  );

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={rechartsData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#DCE0E4"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "rgba(0, 0, 0, 0.4)" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "rgba(0, 0, 0, 0.4)" }}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #DCE0E4",
              borderRadius: "6px",
              fontSize: "12px",
            }}
          />

          {dataKeys.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={getLineColor(key)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: getLineColor(key) }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* 범례 */}
      <div className="flex justify-center gap-4 mt-4">
        {legends.map((legend) => (
          <div key={legend.label} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: legend.color }}
            />
            <span className="text-xs font-medium text-gray-800">
              {legend.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineChartComponent;
