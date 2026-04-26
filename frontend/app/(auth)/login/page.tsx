"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <>
      <main className="w-full max-w-[900px] grid md:grid-cols-2 gap-px overflow-hidden shadow-[0px_24px_48px_rgba(0,0,0,0.5)] bg-surface-container rounded-[8px] mx-6">
        {/* Left Column: Branding */}
        <section className="hidden md:flex flex-col justify-between p-12 bg-surface-container-high relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(29,185,84,0.3),transparent,transparent)]" />
          </div>
          <div className="relative z-10">
            <span className="text-white text-2xl font-black tracking-tighter">
              LOGICHAIN
            </span>
            <div className="mt-20">
              <h2 className="text-white text-[32px] leading-tight font-bold tracking-tight mb-4">
                Secure the Node.<br />Sync the Terminal.
              </h2>
              <p className="text-on-surface-variant text-[14px] max-w-[280px] leading-relaxed">
                Access the high-performance command center. Your encrypted session starts here.
              </p>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white">
              System Status: Online
            </span>
          </div>
        </section>

        {/* Right Column: Form */}
        <section className="bg-surface p-8 md:p-12">
          <div className="md:hidden mb-8">
            <span className="text-white text-xl font-bold tracking-tighter">
              LOGICHAIN
            </span>
          </div>
          <div className="space-y-8">
            {/* Auth Tabs */}
            <div className="flex gap-8 mb-8">
              <button
                onClick={() => setActiveTab("login")}
                className={`text-[14px] font-bold pb-2 uppercase tracking-[0.1em] transition-colors ${
                  activeTab === "login"
                    ? "text-white border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`text-[14px] font-bold pb-2 uppercase tracking-[0.1em] transition-colors ${
                  activeTab === "register"
                    ? "text-white border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            {/* Login Form */}
            {activeTab === "login" && (
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-white text-[11px] font-bold uppercase tracking-[0.1em]">
                      Identity
                    </label>
                    <input
                      className="w-full h-[40px] bg-surface-elevated border-none rounded-[4px] px-4 text-white text-[14px] placeholder-text-secondary transition-all focus:border-white"
                      placeholder="name@domain.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-white text-[11px] font-bold uppercase tracking-[0.1em]">
                        Encryption Key
                      </label>
                      <a
                        className="text-[11px] font-bold text-primary uppercase tracking-[0.1em] hover:underline"
                        href="#"
                      >
                        Reset
                      </a>
                    </div>
                    <input
                      className="w-full h-[40px] bg-surface-elevated border-none rounded-[4px] px-4 text-white text-[14px] placeholder-text-secondary transition-all focus:border-white"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                </div>
                <button className="w-full h-[48px] bg-primary rounded-full text-white text-[14px] font-bold uppercase tracking-[0.1em] hover:bg-primary-hover hover:scale-[1.04] transition-all duration-300">
                  Initiate Session
                </button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-white text-[11px] font-bold uppercase tracking-[0.1em]">
                      Full Name
                    </label>
                    <input
                      className="w-full h-[40px] bg-surface-elevated border-none rounded-[4px] px-4 text-white text-[14px] placeholder-text-secondary transition-all focus:border-white"
                      placeholder="John Doe"
                      type="text"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-white text-[11px] font-bold uppercase tracking-[0.1em]">
                      Identity
                    </label>
                    <input
                      className="w-full h-[40px] bg-surface-elevated border-none rounded-[4px] px-4 text-white text-[14px] placeholder-text-secondary transition-all focus:border-white"
                      placeholder="name@domain.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-white text-[11px] font-bold uppercase tracking-[0.1em]">
                      Encryption Key
                    </label>
                    <input
                      className="w-full h-[40px] bg-surface-elevated border-none rounded-[4px] px-4 text-white text-[14px] placeholder-text-secondary transition-all focus:border-white"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-white text-[11px] font-bold uppercase tracking-[0.1em]">
                      Confirm Key
                    </label>
                    <input
                      className="w-full h-[40px] bg-surface-elevated border-none rounded-[4px] px-4 text-white text-[14px] placeholder-text-secondary transition-all focus:border-white"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                </div>
                <button className="w-full h-[48px] bg-primary rounded-full text-white text-[14px] font-bold uppercase tracking-[0.1em] hover:bg-primary-hover hover:scale-[1.04] transition-all duration-300">
                  Create Account
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative py-4 flex items-center justify-center">
              <div className="w-full h-[1px] bg-border-subtle/30" />
              <span className="absolute px-4 bg-surface text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">
                Neural Gateways
              </span>
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-4">
              <button className="h-[40px] border border-text-dim flex items-center justify-center gap-2 rounded-[8px] hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-white text-lg">mail</span>
                <span className="text-white text-[11px] font-bold uppercase tracking-[0.1em]">
                  Google
                </span>
              </button>
              <button className="h-[40px] border border-text-dim flex items-center justify-center gap-2 rounded-[8px] hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-white text-lg">terminal</span>
                <span className="text-white text-[11px] font-bold uppercase tracking-[0.1em]">
                  GitHub
                </span>
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.1em] pt-4">
              {activeTab === "login" ? (
                <>New operative? <button onClick={() => setActiveTab("register")} className="text-primary hover:underline">Establish Account</button></>
              ) : (
                <>Already registered? <button onClick={() => setActiveTab("login")} className="text-primary hover:underline">Initiate Session</button></>
              )}
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full mt-12 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto w-full">
          <span className="text-primary font-black text-[10px] uppercase tracking-widest mb-4 md:mb-0">
            LOGICHAIN
          </span>
          <div className="flex gap-8">
            <Link className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Terms of Service</Link>
            <Link className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Privacy Protocol</Link>
            <Link className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">System Status</Link>
          </div>
          <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mt-4 md:mt-0">
            © 2024 LOGICHAIN TERMINAL
          </span>
        </div>
      </footer>
    </>
  );
}
