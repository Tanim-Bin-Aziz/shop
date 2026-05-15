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
    toast.success("লগআউট সফল");
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h2 className="text-white font-semibold text-sm">Admin Dashboard</h2>
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
                <p className="text-white text-xs font-medium leading-none">
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
            className="bg-slate-800 border-white/10 text-slate-300 w-44"
          >
            <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
              <User className="w-3.5 h-3.5 mr-2" /> প্রোফাইল
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="hover:bg-red-500/10 text-red-400 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" /> লগআউট
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
