"use client";

import { useMemo } from "react";

interface DataPoint {
  date: string;
  rate: number;
}

interface SparklineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showAxis?: boolean;
}

export function SparklineChart({
  data,
  width = 600,
  height = 200,
  color = "currentColor",
  strokeWidth = 2,
  showAxis = false,
}: SparklineChartProps) {
  const { path, minY, maxY } = useMemo(() => {
    if (data.length === 0) return { path: "", minY: 0, maxY: 0 };

    const values = data.map(d => d.rate);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const padding = (maxVal - minVal) * 0.1 || 0.01; // 10% padding

    const xStep = width / (data.length - 1 || 1);
    
    const points = data.map((point, index) => {
      const x = index * xStep;
      const y = height - ((point.rate - minVal + padding) / (maxVal - minVal + 2 * padding)) * height;
      return `${x},${y}`;
    });

    const linePath = `M ${points.join(" L ")}`;

    return { path: linePath, minY: minVal, maxY: maxVal };
  }, [data, width, height]);

  if (!data.length) return null;

  const trend = data[data.length - 1].rate > data[0].rate ? "up" : "down";
  const changePercentNum = ((data[data.length - 1].rate - data[0].rate) / data[0].rate * 100);
  const changePercent = changePercentNum.toFixed(2);

  return (
    <div className="w-full">
      {/* Trend indicator */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {trend === "up" ? "▲" : "▼"} {Math.abs(changePercentNum).toFixed(2)}%
        </span>
        <span className="text-xs text-muted-foreground">
          {data[0].date} → {data[data.length - 1].date}
        </span>
      </div>

      {/* SVG Chart */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        {/* Gradient fill */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d={`${path} L ${width},${height} L 0,${height} Z`}
          fill="url(#chartGradient)"
          opacity={0.3}
        />

        {/* Line */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots at start and end */}
        {data.length > 0 && (
          <>
            {/* Start dot */}
            <circle
              cx={0}
              cy={height - ((data[0].rate - minY) / (maxY - minY || 1)) * height}
              r={4}
              fill={color}
              stroke="white"
              strokeWidth={2}
            />
            {/* End dot */}
            <circle
              cx={width}
              cy={height - ((data[data.length - 1].rate - minY) / (maxY - minY || 1)) * height}
              r={4}
              fill={color}
              stroke="white"
              strokeWidth={2}
            />
          </>
        )}

        {/* Optional axis lines */}
        {showAxis && (
          <>
            <line x1={0} y1={height} x2={width} y2={height} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
            <line x1={0} y1={0} x2={0} y2={height} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
          </>
        )}
      </svg>
    </div>
  );
}
