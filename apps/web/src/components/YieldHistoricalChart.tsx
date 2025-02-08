import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Skeleton } from "./ui/skeleton";

type YieldHistoricalChartProps = {
  // this will be defillama pool id
  poolIds: string[];
  title?: string;
  color?: string;
};

export type DefiLlamaYieldDataPoint = {
  timestamp: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number | null;
  il7d: number | null;
  apyBase7d: number | null;
};

const chartConfig = {} satisfies ChartConfig;

async function getYieldHistoricalChartData(
  poolId: string,
): Promise<DefiLlamaYieldDataPoint[]> {
  const response = await fetch(`https://yields.llama.fi/chart/${poolId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch yield data: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data as DefiLlamaYieldDataPoint[];
}

export function YieldHistoricalChart({
  poolIds,
  title,
  color,
}: YieldHistoricalChartProps) {
  const [data, setData] = useState<DefiLlamaYieldDataPoint[][] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const promises = poolIds.map((id: string) =>
          getYieldHistoricalChartData(id),
        );
        const results = await Promise.all(promises);
        setData(results);
      } catch (error) {
        console.error("Failed to fetch yield data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchData();
  }, [poolIds]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formattedYieldData = useMemo(() => {
    if (!data) return [];

    // Map each pool's data series
    return data.map((poolData, index) => {
      // Convert each data point for this pool
      const points = poolData.map((dataPoint) => ({
        date: new Date(dataPoint.timestamp).getTime(),
        apy: dataPoint.apy,
      }));

      // Sort by date
      points.sort((a, b) => a.date - b.date);

      // Return series with unique key
      return {
        key: `pool-${index}`,
        data: points,
      };
    });
  }, [data]);

  if (isLoading) return <Skeleton className="h-[200px] w-full" />;

  return (
    <div className="flex flex-col gap-2 items-center">
      {title && <div className="text-lg font-bold">{title}</div>}
      <ChartContainer
        config={chartConfig}
        // cannot use tailwind here
        style={{ height: "200px", width: "100%" }}
      >
        <LineChart data={formattedYieldData}>
          <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
          <XAxis
            dataKey="date"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatDate}
            label={{ value: "Date", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            label={{ value: "APY (%)", position: "insideLeft", offset: -5 }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, _name, props) => {
                  return (
                    <div className="text-sm flex flex-col gap-2">
                      <div>APY: {(value as number).toFixed(2)}%</div>
                      <div>Date: {formatDate(props.payload.date)}</div>
                    </div>
                  );
                }}
              />
            }
          />
          {formattedYieldData.map((series) => (
            <Line
              data={series.data}
              type="monotone"
              dataKey="apy"
              strokeWidth={2}
              stroke={
                color ?? `#${Math.floor(Math.random() * 16777215).toString(16)}`
              }
              dot={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
}
