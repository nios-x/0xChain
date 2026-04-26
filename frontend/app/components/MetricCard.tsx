interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon?: string;
  subtitle?: string;
  variant?: "default" | "error" | "info" | "warning";
}

export default function MetricCard({
  title,
  value,
  trend,
  trendDirection = "neutral",
  icon,
  subtitle,
  variant = "default",
}: MetricCardProps) {
  const borderClass =
    variant === "error"
      ? "border-l-2 border-error/50"
      : variant === "warning"
        ? "border-l-2 border-warning/50"
        : "";

  const trendColorClass =
    trendDirection === "up"
      ? "text-success"
      : trendDirection === "down"
        ? "text-error"
        : "text-text-muted";

  const trendIcon =
    trendDirection === "up"
      ? "trending_up"
      : trendDirection === "down"
        ? "trending_down"
        : "sync";

  const iconColorClass =
    variant === "error"
      ? "text-error"
      : variant === "info"
        ? "text-info"
        : "text-text-dim group-hover:text-primary";

  return (
    <div
      className={`bg-surface p-6 rounded-[8px] hover:bg-surface-elevated transition-colors duration-200 group ${borderClass}`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[11px] uppercase font-bold tracking-[0.1em] text-text-dim group-hover:text-text-secondary">
          {title}
        </span>
        {icon && (
          <span
            className={`material-symbols-outlined text-sm ${iconColorClass}`}
            style={
              variant === "error"
                ? { fontVariationSettings: "'FILL' 1" }
                : undefined
            }
          >
            {icon}
          </span>
        )}
      </div>
      <div className="text-4xl font-extrabold tabular-nums text-white">
        {value}
      </div>
      {(trend || subtitle) && (
        <div
          className={`mt-2 flex items-center gap-1 text-xs font-bold ${trendColorClass}`}
        >
          {trend && (
            <>
              <span className="material-symbols-outlined text-xs">
                {trendIcon}
              </span>
              <span>{trend}</span>
            </>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
