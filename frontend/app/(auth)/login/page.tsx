"use client";

import { useEffect, useState } from "react";
import { PackageCheck, Truck, Plane } from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  // Restore previously selected role from localStorage
  
  useEffect(() => {
    const savedRole = localStorage.getItem("user_role");
    if (savedRole) setRole(savedRole);
  }, []);

  const getRedirectPath = (userRole: string) => {
    if (userRole === "driver") return "/driver";
    if (userRole === "customer") return "/customer";
    if (userRole === "supplier") return "/dashboard";
    return "/dashboard";
  };

  // If user is already authenticated AND has a role, go straight to the respective page
  useEffect(() => {
    if (status === "authenticated" && role) {
      router.replace(getRedirectPath(role));
    }
  }, [status, role, router]);

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    localStorage.setItem("user_role", selectedRole);
  };

  const handleContinue = () => {
    if (!role) return;
    router.push(getRedirectPath(role));
  };

  return (
    <>
      <main className="w-full max-w-[1000px] grid md:grid-cols-2 h-[70vh] mt-20 gap-px overflow-hidden shadow-[0px_24px_48px_rgba(0,0,0,0.5)] bg-surface-container rounded-[8px] mx-6">
        {/* Left Column: Branding */}
        <section className="hidden md:flex flex-col h-full justify-between p-18 bg-surface-container-high relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(29,185,84,0.3),transparent,transparent)]" />
          </div>
          <div className="relative z-10">
            <span className="text-white text-2xl font-black tracking-tighter">
              0xCHAIN
            </span>
            <div className="mt-10">
              <h2 className="text-white text-[32px] leading-tight font-bold tracking-tight mb-4">
                Secure the Node.<br />Sync the Terminal.
              </h2>
              <p className="text-on-surface-variant text-[14px] max-w-[280px] leading-relaxed">
                Access the high-performance command center. Your encrypted session starts here.
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-3 pt-10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white">
                System Status: Online
              </span>
            </div>
          </div>
        </section>

        {/* Right Column: Form */}
        <section className="bg-surface p-8 md:p-12 flex flex-col justify-center">
          <div className="md:hidden mb-8">
            <span className="text-white text-xl font-bold tracking-tighter">
              0xCHAIN
            </span>
          </div>

          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-white text-[22px] font-black tracking-tight uppercase">
                Initiate Session
              </h1>
              <p className="text-on-surface-variant text-[12px] mt-1">
                Sign in and select your role to continue
              </p>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant text-center">
                Select Your Role
              </p>

              <div className="grid grid-cols-1 gap-3">
                {/* Customer */}
                <button
                  id="role-customer"
                  onClick={() => handleRoleSelect("customer")}
                  className={`flex items-center gap-3 p-3 rounded-[10px] border transition-all ${role === "customer"
                      ? "border-primary bg-surface-container-highest"
                      : "border-text-dim hover:bg-surface-container-high"
                    }`}
                >
                  <PackageCheck size={18} className="text-primary" />
                  <span className="text-[12px] font-bold uppercase tracking-wide text-white">
                    Customer
                  </span>
                </button>

                {/* Driver */}
                <button
                  id="role-driver"
                  onClick={() => handleRoleSelect("driver")}
                  className={`flex items-center gap-3 p-3 rounded-[10px] border transition-all ${role === "driver"
                      ? "border-primary bg-surface-container-highest"
                      : "border-text-dim hover:bg-surface-container-high"
                    }`}
                >
                  <Truck size={18} className="text-primary" />
                  <span className="text-[12px] font-bold uppercase tracking-wide text-white">
                    Driver
                  </span>
                </button>

                {/* Supplier */}
                <button
                  id="role-supplier"
                  onClick={() => handleRoleSelect("supplier")}
                  className={`flex items-center gap-3 p-3 rounded-[10px] border transition-all ${role === "supplier"
                      ? "border-primary bg-surface-container-highest"
                      : "border-text-dim hover:bg-surface-container-high"
                    }`}
                >
                  <Plane size={18} className="text-primary" />
                  <span className="text-[12px] font-bold uppercase tracking-wide text-white">
                    Supplier
                  </span>
                </button>
              </div>
            </div>

            {/* Auth Buttons */}
            {status === "authenticated" ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-green-500 text-sm font-bold">
                  Signed in as {session?.user?.email}
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    id="btn-signout"
                    onClick={() => signOut({ redirect: false })}
                    className="flex-1 h-[40px] border border-text-dim flex items-center justify-center gap-2 rounded-[80px] hover:bg-surface-container-highest transition-colors"
                  >
                    <span className="text-white text-[11px] font-bold uppercase tracking-[0.1em]">
                      Sign Out
                    </span>
                  </button>
                  <button
                    id="btn-continue"
                    onClick={handleContinue}
                    disabled={!role}
                    className="flex-1 h-[40px] flex items-center justify-center gap-2 rounded-[80px] bg-primary hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed glow-primary"
                  >
                    <span className="text-white text-[11px] font-bold uppercase tracking-[0.1em]">
                      {role ? "Enter Terminal" : "Pick a Role"}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  id="btn-google-signin"
                  onClick={() => signIn("google")}
                  disabled={status === "loading"}
                  className="h-[44px] border border-text-dim flex items-center justify-center gap-2 rounded-[80px] hover:bg-surface-container-highest transition-colors disabled:opacity-50"
                >
                  {/* Google SVG icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                    <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z" />
                    <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z" />
                    <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
                  </svg>
                  <span className="text-white text-[11px] font-bold uppercase tracking-[0.1em]">
                    {status === "loading" ? "Connecting…" : "Sign in with Google"}
                  </span>
                </button>

                {/* Dev-only temporary bypass */}
                {process.env.NODE_ENV === "development" && (
                  <button
                    id="btn-temp-login"
                    onClick={() => {
                      // Simulate authenticated state in dev by setting a flag
                      // and redirecting directly – works only when backend OAuth is not set up
                      if (role) {
                        router.push(getRedirectPath(role));
                      } else {
                        alert("Select a role first");
                      }
                    }}
                    className="h-[36px] border border-dashed border-text-dim/40 flex items-center justify-center gap-2 rounded-[80px] hover:bg-surface-container-high transition-colors"
                  >
                    <span className="text-text-dim text-[10px] font-bold uppercase tracking-[0.1em]">
                      ⚠ Dev Bypass (no auth)
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full mt-12 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto w-full">
          <span className="text-primary font-black text-[10px] uppercase tracking-widest mb-4 md:mb-0">
            0xCHAIN
          </span>
          <div className="flex gap-8">
            <Link className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Terms of Service</Link>
            <Link className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Privacy Protocol</Link>
            <Link className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">System Status</Link>
          </div>
          <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mt-4 md:mt-0">
            © 2024 0xCHAIN TERMINAL
          </span>
        </div>
      </footer>
    </>
  );
}
