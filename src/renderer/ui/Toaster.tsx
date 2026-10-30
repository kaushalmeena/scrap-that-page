import { Toaster as Sonner } from "sonner";

import { useResolvedTheme } from "@/app/ThemeProvider";

// Notification-style toasts: material panel, compact type.
export function Toaster() {
  const theme = useResolvedTheme();
  return (
    <Sonner
      theme={theme}
      position="bottom-center"
      gap={8}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-[340px] items-start gap-2.5 rounded-[12px] bg-popover px-3.5 py-2.5 text-body text-label shadow-popover backdrop-blur-2xl backdrop-saturate-[1.8] whitespace-pre-line",
          title: "font-medium",
          description: "text-callout text-secondary",
          icon: "mt-px [&_svg]:size-4",
          success: "[&_[data-icon]]:text-green",
          error: "[&_[data-icon]]:text-red",
          info: "[&_[data-icon]]:text-accent"
        }
      }}
    />
  );
}
