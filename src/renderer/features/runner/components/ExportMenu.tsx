import { Share } from "lucide-react";
import { toast } from "sonner";

import { TOAST_MESSAGES } from "@/lib/messages";
import { Button } from "@/ui/Button";
import { Menu, MenuItem, MenuSeparator } from "@/ui/Menu";

import type { TableData } from "../types";
import {
  copyTableToClipboard,
  downloadAsCSV,
  downloadAsJSON,
  downloadAsXLSX
} from "../utils/exportUtils";

// Toolbar "Export" pull-down for a result table.
export default function ExportMenu({ data }: { data: TableData }) {
  const handleXLSX = () =>
    downloadAsXLSX(data).catch(() =>
      toast.error(TOAST_MESSAGES.RESULTS_EXPORT_FAILURE)
    );

  const handleCopy = () =>
    copyTableToClipboard(data)
      .then(() => toast.success(TOAST_MESSAGES.RESULTS_COPY_SUCCESS))
      .catch(() => toast.error(TOAST_MESSAGES.RESULTS_COPY_FAILURE));

  const handleCSV = () => downloadAsCSV(data);
  const handleJSON = () => downloadAsJSON(data);

  return (
    <Menu
      trigger={
        <Button disabled={data.rows.length === 0}>
          <Share />
          Export
        </Button>
      }
    >
      <MenuItem onSelect={handleCSV}>CSV…</MenuItem>
      <MenuItem onSelect={handleJSON}>JSON…</MenuItem>
      <MenuItem onSelect={handleXLSX}>Excel Workbook…</MenuItem>
      <MenuSeparator />
      <MenuItem onSelect={handleCopy}>Copy as Table</MenuItem>
    </Menu>
  );
}
