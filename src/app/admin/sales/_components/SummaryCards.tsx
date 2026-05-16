import { SummaryStats } from "@/hooks/useSalesData";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  BarChart2,
  Clock,
  CheckCircle2,
} from "lucide-react";

const cards = (stats: SummaryStats) => [
  {
    label: "Total Revenue",
    value: `৳${stats.totalRevenue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    })}`,
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Total Orders",
    value: stats.totalOrders,
    icon: ShoppingBag,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Total Customers",
    value: stats.totalCustomers,
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Avg Order Value",
    value: `৳${stats.avgOrderValue.toFixed(2)}`,
    icon: BarChart2,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    label: "Pending Orders",
    value: stats.pendingOrders,
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    label: "Delivered Orders",
    value: stats.deliveredOrders,
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

interface Props {
  stats: SummaryStats;
}

export function SummaryCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards(stats).map((card) => (
        <div
          key={card.label}
          className="rounded-xl border bg-card p-4 space-y-3 shadow-sm"
        >
          <div className={`inline-flex p-2 rounded-lg ${card.bg}`}>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
