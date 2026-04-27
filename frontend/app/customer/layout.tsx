"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CustomerNavbar from "../components/CustomerNavbar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" && status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

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

  if (process.env.NODE_ENV !== "development" && status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CustomerNavbar />
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-8 py-10">
        {children}
      </main>
    </div>
  );
}
