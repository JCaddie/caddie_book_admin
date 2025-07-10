import { ChartData } from "../types";

export interface RechartsDataPoint {
  name: string;
  [key: string]: string | number;
}

/**
 * Chart.js 형태의 데이터를 Recharts 형태로 변환
 */
export const transformChartData = (
  chartData: ChartData
): RechartsDataPoint[] => {
  const { labels, datasets } = chartData;

  return labels.map((label, index) => {
    const dataPoint: RechartsDataPoint = { name: label };

    datasets.forEach((dataset) => {
      // 라벨에서 키 생성 (한글 -> 영문)
      const key = dataset.label
        .replace("총계", "total")
        .replace("계약", "contract")
        .replace("대기", "waiting")
        .replace("누적 가입자", "totalUsers")
        .replace("재직", "active")
        .replace("휴직", "inactive")
        .replace("팀", "team");

      dataPoint[key] = dataset.data[index] || 0;
    });

    return dataPoint;
  });
};

/**
 * 계약 현황 차트 데이터에 대기 데이터 추가
 */
export const addWaitingDataToContract = (chartData: ChartData): ChartData => {
  const { datasets } = chartData;

  // 대기 데이터 생성 (총계 - 계약)
  const totalData = datasets.find((d) => d.label === "총계")?.data || [];
  const contractData = datasets.find((d) => d.label === "계약")?.data || [];
  const waitingData = totalData.map(
    (total, index) => total - (contractData[index] || 0)
  );

  return {
    ...chartData,
    datasets: [
      ...datasets,
      {
        label: "대기",
        data: waitingData,
        borderColor: "#66C6B4",
        backgroundColor: "rgba(102, 198, 180, 0.1)",
      },
    ],
  };
};
