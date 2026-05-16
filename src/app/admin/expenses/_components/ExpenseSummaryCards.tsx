import { Expense } from "@/types";
import { TrendingDown, TrendingUp, Wallet, Tag } from "lucide-react";

interface Props {
  expenses: Expense[];
  totalRevenue: number;
}

export function ExpenseSummaryCards({ expenses, totalRevenue }: Props) {
  const now = new Date();
  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });

  const totalExpense = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const monthExpense = thisMonth.reduce((s, e) => s + Number(e.amount), 0);
  const netProfit = totalRevenue - totalExpense;

  const topCategory = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount);
      return acc;
    },
    {} as Record<string, number>,
  );
  const topCat = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    {
      label: "Total Expenses",
      value: `৳${totalExpense.toFixed(2)}`,
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "This Month",
      value: `৳${monthExpense.toFixed(2)}`,
      icon: Wallet,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Net Profit",
      value: `৳${netProfit.toFixed(2)}`,
      icon: TrendingUp,
      color: netProfit >= 0 ? "text-green-600" : "text-red-600",
      bg: netProfit >= 0 ? "bg-green-50" : "bg-red-50",
    },
    {
      label: "Top Category",
      value: topCat ? topCat[0] : "—",
      icon: Tag,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
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
