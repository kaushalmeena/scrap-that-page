import { CircleCheck, CircleSlash, CircleX } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Run } from "@/types/run";

export default function RunStatusIcon({
  status,
  className
}: {
  status: Run["status"];
  className?: string;
}) {
  const classes = cn("size-4 shrink-0", className);
  switch (status) {
    case "finished":
      return <CircleCheck className={cn(classes, "text-green")} />;
    case "error":
      return <CircleX className={cn(classes, "text-red")} />;
    default:
      return <CircleSlash className={cn(classes, "text-secondary")} />;
  }
}
