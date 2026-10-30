import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

// macOS push buttons. "push" is the bordered default, "primary" the accented
// default button (Return), "plain" a borderless text button, "destructive"
// the red confirm used in alerts. Press feedback is a quick dim + slight
// shrink on pointer-down, no transition delay on release.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 font-medium whitespace-nowrap transition-[background-color,box-shadow,opacity,transform] duration-100 outline-none select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        push: "bg-control text-label shadow-control active:brightness-95",
        primary:
          "bg-accent text-white shadow-primary hover:bg-accent-hover active:brightness-90",
        destructive:
          "bg-red text-white shadow-control hover:brightness-105 active:brightness-90",
        plain: "text-label hover:bg-fill active:bg-fill-strong",
        accent: "text-accent hover:bg-fill active:bg-fill-strong"
      },
      size: {
        small: "h-5 rounded-[5px] px-2 text-caption [&_svg]:size-3",
        regular: "h-6 rounded-control px-2.5 text-body [&_svg]:size-3.5",
        large: "h-8 rounded-lg px-3.5 text-body [&_svg]:size-4"
      }
    },
    defaultVariants: { variant: "push", size: "regular" }
  }
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

// Borderless square icon button as used in window toolbars and list rows.
// `label` doubles as the tooltip and the accessible name.
export function IconButton({
  label,
  active = false,
  className,
  size = "regular",
  ...props
}: Omit<ComponentProps<"button">, "title"> & {
  label: string;
  active?: boolean;
  size?: "small" | "regular";
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active || undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-control text-secondary transition-[background-color,color,transform] duration-100 outline-none hover:bg-fill hover:text-label active:scale-95 active:bg-fill-strong disabled:pointer-events-none disabled:opacity-35",
        size === "regular"
          ? "size-7 [&_svg]:size-4"
          : "size-5 [&_svg]:size-3.5",
        active && "text-accent hover:text-accent",
        className
      )}
      {...props}
    />
  );
}
