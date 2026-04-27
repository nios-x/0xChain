"use client";

import { MessageSquare, Phone, Mail, HelpCircle, ShieldAlert, Send, Search, ChevronRight, FileQuestion } from "lucide-react";
import MetricCard from "../../components/MetricCard";

export default function SupportPage() {
  const faqs = [
    { q: "How do I redirect a sync in progress?", a: "Access the order node and select 'Route Diversion' within the first 30 minutes of transit." },
    { q: "What is the 0xCHAIN latency protocol?", a: "Our proprietary sync ensures sub-10ms tracking updates across all logistics nodes." },
    { q: "Lost encrypted key for delivery?", a: "Contact your local Hub administrator with your biometric signature." },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">
            Resolution Center: ONLINE
          </span>
          <h2 className="text-5xl font-extrabold tracking-tighter text-white">
            Help Terminal
          </h2>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 border border-white/10 bg-white/5 rounded-full text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
            Contact Admin
          </button>
          <button className="rounded-full bg-primary px-8 py-3 text-white font-bold text-[11px] uppercase tracking-widest hover:scale-[1.04] hover:bg-primary-hover transition-all glow-primary">
            Submit Ticket
          </button>
        </div>
      </div>

      {/* Support Contexts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Avg Response" value="4m" subtitle="Sync Speed" icon="timer" />
        <MetricCard title="Resolution Rate" value="99.2%" trend="Optimal" trendDirection="up" icon="verified_user" />
        <MetricCard title="Active Tickets" value="00" icon="confirmation_number" />
        <MetricCard title="System Health" value="100%" icon="security" variant="info" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Support Inquiry Form (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
           <div className="bg-surface rounded-xl border border-white/5 p-8">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-8">Initiate Support Protocol</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-4">Incident Category</label>
                       <select className="w-full bg-surface-container-high border border-white/5 rounded-full py-4 px-6 text-white text-sm outline-none focus:border-primary transition-colors appearance-none">
                          <option>Shipment Sync Issue</option>
                          <option>Billing Discrepancy</option>
                          <option>Account Protocol Fault</option>
                          <option>General Inquiry</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-4">Protocol ID (Optional)</label>
                       <input 
                         type="text" 
                         placeholder="ORD-XXXX"
                         className="w-full bg-surface-container-high border border-white/5 rounded-full py-4 px-6 text-white text-sm outline-none focus:border-primary transition-colors"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-4">Inquiry Details</label>
                    <textarea 
                      rows={5}
                      placeholder="Describe the protocol variance..."
                      className="w-full bg-surface-container-high border border-white/5 rounded-[20px] py-4 px-6 text-white text-sm outline-none focus:border-primary transition-colors resize-none"
                    ></textarea>
                 </div>
                 <button className="flex items-center justify-center gap-3 w-full md:w-auto px-10 py-4 bg-primary text-white font-black text-[11px] uppercase tracking-widest rounded-full hover:brightness-110 transition-all glow-primary">
                    <Send size={14} />
                    Transmit Inquiry
                 </button>
              </form>
           </div>

           {/* FAQ Grid */}
           <div className="bg-surface rounded-xl border border-white/5 p-8">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">Protocol KB (FAQ)</h3>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search KB..."
                      className="bg-surface-elevated border border-white/5 rounded-full py-1.5 pl-9 pr-4 text-white text-[10px] outline-none"
                    />
                 </div>
              </div>
              <div className="space-y-4">
                 {faqs.map((faq, i) => (
                    <div key={i} className="group p-5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                       <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-bold text-white uppercase tracking-tight">{faq.q}</p>
                          <ChevronRight className="text-text-dim group-hover:text-primary transition-colors" size={16} />
                       </div>
                       <p className="text-[11px] text-text-dim leading-relaxed">{faq.a}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Channels & Emergency (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-surface p-8 rounded-xl border border-white/5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-8">Direct Channels</h3>
              <div className="space-y-4">
                 {[
                    { label: "Live Terminal", desc: "Real-time sync chat", icon: MessageSquare, action: "Launch", color: "text-primary", bg: "bg-primary/10" },
                    { label: "Phone Protocol", desc: "+1 (800) 0xCHAIN", icon: Phone, action: "Call", color: "text-info", bg: "bg-info/10" },
                    { label: "Secure Mail", desc: "support@0xchain.ai", icon: Mail, action: "Write", color: "text-white", bg: "bg-white/5" },
                 ].map((channel, i) => (
                    <div key={i} className="p-4 border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${channel.bg} ${channel.color}`}>
                             <channel.icon size={18} />
                          </div>
                          <div>
                             <p className="text-[11px] font-bold text-white">{channel.label}</p>
                             <p className="text-[10px] text-text-dim">{channel.desc}</p>
                          </div>
                       </div>
                       <button className="text-[10px] font-black uppercase text-primary hover:underline">{channel.action}</button>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-gradient-to-br from-error/20 to-surface p-8 rounded-xl border border-error/10 relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 text-error mb-4">
                    <ShieldAlert size={20} />
                    <h3 className="text-xl font-black tracking-tighter uppercase">Incident Room</h3>
                 </div>
                 <p className="text-[11px] text-text-dim leading-relaxed mb-6">
                    For high-priority mission variance or total protocol failure. Unauthorized access is logged by node admin.
                 </p>
                 <button className="w-full py-3 bg-error text-white font-black text-[10px] uppercase tracking-widest rounded-full glow-error hover:brightness-110 transition-all">
                    Initiate Red Alert
                 </button>
              </div>
              <HelpCircle className="absolute -bottom-4 -right-4 text-error/5 w-32 h-32 group-hover:scale-110 transition-transform duration-500" />
           </div>

           <div className="bg-surface p-8 rounded-xl border border-white/5 flex items-center gap-6">
              <div className="p-3 bg-info/10 text-info rounded-full">
                 <FileQuestion size={24} />
              </div>
              <div>
                 <p className="text-[11px] text-white font-bold">Documentation Sync</p>
                 <p className="text-[10px] text-text-dim">Access full protocol PDF guides for end-to-end logistics resolution.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
