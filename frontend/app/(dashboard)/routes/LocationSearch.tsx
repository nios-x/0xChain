"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface GeoResult {
  label: string;
  lat: number;
  lon: number;
}

interface LocationSearchProps {
  label: string;
  placeholder?: string;
  value: GeoResult | null;
  onChange: (result: GeoResult | null) => void;
  icon?: "origin" | "destination" | "stop";
}

async function searchNominatim(query: string): Promise<GeoResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&addressdetails=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "en", "User-Agent": "RouteOptimizer/1.0" },
    });
    const data = await res.json();
    return data.map((item: any) => ({
      label: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  } catch {
    return [];
  }
}

const ICON_COLORS = {
  origin: "#1DB954",
  destination: "#ef4444",
  stop: "#f59e0b",
};

const PinIcon = ({ type }: { type: "origin" | "destination" | "stop" }) => (
  <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 0C3.134 0 0 3.134 0 7c0 4.667 7 11 7 11s7-6.333 7-11C14 3.134 10.866 0 7 0z"
      fill={ICON_COLORS[type]}
    />
    <circle cx="7" cy="7" r="2.5" fill="white" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="animate-spin"
  >
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
    <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function LocationSearch({
  label,
  placeholder = "Search any city, address…",
  value,
  onChange,
  icon = "origin",
}: LocationSearchProps) {
  const [query, setQuery] = useState(value?.label ?? "");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync label when value changes externally
  useEffect(() => {
    if (value) setQuery(value.label.split(",")[0]); // show just the first part
  }, [value]);

  // Debounced search
  const handleInput = useCallback((q: string) => {
    setQuery(q);
    setActiveIdx(-1);
    onChange(null); // clear selection when user types

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      const found = await searchNominatim(q);
      setResults(found);
      setIsOpen(found.length > 0);
      setIsLoading(false);
    }, 350);
  }, [onChange]);

  const selectResult = useCallback((r: GeoResult) => {
    onChange(r);
    setQuery(r.label.split(",")[0]);
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
  }, [onChange]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      selectResult(results[activeIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const isSelected = value !== null;

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-dim flex items-center gap-2">
        <PinIcon type={icon} />
        {label}
      </label>

      <div className="relative">
        {/* Input */}
        <div
          className={`flex items-center gap-2 h-[42px] bg-surface-elevated rounded-[6px] px-3 border transition-all ${
            isSelected
              ? "border-" + (icon === "origin" ? "primary" : icon === "destination" ? "red-500" : "amber-500") + "/60"
              : "border-white/5"
          } focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20`}
          style={{
            borderColor: isSelected
              ? icon === "origin"
                ? "rgba(29,185,84,0.5)"
                : icon === "destination"
                ? "rgba(239,68,68,0.5)"
                : "rgba(245,158,11,0.5)"
              : undefined,
          }}
        >
          <span className="text-text-dim flex-shrink-0">
            {isLoading ? <SpinnerIcon /> : <SearchIcon />}
          </span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-text-dim/50 min-w-0"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {isSelected && (
            <button
              onClick={() => { onChange(null); setQuery(""); setResults([]); }}
              className="text-text-dim hover:text-white flex-shrink-0 transition-colors"
              title="Clear"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Resolved badge */}
        {isSelected && (
          <div className="mt-1 flex items-center gap-1.5 px-1">
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: ICON_COLORS[icon] }}
            />
            <span className="text-[10px] text-text-dim truncate">{value.label}</span>
          </div>
        )}

        {/* Dropdown */}
        {isOpen && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-[600] bg-[#1a1a1a] border border-white/10 rounded-[8px] shadow-2xl overflow-hidden">
            {results.map((r, i) => {
              const parts = r.label.split(",");
              const main = parts[0].trim();
              const sub = parts.slice(1, 3).join(",").trim();
              return (
                <button
                  key={i}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                    i === activeIdx ? "bg-primary/20" : "hover:bg-white/5"
                  } ${i > 0 ? "border-t border-white/5" : ""}`}
                  onMouseDown={(e) => { e.preventDefault(); selectResult(r); }}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  <span className="mt-0.5 flex-shrink-0 opacity-60">
                    <PinIcon type={icon} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{main}</p>
                    {sub && <p className="text-[11px] text-text-dim truncate mt-0.5">{sub}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* No results */}
        {isOpen && !isLoading && results.length === 0 && query.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-[600] bg-[#1a1a1a] border border-white/10 rounded-[8px] shadow-2xl px-4 py-3">
            <p className="text-sm text-text-dim">No locations found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}