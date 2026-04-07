import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pending: "bg-amber/15 text-amber border-amber/25",
  running: "bg-cyan/15 text-cyan border-cyan/25 animate-pulse-glow",
  completed: "bg-green/15 text-green border-green/25",
  failed: "bg-rose/15 text-rose border-rose/25",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", statusStyles[status] || statusStyles.pending)}>
      {status === "running" && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {status}
    </span>
  );
}
