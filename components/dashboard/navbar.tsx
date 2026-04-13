"use client";

import { Search, Bell, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "@/app/login/actions";

export function Navbar({ user }: { user: any }) {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-fit px-2 flex rounded-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(37,99,235,0.2)]">
      <div className="flex items-center gap-6 px-4 py-2">
        <Link
          href="/dashboard"
          className="text-lg font-black tracking-tighter text-blue-700 dark:text-blue-400 hover:scale-105 transition-transform"
        >
          DSA Tracker
        </Link>

        <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-blue-500/20 hover:ring-blue-500/40 group relative cursor-pointer transition-all">
            <img
              alt="User profile avatar"
              className="h-full w-full object-cover"
              src={
                user?.user_metadata?.avatar_url ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
              }
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
      </div>
    </nav>
  );
}
