"use client";

import { RevenueByDay } from "@/hooks/useSalesData";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  data: RevenueByDay[];
}

export function RevenueChart({ data }: Props) {
  const [type, setType] = useState<"revenue" | "orders">("revenue");
  const [chart, setChart] = useState<"area" | "bar">("area");

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-base">
            {type === "revenue" ? "Revenue" : "Orders"} — Last 30 Days
          </h2>
          <p className="text-xs text-muted-foreground">Daily breakdown</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Revenue / Orders */}
          <div className="flex rounded-lg border overflow-hidden text-sm">
            {(["revenue", "orders"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 capitalize transition-colors ${
                  type === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Toggle Area / Bar */}
          <div className="flex rounded-lg border overflow-hidden text-sm">
            {(["area", "bar"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setChart(c)}
                className={`px-3 py-1.5 capitalize transition-colors ${
                  chart === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        {chart === "area" ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              interval={4}
            />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(val) =>
                typeof val === "number"
                  ? type === "revenue"
                    ? `৳${val.toFixed(2)}`
                    : val
                  : val
              }
            />
            <Area
              type="monotone"
              dataKey={type}
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorGrad)"
            />
          </AreaChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              interval={4}
            />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(val) =>
                typeof val === "number"
                  ? type === "revenue"
                    ? `৳${val.toFixed(2)}`
                    : val
                  : val
              }
            />
            <Bar dataKey={type} fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
