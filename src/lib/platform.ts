export const isMac = navigator.platform.toUpperCase().includes("MAC");

// Modifier glyph used when rendering shortcuts.
export const MOD_KEY = isMac ? "⌘" : "Ctrl+";
