import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Dialog } from "@base-ui/react/dialog";
import type { ReactNode } from "react";

import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

import { Button } from "./Button";

const backdropClasses =
  "fixed inset-0 z-50 bg-black/15 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:bg-black/35";

const popupClasses =
  "fixed top-[18%] left-1/2 z-50 -translate-x-1/2 rounded-sheet bg-window shadow-sheet outline-none transition-[opacity,scale,translate] duration-200 ease-[cubic-bezier(0.2,0.9,0.3,1.05)] data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-ending-style:duration-120 data-starting-style:-translate-y-1.5 data-starting-style:scale-[0.96] data-starting-style:opacity-0";

// Modal sheet with a title, optional explanation, body and a footer of
// buttons (trailing primary, like every macOS dialog).
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  className
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => onOpenChange(next)}>
      <Dialog.Portal>
        <Dialog.Backdrop className={backdropClasses} />
        <Dialog.Popup className={cn(popupClasses, "w-[440px] p-5", className)}>
          <Dialog.Title className="text-title3 font-semibold">
            {title}
          </Dialog.Title>
          {description ? (
            <Dialog.Description className="mt-1 text-callout text-secondary">
              {description}
            </Dialog.Description>
          ) : null}
          {children ? <div className="mt-4">{children}</div> : null}
          {footer ? (
            <div className="mt-5 flex justify-end gap-2">{footer}</div>
          ) : null}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// NSAlert: compact, centered, app icon on top and two equal-width buttons.
export function Alert({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel,
  destructive = false,
  onConfirm
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  const handleConfirm = () => {
    onOpenChange(false);
    onConfirm();
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={(next) => onOpenChange(next)}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className={backdropClasses} />
        <AlertDialog.Popup
          className={cn(
            popupClasses,
            "flex w-[260px] flex-col items-center p-4 pt-5 text-center"
          )}
        >
          <Logo className="size-14 rounded-[13px]" />
          <AlertDialog.Title className="mt-3 text-body font-semibold">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-1 text-caption text-label">
            {message}
          </AlertDialog.Description>
          <div className="mt-4 grid w-full grid-cols-2 gap-2">
            <AlertDialog.Close render={<Button size="large" />}>
              Cancel
            </AlertDialog.Close>
            <Button
              size="large"
              variant={destructive ? "destructive" : "primary"}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
