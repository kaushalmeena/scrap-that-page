import { FilePlus2, MousePointerClick } from "lucide-react";
import { Navigate, useNavigate } from "react-router";
import { shortcutLabel } from "@/lib/commands";
import { Button } from "@/ui/Button";
import { EmptyState } from "@/ui/EmptyState";
import { useLibrary } from "./LibraryContext";

// Detail pane with nothing selected: jump to the first script (as Mail does),
// or invite the user to create one.
export default function LibraryIndex() {
  const { scripts, basePath, filter } = useLibrary();
  const navigate = useNavigate();

  if (scripts === undefined) {
    return null;
  }
  if (scripts.length > 0) {
    return <Navigate to={`${basePath}/${scripts[0].id}`} replace />;
  }
  if (filter === "favorites") {
    return <EmptyState Icon={MousePointerClick} title="No Script Selected" />;
  }
  return (
    <EmptyState
      Icon={FilePlus2}
      title="Build Your First Script"
      message="Open a page, click and type, then extract the data you need — no code required."
      action={
        <Button variant="primary" size="large" onClick={() => navigate("/new")}>
          New Script
          <span className="text-white/70">{shortcutLabel("new-script")}</span>
        </Button>
      }
    />
  );
}
