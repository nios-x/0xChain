"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface-elevated/50 text-text-dim text-[11px] font-bold uppercase tracking-widest">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        Loading Map Data...
      </div>
    </div>
  ),
});

export default function MapWrapper(props: any) {
  return <Map {...props} />;
}
