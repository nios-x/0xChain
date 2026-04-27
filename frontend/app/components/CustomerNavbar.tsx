"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function CustomerNavbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/customer" },
    { name: "My Orders", href: "/customer/orders" },
    { name: "Support", href: "/customer/support" },
  ];

  return (
    <header className="flex justify-between items-center px-8 w-full h-16 sticky top-0 z-40 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-8">
        <Link href="/customer">
          <span className="text-xl font-black text-primary uppercase tracking-widest">
            0xCHAIN <span className="text-white">Customer</span>
          </span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  isActive ? "text-primary" : "text-text-dim hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-text-dim hover:text-white transition-all">
          shopping_cart
        </button>
        <button className="material-symbols-outlined text-text-dim hover:text-white transition-all">
          notifications
        </button>

        {session?.user ? (
          <div className="flex items-center gap-4 ml-4">
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
            <button
              onClick={handleSignOut}
              className="text-[10px] font-bold uppercase tracking-widest text-text-dim hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-surface-elevated overflow-hidden ring-1 ring-primary/20 flex-shrink-0 flex items-center justify-center ml-4">
             <span className="material-symbols-outlined text-text-muted text-base">
                person
             </span>
          </div>
        )}
      </div>
    </header>
  );
}
