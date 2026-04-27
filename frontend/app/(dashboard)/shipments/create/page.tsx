"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Box, Calendar, MapPin, Truck, ShieldAlert, Send } from "lucide-react";

export default function CreateShipmentPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API submission
    setTimeout(() => {
      setLoading(false);
      // Let's assume a redirect or a success message here in a real app
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/shipments" 
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-text-dim hover:text-white transition-colors w-fit"
        >
          <ArrowLeft size={14} />
          Back to Inventory
        </Link>
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">
            New Protocol Initialization
          </span>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white">
            Create Shipment
          </h2>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-white/5 p-8 relative overflow-hidden">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Box size={300} />
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
          
          {/* Section: Routing Parameters */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
              <MapPin size={18} className="text-primary" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                Routing Parameters
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-4">
                  Origin Node
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Hub Central Base"
                  className="w-full bg-surface-elevated border border-white/5 rounded-full py-4 px-6 text-white text-sm outline-none focus:border-primary transition-colors placeholder:text-text-dim"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-4">
                  Destination Node
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Sector 7 Distribution"
                  className="w-full bg-surface-elevated border border-white/5 rounded-full py-4 px-6 text-white text-sm outline-none focus:border-primary transition-colors placeholder:text-text-dim"
                />
              </div>
            </div>
          </div>

          {/* Section: Cargo Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
              <Box size={18} className="text-primary" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                Cargo Specifications
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-4">
                  Weight (KG)
                </label>
                <input 
                  required
                  type="number" 
                  placeholder="0.00"
                  className="w-full bg-surface-elevated border border-white/5 rounded-full py-4 px-6 text-white text-sm outline-none focus:border-primary transition-colors placeholder:text-text-dim tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-4">
                  Volume (m³)
                </label>
                <input 
                  required
                  type="number" 
                  placeholder="0.00"
                  className="w-full bg-surface-elevated border border-white/5 rounded-full py-4 px-6 text-white text-sm outline-none focus:border-primary transition-colors placeholder:text-text-dim tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-4">
                  Cargo Type
                </label>
                <select className="w-full bg-surface-elevated border border-white/5 rounded-full py-4 px-6 text-white text-sm outline-none focus:border-primary transition-colors appearance-none">
                  <option>Standard Freight</option>
                  <option>Perishable Goods</option>
                  <option>Hazardous Materials (Hazmat)</option>
                  <option>Fragile Items</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Operations */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
              <Truck size={18} className="text-primary" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                Operational Requirements
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-4">
                  Priority Class
                </label>
                <div className="relative">
                  <ShieldAlert className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <select className="w-full bg-surface-elevated border border-white/5 rounded-full py-4 pl-12 pr-6 text-white text-sm outline-none focus:border-primary transition-colors appearance-none">
                    <option>Standard (SLA 3 Days)</option>
                    <option>Express (SLA 24 Hours)</option>
                    <option>Priority (Same Day Sync)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-4">
                  Scheduled Dispatch Vector
                </label>
                <div className="relative">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input 
                    type="date" 
                    className="w-full bg-surface-elevated border border-white/5 rounded-full py-4 pl-12 pr-6 text-white text-sm outline-none focus:border-primary transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-4">
                Special Directives (Notes)
              </label>
              <textarea 
                rows={4}
                placeholder="Any specific handling instructions or facility codes..."
                className="w-full bg-surface-elevated border border-white/5 rounded-[20px] py-4 px-6 text-white text-sm outline-none focus:border-primary transition-colors resize-none placeholder:text-text-dim"
              ></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex gap-4 justify-end">
            <Link 
              href="/shipments"
              className="px-8 py-4 border border-white/10 bg-white/5 rounded-full text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Abort
            </Link>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-10 py-4 bg-primary text-white font-black text-[11px] uppercase tracking-widest rounded-full hover:brightness-110 transition-all glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Protocol...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Initialize Dispatch
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
