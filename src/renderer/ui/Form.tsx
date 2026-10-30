import type { ReactNode } from "react";

// System Settings style inset-grouped form: titled sections of rows inside a
// softly filled rounded box, separated by inset hairlines.
export function FormSection({
  title,
  footer,
  children
}: {
  title?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-1.5">
      {title ? (
        <h2 className="px-2.5 text-body font-semibold">{title}</h2>
      ) : null}
      <div className="divide-y rounded-box border border-box-border bg-box [&>*]:border-separator">
        {children}
      </div>
      {footer ? (
        <p className="px-2.5 text-caption text-secondary">{footer}</p>
      ) : null}
    </section>
  );
}

export function FormRow({
  label,
  description,
  htmlFor,
  children
}: {
  label: ReactNode;
  description?: ReactNode;
  htmlFor?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-2.5 flex min-h-10 items-center gap-4 py-2">
      <div className="min-w-0 flex-1">
        <label htmlFor={htmlFor} className="block text-body">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-caption text-secondary">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
