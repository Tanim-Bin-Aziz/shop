"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, User } from "lucide-react";
import { toast } from "sonner";

interface Props {
  user: { email: string; name?: string; avatar?: string };
}

export default function AdminHeader({ user }: Props) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-16 border-b border-white/5 bg-white backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h2 className="text-black/60 font-semibold text-sm">Admin Dashboard</h2>
        <p className="text-slate-500 text-xs">Super Shop Management</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white hover:bg-white/5 w-9 h-9 rounded-xl relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all">
              <Avatar className="w-7 h-7">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-violet-500/20 text-violet-400 text-xs">
                  {user.name?.[0] ?? user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-black/60 text-xs font-medium leading-none">
                  {user.name ?? "Admin"}
                </p>
                <p className="text-slate-500 text-[10px] mt-0.5 truncate max-w-[120px]">
                  {user.email}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white border-white/10 text-black/60 w-44"
          >
            <DropdownMenuItem className="hover:bg-black/10 cursor-pointer">
              <User className="w-3.5 h-3.5 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="hover:bg-red-500/10 text-red-400 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
