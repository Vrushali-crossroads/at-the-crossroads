"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-8 shadow-lg"
    >
      <h1 className="font-serif text-2xl text-ink">Admin login</h1>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="font-sans text-[13px] font-bold text-ink/70">
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          className="rounded-lg border border-ink/15 px-3 py-2 font-sans text-[15px] text-ink outline-none focus:border-teal"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="font-sans text-[13px] font-bold text-ink/70">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-lg border border-ink/15 px-3 py-2 font-sans text-[15px] text-ink outline-none focus:border-teal"
        />
      </div>

      {state?.error && (
        <p role="alert" className="font-sans text-sm font-semibold text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 cursor-pointer rounded-full bg-teal px-6 py-2.5 font-sans text-sm font-bold text-cream transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
