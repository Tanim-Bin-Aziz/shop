"use client";

import { Expense } from "@/types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

interface Props {
  expenses: Expense[];
}

export function ExpenseCharts({ expenses }: Props) {
  // Pie — by category
  const categoryMap: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] ?? 0) + Number(e.amount);
  });
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Bar — last 6 months
  const monthMap: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    monthMap[key] = 0;
  }
  expenses.forEach((e) => {
    const d = new Date(e.date);
    const key = d.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    if (monthMap[key] !== undefined) {
      monthMap[key] += Number(e.amount);
    }
  });
  const barData = Object.entries(monthMap).map(([month, amount]) => ({
    month,
    amount,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <div>
          <h2 className="font-semibold text-base">By Category</h2>
          <p className="text-xs text-muted-foreground">Expense breakdown</p>
        </div>
        {pieData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            No data yet.
          </p>
        ) : (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `৳${Number(val).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="space-y-2 flex-1">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground truncate">
                    {item.name}
                  </span>
                  <span className="text-xs font-medium ml-auto">
                    ৳{item.value.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bar Chart */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <div>
          <h2 className="font-semibold text-base">Monthly Expenses</h2>
          <p className="text-xs text-muted-foreground">Last 6 months</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(val) => `৳${Number(val).toFixed(2)}`} />
            <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
