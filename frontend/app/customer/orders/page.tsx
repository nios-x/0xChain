"use client";

import { useState } from "react";
import { Package, Search, Filter, ChevronRight, MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import MetricCard from "../../components/MetricCard";

export default function MyOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const orders = [
    {
      id: "ORD-8821",
      status: "IN_TRANSIT",
      date: "Apr 26, 2026",
      items: 3,
      total: "$420.00",
      eta: "2 Hours",
      origin: "Hub Central B",
      destination: "Your Location",
    },
    {
      id: "ORD-8815",
      status: "DELIVERED",
      date: "Apr 22, 2026",
      items: 1,
      total: "$85.00",
      origin: "Hub-02",
      destination: "Your Location",
    },
    {
      id: "ORD-8809",
      status: "CANCELLED",
      date: "Apr 18, 2026",
      items: 5,
      total: "$1,240.00",
      origin: "Distribution Alpha",
      destination: "Your Location",
    },
  ];

  const filteredOrders = orders.filter(order => order.id.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">
            Transaction History
          </span>
          <h2 className="text-5xl font-extrabold tracking-tighter text-white">
            My Orders
          </h2>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
             <input 
               type="text" 
               placeholder="Search Protocol ID..."
               className="w-full bg-surface border border-white/5 rounded-full py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-primary transition-colors"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
          <button className="p-3 bg-surface border border-white/5 rounded-full text-white hover:bg-surface-elevated transition-colors">
             <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Active Protocol" value="01" subtitle="In Transit" icon="local_shipping" />
        <MetricCard title="Total Volume" value="124" trend="+34% MoM" trendDirection="up" icon="inventory" />
        <MetricCard title="Spend Sync" value="$4.2k" icon="payments" />
        <MetricCard title="Avg Lead Time" value="1.4d" icon="schedule" variant="info" />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order, i) => (
          <div key={i} className="bg-surface p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all group cursor-pointer">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
               <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                     order.status === 'IN_TRANSIT' ? 'bg-primary/10 text-primary' : 
                     order.status === 'DELIVERED' ? 'bg-info/10 text-info' : 'bg-error/10 text-error'
                  }`}>
                     <Package size={28} />
                  </div>
                  <div>
                     <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-white uppercase tracking-tight">{order.id}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                           order.status === 'IN_TRANSIT' ? 'bg-primary text-white glow-primary' : 
                           order.status === 'DELIVERED' ? 'bg-white/10 text-text-muted' : 'bg-error/20 text-error'
                        }`}>
                           {order.status.replace('_', ' ')}
                        </span>
                     </div>
                     <div className="flex items-center gap-4 mt-1">
                        <p className="text-[11px] font-bold text-text-dim uppercase tracking-widest">{order.date}</p>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <p className="text-[11px] font-bold text-text-dim uppercase tracking-widest">{order.items} Items • {order.total}</p>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-12 w-full md:w-auto">
                  <div className="hidden lg:block text-right">
                     <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1">In Transit From</p>
                     <p className="text-sm font-bold text-white uppercase">{order.origin}</p>
                  </div>
                  {order.status === 'IN_TRANSIT' && (
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 animate-pulse">Syncing ETA</p>
                        <p className="text-xl font-black text-white tabular-nums">{order.eta}</p>
                     </div>
                  )}
                  <ChevronRight className="text-text-dim group-hover:text-white transition-colors" />
               </div>
            </div>

            {/* Tracking Progress Sub-bar for active order */}
            {order.status === 'IN_TRANSIT' && (
              <div className="mt-8 pt-8 border-t border-white/5">
                 <div className="flex justify-between items-center relative">
                    <div className="absolute left-0 right-0 top-[11px] h-[2px] bg-white/5" />
                    <div className="absolute left-0 w-[65%] top-[11px] h-[2px] bg-primary glow-primary" />
                    
                    {[
                       { label: 'Confirmed', icon: CheckCircle2, status: 'complete' },
                       { label: 'Sorting', icon: CheckCircle2, status: 'complete' },
                       { label: 'In Transit', icon: Clock, status: 'active' },
                       { label: 'Delivered', icon: Package, status: 'pending' },
                    ].map((step, idx) => (
                       <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                             step.status === 'complete' ? 'bg-primary border-primary text-white' : 
                             step.status === 'active' ? 'bg-surface border-primary text-primary animate-pulse' : 
                             'bg-surface border-white/10 text-text-dim'
                          }`}>
                             <step.icon size={12} />
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${
                             step.status === 'pending' ? 'text-text-dim' : 'text-white'
                          }`}>{step.label}</span>
                       </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
