const riskFactors = [
  { label: "Weather Disruption", severity: 72, color: "bg-warning" },
  { label: "Port Congestion", severity: 45, color: "bg-info" },
  { label: "Geopolitical Risk", severity: 28, color: "bg-primary" },
  { label: "Equipment Failure", severity: 15, color: "bg-text-muted" },
];

const recommendations = [
  { title: "Re-route Pacific Lane", desc: "Shift Shanghai→LA route via Honolulu to avoid Typhoon Mira. Saves 18h delay.", impact: "+$2.1K fuel", priority: "High" },
  { title: "Pre-position Inventory", desc: "Move 2,400 units to Chicago DC before Thursday demand spike. 94% probability.", impact: "+$800 logistics", priority: "Medium" },
  { title: "Consolidate Shipments", desc: "Merge SHP-14206 and SHP-14207 into single container. Reduces carbon by 1.8T.", impact: "-$3.2K savings", priority: "Low" },
];

const trendData = [35, 42, 38, 55, 48, 62, 58, 71, 65, 78, 72, 85];

export default function AnalyticsPage() {
  const maxTrend = Math.max(...trendData);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary mb-2 block">Machine Learning Engine</span>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white">Predictive Analytics</h2>
        </div>
        <button className="rounded-full bg-primary px-8 py-3 text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.04] hover:bg-primary-hover transition-all glow-primary">
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Probability Score */}
          <div className="bg-surface p-8 rounded-[8px] flex items-center gap-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-2">Delay Probability — Next 48h</p>
              <p className="text-[72px] leading-none font-extrabold tabular-nums text-warning">23%</p>
              <p className="text-xs text-text-muted mt-2 font-bold uppercase">Moderate Risk — 3 Factors Active</p>
            </div>
            <div className="flex-1 h-24 flex items-end gap-1">
              {trendData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <div
                    className={`rounded-t-sm ${i === trendData.length - 1 ? "bg-primary" : "bg-surface-elevated"} transition-all hover:bg-primary/60`}
                    style={{ height: `${(v / maxTrend) * 100}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">Active Risk Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskFactors.map((r) => (
                <div key={r.label} className="bg-surface p-5 rounded-[8px] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">{r.label}</span>
                    <span className="text-lg font-extrabold tabular-nums text-white">{r.severity}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full">
                    <div className={`h-full ${r.color} rounded-full transition-all`} style={{ width: `${r.severity}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-surface p-6 rounded-[8px]">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim mb-4">Efficiency Trend — 12 Months</h3>
            <div className="h-32 flex items-end gap-2">
              {trendData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-sm ${i === trendData.length - 1 ? "bg-primary" : "bg-surface-elevated"} hover:bg-primary/50 transition-all`}
                    style={{ height: `${(v / maxTrend) * 100}%` }}
                  />
                  <span className="text-[8px] text-text-dim">{["J","F","M","A","M","J","J","A","S","O","N","D"][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Recommendations */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-dim">AI Recommendations</h3>
          {recommendations.map((rec, i) => (
            <div key={i} className="bg-surface p-5 rounded-[8px] border-l-2 border-primary space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  rec.priority === "High" ? "bg-error/10 text-error" :
                  rec.priority === "Medium" ? "bg-warning/10 text-warning" :
                  "bg-primary/10 text-primary"
                }`}>{rec.priority}</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">{rec.desc}</p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-text-dim uppercase">{rec.impact}</span>
                <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Apply</button>
              </div>
            </div>
          ))}

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-primary-container to-[#004a1c] p-6 rounded-[8px] relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1">Model Accuracy</p>
              <p className="text-3xl font-extrabold text-white tabular-nums">97.2%</p>
              <p className="text-[10px] text-white/60 mt-2">Trained on 2.4M logistics events</p>
            </div>
            <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-[80px] text-white/10">psychology</span>
          </div>
        </div>
      </div>
    </div>
  );
}
