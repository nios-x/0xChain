"use client";

import { useEffect, useState } from "react";
import { PackageCheck, Truck, Plane } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [role, setRole] = useState<string | null>(null);

const handleRoleSelect = (selectedRole: string) => {
  setRole(selectedRole);
  localStorage.setItem("user_role", selectedRole);
};
useEffect(() => {
  const savedRole = localStorage.getItem("user_role");
  if (savedRole) setRole(savedRole);
}, []);
  return (
    <>
      <main className="w-full max-w-[1000px] grid md:grid-cols-2 h-[60vh] mt-20 gap-px overflow-hidden shadow-[0px_24px_48px_rgba(0,0,0,0.5)] bg-surface-container rounded-[8px] mx-6">
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
          <div className="relative z-10 flex  items-center gap-3 pt-10">
            <div className="w-2 h-2 rounded-full  bg-primary animate-pulse" />
            <span className="text-[11px] font-bold  uppercase tracking-[0.1em] text-white">
              System Status: Online
            </span>
          </div>
          </div>
        </section>

        {/* Right Column: Form */}
        <section className="bg-surface p-8 md:p-12">
          <div className="md:hidden mb-8">
            <span className="text-white text-xl font-bold tracking-tighter">
              0xCHAIN
            </span>
          </div>
          <div className="space-y-8">
            {/* Auth Tabs */}
            <div className="flex gap-8 mb-8 justify-center">
              <button
                onClick={() => setActiveTab("login")}
                className={`text-[14px] font-bold pb-2 w-1/2 text-center uppercase tracking-[0.1em] transition-colors ${
                  activeTab === "login"
                    ? "text-white border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-white"
                }`}
              >
                Login
              </button>
            </div>

                {/* Role Selection */}
<div className="space-y-3">
  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant text-center">
    Select Your Role
  </p>

  <div className="grid grid-cols-1 gap-3">
    
    {/* Receiver */}
    <button
      onClick={() => handleRoleSelect("receiver")}
      className={`flex items-center gap-3 p-3 rounded-[10px] border transition-all ${
        role === "receiver"
          ? "border-primary bg-surface-container-highest"
          : "border-text-dim hover:bg-surface-container-high"
      }`}
    >
      <PackageCheck size={18} className="text-primary" />
      <span className="text-[12px] font-bold uppercase tracking-wide text-white">
        Receiver (Gets Delivery)
      </span>
    </button>

    {/* Delivery Person */}
    <button
      onClick={() => handleRoleSelect("delivery")}
      className={`flex items-center gap-3 p-3 rounded-[10px] border transition-all ${
        role === "delivery"
          ? "border-primary bg-surface-container-highest"
          : "border-text-dim hover:bg-surface-container-high"
      }`}
    >
      <Truck size={18} className="text-primary" />
      <span className="text-[12px] font-bold uppercase tracking-wide text-white">
        Delivery Agent (Brings Package)
      </span>
    </button>

    {/* Transport Driver */}
    <button
      onClick={() => handleRoleSelect("driver")}
      className={`flex items-center gap-3 p-3 rounded-[10px] border transition-all ${
        role === "driver"
          ? "border-primary bg-surface-container-highest"
          : "border-text-dim hover:bg-surface-container-high"
      }`}
    >
      <Plane size={18} className="text-primary" />
      <span className="text-[12px] font-bold uppercase tracking-wide text-white">
        Transport Driver (Air / Sea / Rail / Road)
      </span>
    </button>

  </div>
</div>

            {/* Social Auth */}
            <div className=" gap-4 flex flex-col">
              <button onClick={() => signIn("google")} className="h-[40px] border  border-text-dim flex items-center justify-center gap-2 rounded-[80px] hover:bg-surface-container-highest transition-colors">
                <span className="text-white text-[11px] font-bold uppercase tracking-[0.1em]">
                  Sign in with Google
                </span>

              </button>
              <div className="text-center font-bold text-sm">
                <input type="button" className="text-green-600" value={"Temprory Login"}/>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.1em] pt-4">
              {activeTab === "login" ? (
                <>New operative? <button className="text-primary hover:underline">Establish Account</button></>
              ) : (
                <>Already registered? <button  className="text-primary hover:underline">Initiate Session</button></>
              )}
            </p>
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
            <Link className=" text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors " href="#">System Status</Link>
          </div>
          <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mt-4 md:mt-0">
            © 2024 0xCHAIN TERMINAL
          </span>
        </div>
      </footer>
    </>
  );
}
