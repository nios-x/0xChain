"use client";

interface TopNavProps {
  title?: string;
  searchPlaceholder?: string;
}

export default function TopNav({
  title = "COMMAND CENTER",
  searchPlaceholder = "SEARCH FLEET ID...",
}: TopNavProps) {
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
            className="bg-surface-container-highest/50 border-none rounded-full pl-10 pr-4 py-1.5 text-[11px] font-bold tracking-widest w-64 focus:ring-1 focus:ring-primary transition-all text-white placeholder:text-text-dim"
            placeholder={searchPlaceholder}
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-text-dim hover:text-white transition-all">
          notifications_active
        </button>
        <button className="material-symbols-outlined text-text-dim hover:text-white transition-all">
          help_center
        </button>
      </div>
    </header>
  );
}
