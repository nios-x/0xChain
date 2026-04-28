"use client";

import { useState } from "react";
import {
   MessageSquare,
   Phone,
   Mail,
   HelpCircle,
   ShieldAlert,
   Send,
   Search,
   ChevronRight,
   FileQuestion,
} from "lucide-react";
import MetricCard from "../../components/MetricCard";

export default function SupportPage() {
   const [loading, setLoading] = useState(false);
   const [success, setSuccess] = useState("");
   const [error, setError] = useState("");

   const [form, setForm] = useState({
      category: "Shipment Sync Issue",
      orderId: "",
      message: "",
   });

   const faqs = [
      {
         q: "How do I redirect a sync in progress?",
         a: "Access the order node and select 'Route Diversion' within the first 30 minutes of transit.",
      },
      {
         q: "What is the 0xCHAIN latency protocol?",
         a: "Our proprietary sync ensures sub-10ms tracking updates.",
      },
      {
         q: "Lost encrypted key for delivery?",
         a: "Contact your local Hub administrator with verification.",
      },
   ];

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      setLoading(true);
      setError("");
      setSuccess("");

      try {
         const res = await fetch("/api/support", {
            method: "POST",
            body: JSON.stringify(form),
         });

         if (!res.ok) throw new Error("Failed");

         setSuccess("Ticket submitted successfully 🚀");
         setForm({
            category: "Shipment Sync Issue",
            orderId: "",
            message: "",
         });
      } catch (err) {
         setError("Failed to submit ticket");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="space-y-8">
         {/* HEADER */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
               <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">
                  Resolution Center: ONLINE
               </span>
               <h2 className="text-5xl font-extrabold text-white">
                  Help Terminal
               </h2>
            </div>

            <button className="rounded-full bg-primary px-8 py-3 text-white font-bold text-[11px] uppercase">
               Submit Ticket
            </button>
         </div>

         {/* METRICS */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Avg Response" value="4m" icon="timer" />
            <MetricCard title="Resolution Rate" value="99%" icon="verified_user" />
            <MetricCard title="Active Tickets" value="--" icon="confirmation_number" />
            <MetricCard title="System Health" value="100%" icon="security" />
         </div>

         <div className="grid grid-cols-12 gap-8">
            {/* FORM */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
               <div className="bg-surface p-8 rounded-xl border border-white/5">
                  <h3 className="text-[11px] text-text-dim mb-6">
                     Initiate Support Protocol
                  </h3>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                     {/* CATEGORY */}
                     <select
                        className="w-full bg-surface border border-white/10 p-4 rounded-full text-white"
                        value={form.category}
                        onChange={(e) =>
                           setForm({ ...form, category: e.target.value })
                        }
                     >
                        <option>Shipment Sync Issue</option>
                        <option>Billing Discrepancy</option>
                        <option>Account Issue</option>
                        <option>General Inquiry</option>
                     </select>

                     {/* ORDER ID */}
                     <input
                        placeholder="Order ID (Optional)"
                        className="w-full bg-surface border border-white/10 p-4 rounded-full text-white"
                        value={form.orderId}
                        onChange={(e) =>
                           setForm({ ...form, orderId: e.target.value })
                        }
                     />

                     {/* MESSAGE */}
                     <textarea
                        placeholder="Describe your issue..."
                        rows={5}
                        className="w-full bg-surface border border-white/10 p-4 rounded-xl text-white"
                        value={form.message}
                        onChange={(e) =>
                           setForm({ ...form, message: e.target.value })
                        }
                     />

                     {/* STATUS */}
                     {error && <p className="text-red-400 text-sm">{error}</p>}
                     {success && <p className="text-green-400 text-sm">{success}</p>}

                     {/* BUTTON */}
                     <button
                        disabled={loading}
                        className="w-full bg-primary py-4 rounded-full text-white font-bold flex items-center justify-center gap-2"
                     >
                        <Send size={14} />
                        {loading ? "Submitting..." : "Submit Ticket"}
                     </button>
                  </form>
               </div>

               {/* FAQ */}
               <div className="bg-surface p-8 rounded-xl border border-white/5">
                  <h3 className="text-[11px] text-text-dim mb-6">
                     Knowledge Base
                  </h3>

                  <div className="space-y-4">
                     {faqs.map((faq, i) => (
                        <div
                           key={i}
                           className="p-4 border border-white/5 rounded-xl hover:bg-white/5"
                        >
                           <div className="flex justify-between items-center">
                              <p className="text-sm text-white">{faq.q}</p>
                              <ChevronRight size={16} />
                           </div>
                           <p className="text-xs text-text-dim mt-2">{faq.a}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
               <div className="bg-surface p-6 rounded-xl border border-white/5 space-y-4">
                  <h3 className="text-text-dim text-sm">Contact</h3>

                  <div className="flex items-center gap-3">
                     <MessageSquare size={18} />
                     <span className="text-white">Live Chat</span>
                  </div>

                  <div className="flex items-center gap-3">
                     <Phone size={18} />
                     <span className="text-white">+91 Support</span>
                  </div>

                  <div className="flex items-center gap-3">
                     <Mail size={18} />
                     <span className="text-white">support@0xchain.ai</span>
                  </div>
               </div>

               <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/20">
                  <div className="flex items-center gap-2 text-red-400 mb-3">
                     <ShieldAlert size={18} />
                     <span>Emergency</span>
                  </div>
                  <button className="w-full bg-red-500 py-3 rounded-full text-white">
                     Red Alert
                  </button>
               </div>

               <div className="bg-surface p-6 rounded-xl border border-white/5 flex gap-4">
                  <FileQuestion />
                  <p className="text-sm text-white">
                     Access full documentation
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}