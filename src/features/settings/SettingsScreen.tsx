import { type ChangeEvent, useEffect, useId, useState } from "react";

import { FormRow, FormSection } from "@/components/Form";
import Logo from "@/components/Logo";
import { SegmentedControl } from "@/components/SegmentedControl";
import { TextField } from "@/components/TextField";
import { Toggle } from "@/components/Toggle";
import { Toolbar } from "@/components/Toolbar";
import { shortcutLabel } from "@/lib/commands";
import type { AppCommand } from "@/types/app";

import { type Theme, useSettingsStore } from "./store/settingsStore";

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "system", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" }
];

const SHORTCUTS: [AppCommand, string][] = [
  ["command-palette", "Command palette"],
  ["new-script", "New script"],
  ["run-script", "Run selected script"],
  ["edit-script", "Edit selected script"],
  ["toggle-favorite", "Toggle favorite"],
  ["find", "Search scripts"],
  ["save", "Save script (in editor)"],
  ["toggle-sidebar", "Show or hide sidebar"]
];

export default function SettingsScreen() {
  const showWindow = useSettingsStore((s) => s.showWindow);
  const theme = useSettingsStore((s) => s.theme);
  const stepDelayMs = useSettingsStore((s) => s.stepDelayMs);
  const { setShowWindow, setTheme, setStepDelayMs } = useSettingsStore(
    (s) => s.actions
  );
  const [version, setVersion] = useState("");
  const showWindowId = useId();
  const delayId = useId();

  useEffect(() => {
    window.scraper?.getVersion().then(setVersion);
  }, []);

  const handleDelayChange = (event: ChangeEvent<HTMLInputElement>) =>
    setStepDelayMs(Number(event.target.value) || 0);

  return (
    <div data-pane className="flex min-w-0 flex-1 flex-col">
      <Toolbar title="Settings" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-140 flex-col gap-6 px-6 py-8">
          <FormSection title="Appearance">
            <FormRow
              label="Appearance"
              description="Auto follows your system setting."
            >
              <SegmentedControl
                value={theme}
                options={THEME_OPTIONS}
                onChange={setTheme}
              />
            </FormRow>
          </FormSection>

          <FormSection
            title="Running Scripts"
            footer="A short delay between steps is gentler on the sites you scrape."
          >
            <FormRow
              label="Show browser window"
              description="Watch each step happen. Turn off to run in the background."
              htmlFor={showWindowId}
            >
              <Toggle
                id={showWindowId}
                checked={showWindow}
                onCheckedChange={setShowWindow}
              />
            </FormRow>
            <FormRow label="Delay between steps" htmlFor={delayId}>
              <div className="flex items-center gap-1.5">
                <TextField
                  id={delayId}
                  type="number"
                  min={0}
                  step={100}
                  className="w-20 text-right tabular-nums"
                  value={stepDelayMs}
                  onChange={handleDelayChange}
                />
                <span className="text-secondary">ms</span>
              </div>
            </FormRow>
          </FormSection>

          <FormSection title="Keyboard Shortcuts">
            {SHORTCUTS.map(([command, label]) => (
              <FormRow key={command} label={label}>
                <kbd className="font-sans tracking-wider text-secondary">
                  {shortcutLabel(command)}
                </kbd>
              </FormRow>
            ))}
          </FormSection>

          <div className="flex flex-col items-center gap-2 pt-2 text-center">
            <Logo className="size-12 rounded-xl" />
            <p className="font-semibold">ScrapThatPage</p>
            <p className="text-caption text-secondary">
              {version ? `Version ${version}` : " "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
