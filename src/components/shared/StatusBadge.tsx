import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS, formatStatus } from "@/constants/status";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700";
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-0 font-medium text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5",
        colorClass,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {formatStatus(status)}
    </Badge>
  );
}
