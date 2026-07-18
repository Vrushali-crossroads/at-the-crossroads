"use client";

import { useTransition } from "react";
import { deleteEpisodeAction } from "../../actions";

export default function DeleteEpisodeButton({
  id,
  title,
}: Readonly<{ id: number; title: string }>) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
          startTransition(() => {
            deleteEpisodeAction(id);
          });
        }
      }}
      className="cursor-pointer font-sans text-sm font-bold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
