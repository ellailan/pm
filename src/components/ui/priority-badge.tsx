import { Priority } from "@/types";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const priorityLevels: Record<Priority, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Urgent: 4,
};

const priorityStyles: Record<Priority, string> = {
  Low: "bg-mint-100 text-mint-700",
  Medium: "bg-purple-100 text-purple-700",
  High: "bg-pink-100 text-pink-700",
  Urgent: "bg-navy-800 text-white",
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const level = priorityLevels[priority];

  return (
    <span
      className={cn(
        `inline-flex items-center gap-1 px-2 py-1 font-bold text-[10px] uppercase rounded shadow`,
        priorityStyles[priority],
        className
      )}
    >
      <ArrowUp className={`w-3 h-3 stroke-[3px] ${level >= 3 ? "" : ""}`} />
      {priority}
    </span>
  );
}
