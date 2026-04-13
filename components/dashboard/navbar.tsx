"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { ThemeToggle } from "./theme-toggle";

export function Navbar({ user }: { user: any }) {
  return (
    <nav className="fixed  top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 rounded-full glass-effect flex items-center gap-6 shadow-xl shadow-black/5 animate-in fade-in slide-in-from-top duration-1000">
      <Link href="/dashboard" className="flex items-center gap-3">
        <span className="text-base font-bold tracking-tight text-foreground">
          DSA Tracker
        </span>
      </Link>

      <div className="h-4 w-px bg-black dark:bg-white" />

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <div className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-primary/10 hover:ring-primary/40 group relative cursor-pointer transition-all duration-500">
          <img
            alt="User"
            className="h-full w-full object-cover"
            src={user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"}
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={() => signOut()}
              className="text-white hover:scale-110 transition-transform"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
