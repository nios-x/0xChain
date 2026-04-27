"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Operations" },
  { href: "/shipments", icon: "inventory_2", label: "Shipments" },
  { href: "/tracking", icon: "map", label: "Fleet Map" },
  { href: "/routes", icon: "route", label: "Optimization" },
  { href: "/analytics", icon: "monitoring", label: "Analytics" },
  { href: "/supplier", icon: "factory", label: "Suppliers" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const userName = session?.user?.name ?? "Operator";
  const userEmail = session?.user?.email ?? "";
  const userImage = session?.user?.image ?? null;

  // Derive a short display label from role stored in localStorage
  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("user_role") ?? "Agent"
      : "Agent";

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
              className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all duration-200 ${isActive
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

      {/* User Profile + Sign Out */}
      <div className="mt-auto px-4 pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-surface-elevated overflow-hidden ring-2 ring-primary/20 flex-shrink-0 flex items-center justify-center">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-text-muted text-lg">
                person
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white uppercase truncate">
              {userName}
            </p>
            <p className="text-[10px] text-text-dim font-bold uppercase truncate">
              {userEmail || role}
            </p>
          </div>
        </div>

        {/* Sign-out button */}
        {session && (
          <button
            id="sidebar-signout"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-text-dim hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.1em]">
              Sign Out
            </span>
          </button>
        )}
      </div>
    </aside>
  );
}
