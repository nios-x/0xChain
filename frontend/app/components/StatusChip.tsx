type ChipVariant =
  | "delivered"
  | "in-transit"
  | "delayed"
  | "pending"
  | "active"
  | "completed"
  | "at-risk"
  | "overdue"
  | "failed"
  | "rerouted";

interface StatusChipProps {
  status: ChipVariant;
  label?: string;
}

const variantStyles: Record<ChipVariant, string> = {
  delivered: "bg-success/10 text-success",
  completed: "bg-success/10 text-success",
  active: "bg-success/10 text-success",
  "in-transit": "bg-warning/10 text-warning",
  "at-risk": "bg-warning/10 text-warning",
  rerouted: "bg-info/10 text-info",
  delayed: "bg-error/10 text-error",
  overdue: "bg-error/10 text-error",
  failed: "bg-error/20 text-error",
  pending: "bg-text-dim/10 text-text-muted",
};

const defaultLabels: Record<ChipVariant, string> = {
  delivered: "Delivered",
  completed: "Completed",
  active: "Active",
  "in-transit": "In Transit",
  "at-risk": "At Risk",
  delayed: "Delayed",
  overdue: "Overdue",
  failed: "Failed",
  rerouted: "Rerouted",
  pending: "Pending",
};

export default function StatusChip({ status, label }: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${variantStyles[status]}`}
    >
      {label || defaultLabels[status]}
    </span>
  );
}
