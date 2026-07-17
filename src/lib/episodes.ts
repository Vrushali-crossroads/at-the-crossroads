import { db } from "./db";

export type Episode = {
  id: number;
  number: string;
  title: string;
  guest: string;
  duration: string;
  image: string;
  link: string;
};

export type EpisodeInput = {
  number: string;
  title: string;
  guest: string;
  duration: string;
  image: string;
  link: string;
};

// node:sqlite returns rows as null-prototype objects, which React rejects
// when passing data from a Server Component to a Client Component — spread
// them into plain objects here so every caller gets serializable data.

export function getEpisodes(): Episode[] {
  const rows = db
    .prepare(
      "SELECT id, number, title, guest, duration, image, link FROM episodes ORDER BY sort_order DESC"
    )
    .all() as Episode[];
  return rows.map((row) => ({ ...row }));
}

export function getEpisodeById(id: number): Episode | undefined {
  const row = db
    .prepare(
      "SELECT id, number, title, guest, duration, image, link FROM episodes WHERE id = ?"
    )
    .get(id) as Episode | undefined;
  return row ? { ...row } : undefined;
}

export function createEpisode(data: EpisodeInput): void {
  const row = db.prepare("SELECT MAX(sort_order) as maxOrder FROM episodes").get() as {
    maxOrder: number | null;
  };
  const nextOrder = (row.maxOrder ?? 0) + 1;

  db.prepare(
    "INSERT INTO episodes (number, title, guest, duration, image, link, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(data.number, data.title, data.guest, data.duration, data.image, data.link, nextOrder);
}

export function updateEpisode(id: number, data: EpisodeInput): void {
  db.prepare(
    "UPDATE episodes SET number = ?, title = ?, guest = ?, duration = ?, image = ?, link = ? WHERE id = ?"
  ).run(data.number, data.title, data.guest, data.duration, data.image, data.link, id);
}

export function deleteEpisode(id: number): void {
  db.prepare("DELETE FROM episodes WHERE id = ?").run(id);
}
