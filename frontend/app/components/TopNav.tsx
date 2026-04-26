"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

interface TopNavProps {
  title?: string;
  searchPlaceholder?: string;
}

export default function TopNav({
  title = "COMMAND CENTER",
  searchPlaceholder = "SEARCH FLEET ID...",
}: TopNavProps) {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center px-8 w-full h-16 sticky top-0 z-40 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-8">
        <span className="text-lg font-black text-white uppercase tracking-widest">
          {title}
        </span>
        <div className="relative group hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-dim text-lg">
            search
          </span>
          <input
            id="topnav-search"
            className="bg-surface-container-highest/50 border-none rounded-full pl-10 pr-4 py-1.5 text-[11px] font-bold tracking-widest w-64 focus:ring-1 focus:ring-primary transition-all text-white placeholder:text-text-dim"
            placeholder={searchPlaceholder}
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Live backend status dot */}
        <div className="flex items-center gap-2 hidden md:flex">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-dim">
            Live
          </span>
        </div>

        <button
          id="topnav-notifications"
          className="material-symbols-outlined text-text-dim hover:text-white transition-all"
        >
          notifications_active
        </button>
        <button
          id="topnav-help"
          className="material-symbols-outlined text-text-dim hover:text-white transition-all"
        >
          help_center
        </button>

        {/* User avatar in top nav */}
        {session?.user && (
          <div className="w-8 h-8 rounded-full bg-surface-elevated overflow-hidden ring-1 ring-primary/20 flex-shrink-0 flex items-center justify-center">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "User"}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-text-muted text-base">
                person
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
