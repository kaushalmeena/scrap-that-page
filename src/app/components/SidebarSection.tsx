import type { ReactNode } from "react";

export default function SidebarSection({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-3 first:mt-0">
      <h2 className="px-2 pb-1 text-caption font-semibold text-tertiary">
        {title}
      </h2>
      <div className="flex flex-col gap-px">{children}</div>
    </div>
  );
}
