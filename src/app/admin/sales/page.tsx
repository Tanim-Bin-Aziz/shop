"use client";

import {
  useSummaryStats,
  useRevenueChart,
  useTopProducts,
  useRecentOrders,
} from "@/hooks/useSalesData";
import { SummaryCards } from "./_components/SummaryCards";
import { RevenueChart } from "./_components/RevenueChart";
import { TopProducts } from "./_components/TopProducts";
import { RecentOrders } from "./_components/RecentOrders";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2 } from "lucide-react";

export default function SalesDashboardPage() {
  const { data: stats, isLoading: loadingStats } = useSummaryStats();
  const { data: chartData, isLoading: loadingChart } = useRevenueChart();
  const { data: topProducts, isLoading: loadingTop } = useTopProducts();
  const { data: recentOrders, isLoading: loadingRecent } = useRecentOrders();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BarChart2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your store performance
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {loadingStats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        stats && <SummaryCards stats={stats} />
      )}

      {/* Revenue Chart */}
      {loadingChart ? (
        <Skeleton className="h-80 rounded-xl" />
      ) : (
        chartData && <RevenueChart data={chartData} />
      )}

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loadingTop ? (
          <Skeleton className="h-72 rounded-xl" />
        ) : (
          topProducts && <TopProducts data={topProducts} />
        )}

        {loadingRecent ? (
          <Skeleton className="h-72 rounded-xl" />
        ) : (
          recentOrders && <RecentOrders data={recentOrders} />
        )}
      </div>
    </div>
  );
}
