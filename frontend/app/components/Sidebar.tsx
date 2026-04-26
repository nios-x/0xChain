"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Operations" },
  { href: "/shipments", icon: "inventory_2", label: "Shipments" },
  { href: "/tracking", icon: "map", label: "Fleet Map" },
  { href: "/routes", icon: "route", label: "Optimization" },
  { href: "/analytics", icon: "monitoring", label: "Analytics" },
  { href: "/driver", icon: "person", label: "Driver Hub" },
  { href: "/supplier", icon: "factory", label: "Suppliers" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col fixed left-0 top-0 h-full py-6 px-4 w-[240px] bg-void border-r border-white/5 z-50">
      {/* Brand */}
      <div className="mb-10 px-4">
        <h1 className="text-xl font-black tracking-tighter text-primary uppercase">
          0xCHAIN
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-dim font-bold">
          Kinetic Terminal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all duration-200 ${
                isActive
                  ? "text-primary font-bold bg-white/5"
                  : "text-text-dim hover:text-text-secondary hover:bg-white/5"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span className="text-[14px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto px-4 pt-6 border-t border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-elevated overflow-hidden ring-2 ring-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-text-muted text-lg">
            person
          </span>
        </div>
        <div>
          <p className="text-xs font-bold text-white uppercase">Operator-04</p>
          <p className="text-[10px] text-text-dim font-bold uppercase">
            Sector Alpha
          </p>
        </div>
      </div>
    </aside>
  );
}
