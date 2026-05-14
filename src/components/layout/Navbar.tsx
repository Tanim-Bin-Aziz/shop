"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  Package,
  Home,
  Heart,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Products", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { items } = useCartStore();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  // User — পরে Supabase auth থেকে আসবে
  const user = null as null | { name: string; email: string; image?: string };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-4">
        {/* ── বাম পাশে: Mobile Menu Icon + Logo ── */}
        <div className="flex items-center gap-3">
          {/* Hamburger — শুধু mobile এ দেখাবে */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0 glass">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex items-center justify-between px-5 h-16 border-b">
                <Link
                  href="/"
                  className="text-lg font-bold"
                  onClick={() => setMobileOpen(false)}
                >
                  Super<span className="text-primary">Shop</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      pathname === href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight">
            Super<span className="text-primary">Shop</span>
          </Link>
        </div>

        {/* ── মাঝে: Desktop Nav Links ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ── ডান পাশে: Search + Cart + Profile ── */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="hidden sm:flex"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Cart — animated badge সহ */}
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge
                      variant="destructive"
                      className="h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </Badge>
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </Link>

          {/* Profile */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="Profile"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden sm:flex"
            >
              <Link href="/login">
                <User className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
