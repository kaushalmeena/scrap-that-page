import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the design tokens from index.css. Without this it
// reads `text-body` as a text *color* and drops it (or the real color) when
// both appear in one cn() call.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "title1",
        "title2",
        "title3",
        "body",
        "callout",
        "caption",
        "mini"
      ],
      radius: ["control", "box", "sheet"],
      shadow: [
        "control",
        "popover",
        "sheet",
        "card",
        "glyph",
        "primary",
        "track",
        "knob"
      ]
    }
  }
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
