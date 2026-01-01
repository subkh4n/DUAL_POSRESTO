"use client";

import { Card, CardHeader, CardBody, CardTitle } from "@/components/selia/card";
import { Button } from "@/components/selia/button";
import { ChevronDownIcon } from "lucide-react";
import { formatIDR } from "@/lib/utils";

interface SalesChartProps {
  data?: number[];
  labels?: string[];
}

export function SalesChart({
  data = [800, 1200, 1000, 1400, 1100, 1600, 1300],
  labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
}: SalesChartProps) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;

  // Generate points for the SVG path
  const width = 600;
  const height = 200;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y =
      chartHeight - ((value - minValue) / range) * (chartHeight - 40) + 20;
    return { x, y, value };
  });

  // Create path string
  const pathD = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    // Create smooth curve
    const prev = points[index - 1];
    const cpx1 = prev.x + (point.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (point.x - prev.x) / 2;
    const cpy2 = point.y;

    return `${path} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${point.x} ${point.y}`;
  }, "");

  // Create area path
  const areaD = `${pathD} L ${
    points[points.length - 1].x
  } ${chartHeight} L ${padding} ${chartHeight} Z`;

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Sales</CardTitle>
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          Last Week
          <ChevronDownIcon className="size-3" />
        </Button>
      </CardHeader>
      <CardBody className="pt-0">
        <svg
          viewBox={`0 0 ${width} ${height + 30}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Y-axis labels */}
          {[maxValue, Math.round((maxValue + minValue) / 2), minValue].map(
            (val, i) => (
              <text
                key={i}
                x={padding - 10}
                y={20 + i * (chartHeight / 2 - 10)}
                textAnchor="end"
                className="fill-slate-400 text-xs"
                fontSize="12"
              >
                {formatIDR(val)}
              </text>
            )
          )}

          {/* Grid lines */}
          {[0, 1, 2].map((i) => (
            <line
              key={i}
              x1={padding}
              y1={20 + i * (chartHeight / 2 - 10)}
              x2={width - padding}
              y2={20 + i * (chartHeight / 2 - 10)}
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="white"
              stroke="#3B82F6"
              strokeWidth="2"
            />
          ))}

          {/* X-axis labels */}
          {labels.map((label, index) => (
            <text
              key={index}
              x={padding + (index / (labels.length - 1)) * chartWidth}
              y={height + 15}
              textAnchor="middle"
              className="fill-slate-400"
              fontSize="12"
            >
              {label}
            </text>
          ))}
        </svg>
      </CardBody>
    </Card>
  );
}
