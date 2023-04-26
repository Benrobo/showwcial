import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartProp {
  data: object[];
  strokeColor?: string;
  fill?: string;
  strokeWidth?: number;
  dataKey: string;
  width?: number;
  height?: number;
}

export function TinyAreaChart({
  data,
  strokeColor,
  width,
  height,
  fill,
  dataKey,
  strokeWidth,
}: ChartProp) {
  return (
    <AreaChart width={width ?? 320} height={height ?? 80} data={data}>
      <Area
        type="monotone"
        dataKey={dataKey}
        stroke={strokeColor ?? "#3F7EEE"}
        fill={fill ?? "rgba(1, 65, 226, 0.2)"}
        strokeWidth={strokeWidth ?? 2}
      />
    </AreaChart>
  );
}

export function SiteViewsAnalyticsChart({
  data,
  strokeColor,
  width,
  height,
  fill,
  dataKey,
  strokeWidth,
}: ChartProp) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={width ?? 200}
        height={height ?? 60}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis dataKey="timeframe" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor ?? "#3F7EEE"}
          fill={fill ?? "rgba(1, 65, 226, 0.2)"}
          strokeWidth={strokeWidth ?? 2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
