import { cn } from "@/utils/cn";

const SPOKES = Array.from({ length: 8 }, (_, i) => i);

// NSProgressIndicator (spinning style): eight fading spokes.
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="progressbar"
      aria-label="Loading"
      className={cn("relative inline-block size-4 text-secondary", className)}
    >
      {SPOKES.map((i) => (
        <span
          key={i}
          className="absolute top-0 left-[calc(50%-1px)] h-full w-[2px]"
          style={{ transform: `rotate(${i * 45}deg)` }}
        >
          <span
            className="block h-[30%] w-full animate-[spoke_0.8s_linear_infinite] rounded-full bg-current"
            style={{ animationDelay: `${(i - 8) * 0.1}s` }}
          />
        </span>
      ))}
    </span>
  );
}
