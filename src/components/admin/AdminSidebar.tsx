"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart2,
  DollarSign,
  Star,
  Users,
  Settings,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "ড্যাশবোর্ড", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "প্রোডাক্ট", icon: Package },
  { href: "/admin/orders", label: "অর্ডার", icon: ShoppingCart },
  { href: "/admin/sales", label: "সেলস", icon: BarChart2 },
  { href: "/admin/expenses", label: "খরচ ট্র্যাকার", icon: DollarSign },
  { href: "/admin/reviews", label: "রিভিউ", icon: Star },
  { href: "/admin/customers", label: "কাস্টমার", icon: Users },
  { href: "/admin/settings", label: "সেটিংস", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-white/5 flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">
              Super Shop
            </p>
            <p className="text-slate-500 text-xs mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-wider px-3 py-2">
          মেনু
        </p>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                active
                  ? "bg-violet-500/15 text-violet-400 border border-violet-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  active
                    ? "text-violet-400"
                    : "text-slate-500 group-hover:text-slate-300",
                )}
              />
              <span className="flex-1">{label}</span>
              {active && (
                <ChevronRight className="w-3 h-3 text-violet-400/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          স্টোরে যান
        </Link>
      </div>
    </aside>
  );
}
