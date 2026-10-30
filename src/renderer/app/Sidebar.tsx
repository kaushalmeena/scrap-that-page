import { useLiveQuery } from "dexie-react-hooks";
import { Clock, Heart, Library, type LucideIcon, Plus, Settings } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import db from "@/database";
import { scriptAppearance } from "@/features/scripts/appearance";
import { shortcutLabel } from "@/lib/commands";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Button, IconButton } from "@/ui/Button";
import { Tile } from "@/ui/Tile";

export const SIDEBAR_WIDTH = 220;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-3 first:mt-0">
      <h2 className="px-2 pb-1 text-caption font-semibold text-tertiary">
        {title}
      </h2>
      <div className="flex flex-col gap-px">{children}</div>
    </div>
  );
}

function Item({
  icon,
  label,
  count,
  active,
  onClick
}: {
  icon: ReactNode;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onPointerDown={(event) => {
        // Navigate on press, not release, like a native source list.
        if (event.button === 0) {
          onClick();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onClick();
        }
      }}
      className={cn(
        "flex h-7 items-center gap-2 rounded-[6px] px-2 text-left text-body outline-none",
        active && "bg-black/[0.09] dark:bg-white/[0.11]"
      )}
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined ? (
        <span className="text-callout text-secondary tabular-nums">{count}</span>
      ) : null}
    </button>
  );
}

function NavIcon({ Icon }: { Icon: LucideIcon }) {
  return <Icon className="size-4 shrink-0 text-accent" strokeWidth={2} />;
}

// Source-list sidebar on the native vibrancy material: library sections with
// live counts, favorite scripts for one-click access, and New Script /
// Settings at the bottom (like Notes and Reminders).
export default function Sidebar({ open }: { open: boolean }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const scripts = useLiveQuery(() => db.getScripts(), []);
  const runCount = useLiveQuery(() => db.countRuns(), []);

  const favorites = scripts?.filter((s) => s.favorite) ?? [];

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? SIDEBAR_WIDTH : 0 }}
      transition={SPRING}
      aria-hidden={!open}
      className="shrink-0 overflow-hidden bg-sidebar [.vibrancy_&]:bg-transparent"
    >
      <div
        className="flex h-full flex-col"
        style={{ width: SIDEBAR_WIDTH }}
        inert={!open}
      >
        <div className="app-region-drag h-[52px] shrink-0" />
        <nav className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-3">
          <Section title="Library">
            <Item
              icon={<NavIcon Icon={Library} />}
              label="All Scripts"
              count={scripts?.length}
              active={pathname.startsWith("/scripts")}
              onClick={() => navigate("/scripts")}
            />
            <Item
              icon={<NavIcon Icon={Heart} />}
              label="Favorites"
              count={favorites.length}
              active={pathname.startsWith("/favorites")}
              onClick={() => navigate("/favorites")}
            />
            <Item
              icon={<NavIcon Icon={Clock} />}
              label="History"
              count={runCount}
              active={pathname.startsWith("/history")}
              onClick={() => navigate("/history")}
            />
          </Section>
          {favorites.length > 0 ? (
            <Section title="Favorites">
              {favorites.map((script) => {
                const { Icon, tint } = scriptAppearance(script);
                const route = `/favorites/${script.id}`;
                return (
                  <Item
                    key={script.id}
                    icon={<Tile Icon={Icon} tint={tint} size="small" />}
                    label={script.name}
                    active={pathname.startsWith(route)}
                    onClick={() => navigate(route)}
                  />
                );
              })}
            </Section>
          ) : null}
        </nav>
        <footer className="flex items-center justify-between px-2.5 pb-2.5">
          <Button
            variant="plain"
            className="text-secondary hover:text-label"
            title={`New Script (${shortcutLabel("new-script")})`}
            onClick={() => navigate("/new")}
          >
            <Plus />
            New Script
          </Button>
          <IconButton
            label={`Settings (${shortcutLabel("settings")})`}
            active={pathname === "/settings"}
            onClick={() => navigate("/settings")}
          >
            <Settings />
          </IconButton>
        </footer>
      </div>
    </motion.aside>
  );
}
