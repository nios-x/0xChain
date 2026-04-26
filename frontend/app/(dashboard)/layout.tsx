"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // In production, enforce authentication.
    // In development, allow the dev bypass (no session required).
    if (process.env.NODE_ENV !== "development" && status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Show loading state while session is being determined
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">
            Authenticating…
          </span>
        </div>
      </div>
    );
  }

  // In production, don't render if unauthenticated (redirect happening)
  if (process.env.NODE_ENV !== "development" && status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[240px] relative">
        <TopNav />
        <div className="max-w-[1600px] mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
