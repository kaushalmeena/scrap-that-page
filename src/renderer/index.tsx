import { createRoot } from "react-dom/client";

import App from "@/app/App";
import { isMac } from "@/lib/platform";

import "@/index.css";

// Platform classes drive window-chrome styling in index.css: on macOS the
// window is translucent (native vibrancy) and the traffic lights need room.
document.documentElement.classList.toggle("platform-mac", isMac);
document.documentElement.classList.toggle(
  "vibrancy",
  window.app?.platform === "darwin"
);

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Failed to find the root element");
}

createRoot(rootEl).render(<App />);
