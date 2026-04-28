"use client";

import { Calendar, Clock, MapPin, Coffee, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import MetricCard from "../../components/MetricCard";

export default function DriverSchedulePage() {
   const weekDays = [
      { day: "Mon", date: "24", status: "off" },
      { day: "Tue", date: "25", status: "completed" },
      { day: "Wed", date: "26", status: "active" },
      { day: "Thu", date: "27", status: "upcoming" },
      { day: "Fri", date: "28", status: "upcoming" },
      { day: "Sat", date: "29", status: "off" },
      { day: "Sun", date: "30", status: "off" },
   ];

   return (
      <div className="space-y-8">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
               <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">
                  Roster Sync ID: WS-2991
               </span>
               <h2 className="text-5xl font-extrabold tracking-tighter text-white">
                  Duty Roster
               </h2>
            </div>
            <div className="flex gap-4 items-center bg-surface p-2 rounded-full border border-white/5">
               <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-dim hover:text-white">
                  <ChevronLeft size={20} />
               </button>
               <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white px-4">April 24 - 30, 2026</span>
               <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-dim hover:text-white">
                  <ChevronRight size={20} />
               </button>
            </div>
         </div>

         {/* Roster Metrics */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Driving Hours" value="32.5h" subtitle="Weekly Total" icon="timer" />
            <MetricCard title="Rest Compliance" value="100%" trend="Optimal" trendDirection="up" icon="verified_user" />
            <MetricCard title="Remaining Shift" value="4h 12m" icon="hourglass_empty" />
            <MetricCard title="Upcoming Leave" value="May 02" subtitle="Spring Break" variant="info" icon="beach_access" />
         </div>

         <div className="grid grid-cols-12 gap-8">
            {/* Weekly Calendar Strip */}
            <div className="col-span-12">
               <div className="bg-surface rounded-xl border border-white/5 p-8">
                  <div className="grid grid-cols-7 gap-4">
                     {weekDays.map((d, i) => (
                        <div key={i} className={`flex flex-col items-center p-6 rounded-xl border transition-all cursor-pointer ${d.status === 'active' ? 'bg-primary/10 border-primary/40' :
                              d.status === 'off' ? 'bg-black/20 border-white/5 opacity-50' :
                                 'bg-white/5 border-white/5 hover:bg-white/10'
                           }`}>
                           <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${d.status === 'active' ? 'text-primary' : 'text-text-dim'}`}>{d.day}</span>
                           <span className={`text-3xl font-black ${d.status === 'active' ? 'text-white' : 'text-text-secondary'}`}>{d.date}</span>
                           <div className={`mt-4 w-1.5 h-1.5 rounded-full ${d.status === 'active' ? 'bg-primary glow-primary animate-pulse' :
                                 d.status === 'completed' ? 'bg-text-dim' :
                                    d.status === 'upcoming' ? 'bg-info' : 'transparent'
                              }`} />
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Detailed Shift View (8 cols) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
               <div className="bg-surface rounded-xl border border-white/5 p-8">
                  <div className="flex justify-between items-center mb-10">
                     <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">Active Shift Details</h3>
                     <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">In Progress</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-8">
                        <div className="flex items-start gap-4">
                           <div className="p-3 rounded-lg bg-white/5 text-primary">
                              <Clock size={20} />
                           </div>
                           <div>
                              <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1">Time Distribution</p>
                              <p className="text-lg font-bold text-white mb-1">06:00 AM - 15:00 PM</p>
                              <p className="text-[11px] text-text-muted">Total allocated: 9h (inc. breaks)</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4">
                           <div className="p-3 rounded-lg bg-white/5 text-info">
                              <MapPin size={20} />
                           </div>
                           <div>
                              <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1">Primary Node</p>
                              <p className="text-lg font-bold text-white mb-1">Hub Central - Cluster B</p>
                              <p className="text-[11px] text-text-muted">Gate 14 Deployment</p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="flex items-start gap-4">
                           <div className="p-3 rounded-lg bg-white/5 text-warning">
                              <Coffee size={20} />
                           </div>
                           <div>
                              <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1">Mandatory Breaks</p>
                              <p className="text-lg font-bold text-white mb-1">09:00 (15m) • 12:30 (45m)</p>
                              <div className="flex gap-2 mt-2">
                                 <span className="px-2 py-0.5 bg-success/20 text-success text-[9px] font-bold uppercase rounded">Taken</span>
                                 <span className="px-2 py-0.5 bg-white/10 text-text-muted text-[9px] font-bold uppercase rounded">Pending</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-start gap-4">
                           <div className="p-3 rounded-lg bg-white/5 text-white">
                              <ShieldCheck size={20} />
                           </div>
                           <div>
                              <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1">Assigned Support</p>
                              <p className="text-lg font-bold text-white mb-1">Dispatcher Alpha-X</p>
                              <p className="text-[11px] text-text-muted font-mono">Terminal Sync: ACTIVE</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Upcoming Shifts */}
               <div className="bg-surface rounded-xl border border-white/5 p-8">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-6">Queue Analysis (Next 48h)</h3>
                  <div className="space-y-4">
                     {[
                        { day: "Thursday, Apr 27", time: "05:00 - 14:00", route: "Express Loop A", vehicle: "TRK-401" },
                        { day: "Friday, Apr 28", time: "06:30 - 15:30", route: "Metro Heavy Load", vehicle: "TRK-401" },
                     ].map((shift, i) => (
                        <div key={i} className="group p-6 border border-white/5 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex flex-col md:flex-row justify-between md:items-center gap-6">
                           <div className="flex items-center gap-6">
                              <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center text-text-dim group-hover:text-primary transition-colors">
                                 <Calendar size={18} />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-white uppercase tracking-tight">{shift.day}</p>
                                 <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{shift.time}</span>
                                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{shift.route}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-8">
                              <div className="text-right">
                                 <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1">Assigned Assets</p>
                                 <p className="text-sm font-bold text-white mb-1">{shift.vehicle}</p>
                              </div>
                              <button className="material-symbols-outlined text-text-dim hover:text-white transition-colors">info</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Requirements & Compliance (4 cols) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
               <div className="bg-surface p-8 rounded-xl border border-white/5">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-8">Compliance Monitor</h3>
                  <div className="space-y-8">
                     <div>
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Weekly Drive Time</span>
                           <span className="text-sm font-black text-white">32.5 / 60h</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '54%' }} />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Fortnightly Cycle</span>
                           <span className="text-sm font-black text-white">74 / 120h</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '61%' }} />
                        </div>
                     </div>

                     <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 text-primary mb-4">
                           <ShieldCheck size={18} />
                           <span className="text-[11px] font-bold uppercase tracking-[0.1em]">Regulation Status: COMPLIANT</span>
                        </div>
                        <p className="text-[11px] text-text-dim leading-relaxed">
                           Your shift patterns for the current cycle are within standard logistics safety protocols. Next mandatory reset starts in 48h.
                        </p>
                     </div>

                     <button className="w-full py-4 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                        Request Shift Swap
                     </button>
                  </div>
               </div>

               <div className="bg-gradient-to-br from-surface to-surface-elevated p-8 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">Shift Notifications</h3>
                     <span className="flex h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="space-y-4">
                     <div className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-info mt-1.5 shrink-0" />
                        <div>
                           <p className="text-[11px] text-white font-bold mb-1">Route Update: DEL-9920</p>
                           <p className="text-[10px] text-text-dim">Re-sorted priority list for your 06:30 shift tomorrow.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 shrink-0" />
                        <div>
                           <p className="text-[11px] text-text-dim font-bold mb-1">System Maintenance</p>
                           <p className="text-[10px] text-text-dim">Terminal will be offline for sync from 02:00 - 03:00.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
