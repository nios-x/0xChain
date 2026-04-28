"use client";

import { useEffect, useState } from "react";
import {
   Package,
   Search,
   Filter,
   ChevronRight,
   Clock,
   CheckCircle2,
} from "lucide-react";
import MetricCard from "../../components/MetricCard";

type Order = {
   id: string;
   status: string;
   created_at: string;
   weight_kg?: number;
   estimated_delivery?: string | null;
   source: string;
   destination: string;
};

export default function MyOrdersPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [orders, setOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(true);

   // 🔥 Fetch from your API
   useEffect(() => {
      const fetchOrders = async () => {
         try {
            const res = await fetch("/api/shipments");
            const data = await res.json();
            setOrders(data.shipments || []);
         } catch (err) {
            console.error("Failed to fetch orders", err);
         } finally {
            setLoading(false);
         }
      };

      fetchOrders();
   }, []);

   // 🔎 Search
   const filteredOrders = orders.filter((order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
   );

   // 📊 Metrics (derived)
   const active = orders.filter((o) => o.status === "in_transit").length;
   const delivered = orders.filter((o) => o.status === "delivered").length;

   if (loading) {
      return <div className="text-white p-10">Loading orders...</div>;
   }

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
                  <Search
                     className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim"
                     size={16}
                  />
                  <input
                     type="text"
                     placeholder="Search Order ID..."
                     className="w-full bg-surface border border-white/5 rounded-full py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-primary"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>

               <button className="p-3 bg-surface border border-white/5 rounded-full text-white">
                  <Filter size={20} />
               </button>
            </div>
         </div>

         {/* Metrics */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
               title="Active Orders"
               value={`${active}`}
               subtitle="In Transit"
               icon="local_shipping"
            />
            <MetricCard
               title="Total Orders"
               value={`${orders.length}`}
               icon="inventory"
            />
            <MetricCard
               title="Delivered"
               value={`${delivered}`}
               icon="check_box"
            />
            <MetricCard
               title="Avg Lead Time"
               value="~1-3d"
               icon="schedule"
               variant="info"
            />
         </div>

         {/* Orders */}
         <div className="space-y-4">
            {filteredOrders.map((order, i) => {
               const isTransit = order.status === "in_transit";
               const isDelivered = order.status === "delivered";

               return (
                  <div
                     key={i}
                     className="bg-surface p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all group cursor-pointer"
                  >
                     <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                        <div className="flex items-center gap-6">
                           {/* Icon */}
                           <div
                              className={`w-14 h-14 rounded-xl flex items-center justify-center ${isTransit
                                    ? "bg-primary/10 text-primary"
                                    : isDelivered
                                       ? "bg-info/10 text-info"
                                       : "bg-error/10 text-error"
                                 }`}
                           >
                              <Package size={28} />
                           </div>

                           {/* Info */}
                           <div>
                              <div className="flex items-center gap-3">
                                 <span className="text-lg font-black text-white uppercase">
                                    {order.id.slice(0, 8)}
                                 </span>

                                 <span
                                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${isTransit
                                          ? "bg-primary text-white"
                                          : isDelivered
                                             ? "bg-white/10 text-text-muted"
                                             : "bg-error/20 text-error"
                                       }`}
                                 >
                                    {order.status.replace("_", " ")}
                                 </span>
                              </div>

                              <p className="text-[11px] text-text-dim mt-1">
                                 {new Date(order.created_at).toDateString()}
                              </p>
                           </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-12">
                           <div className="hidden lg:block text-right">
                              <p className="text-[10px] text-text-dim uppercase">
                                 From
                              </p>
                              <p className="text-sm text-white">{order.source}</p>
                           </div>

                           {isTransit && (
                              <div className="text-right">
                                 <p className="text-[10px] text-primary uppercase animate-pulse">
                                    ETA
                                 </p>
                                 <p className="text-xl font-black text-white">
                                    {order.estimated_delivery
                                       ? new Date(
                                          order.estimated_delivery
                                       ).toLocaleTimeString()
                                       : "--"}
                                 </p>
                              </div>
                           )}

                           <ChevronRight className="text-text-dim group-hover:text-white" />
                        </div>
                     </div>

                     {/* Progress */}
                     {isTransit && (
                        <div className="mt-8 pt-8 border-t border-white/5">
                           <div className="flex justify-between items-center relative">
                              <div className="absolute left-0 right-0 top-[11px] h-[2px] bg-white/5" />
                              <div className="absolute left-0 w-[65%] top-[11px] h-[2px] bg-primary" />

                              {["Confirmed", "Sorting", "Transit", "Delivered"].map(
                                 (label, idx) => (
                                    <div
                                       key={idx}
                                       className="relative z-10 flex flex-col items-center"
                                    >
                                       <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                                          <CheckCircle2 size={12} />
                                       </div>
                                       <span className="text-[9px] text-white">
                                          {label}
                                       </span>
                                    </div>
                                 )
                              )}
                           </div>
                        </div>
                     )}
                  </div>
               );
            })}
         </div>
      </div>
   );
}