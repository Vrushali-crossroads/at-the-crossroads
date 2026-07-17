"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { findAdminByUsername } from "@/lib/admin";
import { verifyPassword } from "@/lib/password";
import { createSession, destroySession, getSession } from "@/lib/session";
import {
  createEpisode,
  deleteEpisode,
  updateEpisode,
  type EpisodeInput,
} from "@/lib/episodes";
import { saveEpisodeImage } from "@/lib/uploads";

export type FormState = { error?: string; success?: true } | undefined;

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const admin = findAdminByUsername(username);
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return { error: "Invalid username or password." };
  }

  await createSession(admin.id);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

async function resolveEpisodeInput(formData: FormData): Promise<EpisodeInput> {
  const currentImage = String(formData.get("currentImage") ?? "").trim();
  const imageFile = formData.get("imageFile");

  let image = currentImage;
  if (imageFile instanceof File && imageFile.size > 0) {
    image = await saveEpisodeImage(imageFile);
  }

  return {
    number: String(formData.get("number") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    guest: String(formData.get("guest") ?? "").trim(),
    duration: String(formData.get("duration") ?? "").trim(),
    link: String(formData.get("link") ?? "").trim(),
    image,
  };
}

function validateEpisodeInput(data: EpisodeInput): string | null {
  if (!data.number || !data.title || !data.guest || !data.duration) {
    return "Number, title, guest, and duration are required.";
  }
  if (!data.image) {
    return "Please upload a cover image.";
  }
  return null;
}

function revalidateEpisodePages() {
  revalidatePath("/admin");
  revalidatePath("/admin/episodes");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/episodes");
}

export async function createEpisodeAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireSession();

  let data: EpisodeInput;
  try {
    data = await resolveEpisodeInput(formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save the uploaded image." };
  }

  const error = validateEpisodeInput(data);
  if (error) return { error };

  createEpisode(data);
  revalidateEpisodePages();
  return { success: true };
}

export async function updateEpisodeAction(
  id: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireSession();

  let data: EpisodeInput;
  try {
    data = await resolveEpisodeInput(formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save the uploaded image." };
  }

  const error = validateEpisodeInput(data);
  if (error) return { error };

  updateEpisode(id, data);
  revalidateEpisodePages();
  return { success: true };
}

export async function deleteEpisodeAction(id: number): Promise<void> {
  await requireSession();
  deleteEpisode(id);
  revalidateEpisodePages();
}
