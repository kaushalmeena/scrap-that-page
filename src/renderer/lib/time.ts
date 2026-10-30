const relative = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000_000],
  ["month", 2_592_000_000],
  ["week", 604_800_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000]
];

// "5 minutes ago", "yesterday"… falling back to "just now".
export const formatRelative = (timestamp: number, now = Date.now()) => {
  const diff = timestamp - now;
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) {
      return relative.format(Math.round(diff / ms), unit);
    }
  }
  return "just now";
};

const dateTime = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short"
});

export const formatDateTime = (timestamp: number) =>
  dateTime.format(timestamp);

// "1:07"-style duration.
export const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};
