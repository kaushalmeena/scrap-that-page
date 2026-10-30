import { Heart, Library } from "lucide-react";

import { EmptyState } from "@/ui/EmptyState";

import type { LibraryFilter } from "../context/LibraryContext";

// What the script list shows when nothing is in it.
export default function LibraryEmptyState({
  filter,
  search
}: {
  filter: LibraryFilter;
  search: string;
}) {
  if (search.trim()) {
    return (
      <EmptyState title="No Results" message={`Nothing matches “${search}”.`} />
    );
  }
  if (filter === "favorites") {
    return (
      <EmptyState
        Icon={Heart}
        title="No Favorites"
        message="Add scripts to Favorites to find them here quickly."
      />
    );
  }
  return (
    <EmptyState
      Icon={Library}
      title="No Scripts"
      message="Create a script to start scraping."
    />
  );
}
