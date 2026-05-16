"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Menu,
  X,
  ShoppingCart,
  User as UserIcon,
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
import { toast } from "sonner";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Products", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const supabase = createClient();

  const { items } = useCartStore();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    const getUserWithRole = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;

      setUser(currentUser);

      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();

        setRole(profile?.role ?? null);
      }
    };

    getUserWithRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      getUserWithRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    toast.success("লগআউট সফল");
    router.push("/");
    router.refresh();
  }

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "";
  const initials = displayName.slice(0, 2).toUpperCase();

  // ✅ ONLY FIX (NO STRUCTURE CHANGE)
  const isAdmin = role === "admin";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-4">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0 glass">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              <div className="flex items-center justify-between px-5 h-16 border-b">
                <Link href="/" onClick={() => setMobileOpen(false)}>
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
                      "flex items-center gap-3 px-4 py-3 rounded-xl",
                      pathname === href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}

                {isAdmin && (
                  <Link
                    href="/orders"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted"
                  >
                    <Package className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}

                {user && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="text-xl font-bold">
            Super<span className="text-primary">Shop</span>
          </Link>
        </div>

        {/* CENTER */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-4 py-2 rounded-lg",
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge className="h-5 w-5 text-[10px]">
                      {cartCount > 9 ? "9+" : cartCount}
                    </Badge>
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2">
                  <p>{displayName}</p>
                  <p className="text-xs">{user.email}</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>

                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href="/login">
                <UserIcon className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
