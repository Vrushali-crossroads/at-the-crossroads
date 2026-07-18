"use client";

import { useActionState, useEffect } from "react";
import type { FormState } from "./actions";

export type EpisodeFormValues = {
  number: string;
  title: string;
  guest: string;
  duration: string;
  image: string;
  link: string;
};

export default function EpisodeForm({
  action,
  initialValues,
  submitLabel,
  onSuccess,
}: Readonly<{
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialValues?: EpisodeFormValues;
  submitLabel: string;
  onSuccess?: () => void;
}>) {
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    if (state?.success) onSuccess?.();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="number" className="font-sans text-[13px] font-bold text-ink/70">
          Episode number
        </label>
        <input
          id="number"
          name="number"
          defaultValue={initialValues?.number}
          placeholder="EPISODE 10"
          required
          className="rounded-lg border border-ink/15 bg-white px-3 py-2 font-sans text-[15px] text-ink outline-none focus:border-teal"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="duration" className="font-sans text-[13px] font-bold text-ink/70">
          Duration
        </label>
        <input
          id="duration"
          name="duration"
          defaultValue={initialValues?.duration}
          placeholder="45:30"
          required
          className="rounded-lg border border-ink/15 bg-white px-3 py-2 font-sans text-[15px] text-ink outline-none focus:border-teal"
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label htmlFor="title" className="font-sans text-[13px] font-bold text-ink/70">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={initialValues?.title}
          required
          className="rounded-lg border border-ink/15 bg-white px-3 py-2 font-sans text-[15px] text-ink outline-none focus:border-teal"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="guest" className="font-sans text-[13px] font-bold text-ink/70">
          Guest
        </label>
        <input
          id="guest"
          name="guest"
          defaultValue={initialValues?.guest}
          placeholder="with Jane Doe"
          required
          className="rounded-lg border border-ink/15 bg-white px-3 py-2 font-sans text-[15px] text-ink outline-none focus:border-teal"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="link" className="font-sans text-[13px] font-bold text-ink/70">
          Episode link
        </label>
        <input
          id="link"
          name="link"
          type="url"
          defaultValue={initialValues?.link}
          placeholder="https://youtube.com/watch?v=..."
          className="rounded-lg border border-ink/15 bg-white px-3 py-2 font-sans text-[15px] text-ink outline-none focus:border-teal"
        />
        <p className="font-sans text-xs text-ink/50">
          Where visitors go to watch/listen. Optional.
        </p>
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label htmlFor="imageFile" className="font-sans text-[13px] font-bold text-ink/70">
          Cover image
        </label>
        {initialValues?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={initialValues.image}
            alt=""
            className="h-24 w-24 rounded-lg border border-ink/10 object-cover"
          />
        )}
        <input type="hidden" name="currentImage" defaultValue={initialValues?.image} />
        <input
          id="imageFile"
          name="imageFile"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          required={!initialValues?.image}
          className="rounded-lg border border-ink/15 bg-white px-3 py-2 font-sans text-[15px] text-ink outline-none file:mr-3 file:rounded-md file:border-0 file:bg-cream file:px-3 file:py-1.5 file:font-sans file:text-sm file:font-bold file:text-ink focus:border-teal"
        />
        <p className="font-sans text-xs text-ink/50">
          {initialValues?.image
            ? "Leave empty to keep the current image."
            : "JPEG, PNG, WebP, or GIF."}
        </p>
      </div>

      {state?.error && (
        <p role="alert" className="font-sans text-sm font-semibold text-red-600 sm:col-span-2">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-full bg-teal px-6 py-2.5 font-sans text-sm font-bold text-cream transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
