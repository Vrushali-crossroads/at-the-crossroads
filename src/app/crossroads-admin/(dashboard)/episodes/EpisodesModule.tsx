"use client";

import { useState } from "react";
import type { Episode } from "@/lib/episodes";
import Modal from "../../components/Modal";
import EpisodeForm from "../../EpisodeForm";
import { createEpisodeAction, updateEpisodeAction } from "../../actions";
import DeleteEpisodeButton from "./DeleteEpisodeButton";

type ModalState = { mode: "create" } | { mode: "edit"; episode: Episode } | null;

export default function EpisodesModule({
  episodes,
}: Readonly<{ episodes: Episode[] }>) {
  const [modalState, setModalState] = useState<ModalState>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Episodes</h1>
        <button
          type="button"
          onClick={() => setModalState({ mode: "create" })}
          className="cursor-pointer rounded-full bg-teal px-5 py-2.5 font-sans text-sm font-bold text-cream"
        >
          + Add episode
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[640px] text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wide text-ink/50">
              <th className="px-5 py-3">Image</th>
              <th className="px-5 py-3">Number</th>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Guest</th>
              <th className="px-5 py-3">Duration</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {episodes.map((ep) => (
              <tr key={ep.id} className="border-b border-ink/5 last:border-0">
                <td className="px-5 py-3">
                  {ep.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ep.image}
                      alt=""
                      className="h-9 w-16 rounded-md border border-ink/10 object-cover"
                    />
                  ) : (
                    <div className="h-9 w-16 rounded-md border border-dashed border-ink/15 bg-cream" />
                  )}
                </td>
                <td className="whitespace-nowrap px-5 py-3 font-bold text-teal">{ep.number}</td>
                <td className="px-5 py-3 text-ink">{ep.title}</td>
                <td className="px-5 py-3 text-ink/60">{ep.guest}</td>
                <td className="whitespace-nowrap px-5 py-3 text-ink/60">{ep.duration}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setModalState({ mode: "edit", episode: ep })}
                      className="cursor-pointer font-bold text-teal hover:underline"
                    >
                      Edit
                    </button>
                    <DeleteEpisodeButton id={ep.id} title={ep.title} />
                  </div>
                </td>
              </tr>
            ))}
            {episodes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/50">
                  No episodes yet — add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalState !== null}
        onClose={() => setModalState(null)}
        title={modalState?.mode === "edit" ? "Edit episode" : "Add episode"}
      >
        {modalState?.mode === "create" && (
          <EpisodeForm
            action={createEpisodeAction}
            submitLabel="Add episode"
            onSuccess={() => setModalState(null)}
          />
        )}
        {modalState?.mode === "edit" && (
          <EpisodeForm
            key={modalState.episode.id}
            action={updateEpisodeAction.bind(null, modalState.episode.id)}
            initialValues={modalState.episode}
            submitLabel="Save changes"
            onSuccess={() => setModalState(null)}
          />
        )}
      </Modal>
    </div>
  );
}
