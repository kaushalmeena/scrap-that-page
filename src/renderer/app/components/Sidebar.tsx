import { useLiveQuery } from "dexie-react-hooks";
import {
  Clock,
  Heart,
  Library,
  type LucideIcon,
  Plus,
  Settings
} from "lucide-react";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router";

import db from "@/database";
import { scriptAppearance } from "@/features/scripts/utils/scriptAppearance";
import { shortcutLabel } from "@/lib/commands";
import { SPRING } from "@/lib/motion";
import { Button, IconButton } from "@/ui/Button";
import { Tile } from "@/ui/Tile";

import SidebarItem from "./SidebarItem";
import SidebarSection from "./SidebarSection";

export const SIDEBAR_WIDTH = 220;

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

  const handleNewScript = () => navigate("/new");
  const handleOpenSettings = () => navigate("/settings");

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? SIDEBAR_WIDTH : 0 }}
      transition={SPRING}
      aria-hidden={!open}
      className="shrink-0 overflow-hidden bg-sidebar in-[.vibrancy]:bg-transparent"
    >
      <div
        className="flex h-full flex-col"
        style={{ width: SIDEBAR_WIDTH }}
        inert={!open}
      >
        <div className="h-[52px] shrink-0 app-region-drag" />
        <nav className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-3">
          <SidebarSection title="Library">
            <SidebarItem
              to="/scripts"
              icon={<NavIcon Icon={Library} />}
              label="All Scripts"
              count={scripts?.length}
              active={pathname.startsWith("/scripts")}
            />
            <SidebarItem
              to="/favorites"
              icon={<NavIcon Icon={Heart} />}
              label="Favorites"
              count={favorites.length}
              active={pathname.startsWith("/favorites")}
            />
            <SidebarItem
              to="/history"
              icon={<NavIcon Icon={Clock} />}
              label="History"
              count={runCount}
              active={pathname.startsWith("/history")}
            />
          </SidebarSection>
          {favorites.length > 0 ? (
            <SidebarSection title="Favorites">
              {favorites.map((script) => {
                const { Icon, tint } = scriptAppearance(script);
                const route = `/favorites/${script.id}`;
                return (
                  <SidebarItem
                    key={script.id}
                    to={route}
                    icon={<Tile Icon={Icon} tint={tint} size="small" />}
                    label={script.name}
                    active={pathname.startsWith(route)}
                  />
                );
              })}
            </SidebarSection>
          ) : null}
        </nav>
        <footer className="flex items-center justify-between px-2.5 pb-2.5">
          <Button
            variant="plain"
            className="text-secondary hover:text-label"
            title={`New Script (${shortcutLabel("new-script")})`}
            onClick={handleNewScript}
          >
            <Plus />
            New Script
          </Button>
          <IconButton
            label={`Settings (${shortcutLabel("settings")})`}
            active={pathname === "/settings"}
            onClick={handleOpenSettings}
          >
            <Settings />
          </IconButton>
        </footer>
      </div>
    </motion.aside>
  );
}
