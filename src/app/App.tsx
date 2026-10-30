import { MotionConfig } from "motion/react";
import { RouterProvider } from "react-router";

import router from "./router";
import ThemeProvider from "./ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      {/* Honor "Reduce motion": springs become instant cross-fades. */}
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </ThemeProvider>
  );
}
