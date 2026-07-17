import type { Row } from "@libsql/client";
import { getDb } from "./db";

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

// libsql Row objects aren't guaranteed plain objects (they support both
// array- and name-based access), so map them explicitly into plain objects
// — needed both for correctness and because React rejects non-plain objects
// crossing the Server -> Client Component boundary.
function toEpisode(row: Row): Episode {
  return {
    id: Number(row.id),
    number: String(row.number),
    title: String(row.title),
    guest: String(row.guest),
    duration: String(row.duration),
    image: String(row.image),
    link: String(row.link),
  };
}

export async function getEpisodes(): Promise<Episode[]> {
  const db = await getDb();
  const result = await db.execute(
    "SELECT id, number, title, guest, duration, image, link FROM episodes ORDER BY sort_order DESC"
  );
  return result.rows.map(toEpisode);
}

export async function getEpisodeById(id: number): Promise<Episode | undefined> {
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT id, number, title, guest, duration, image, link FROM episodes WHERE id = ?",
    args: [id],
  });
  return result.rows[0] ? toEpisode(result.rows[0]) : undefined;
}

export async function createEpisode(data: EpisodeInput): Promise<void> {
  const db = await getDb();
  const maxResult = await db.execute("SELECT MAX(sort_order) as maxOrder FROM episodes");
  const maxOrder = maxResult.rows[0]?.maxOrder;
  const nextOrder = (maxOrder == null ? 0 : Number(maxOrder)) + 1;

  await db.execute({
    sql: "INSERT INTO episodes (number, title, guest, duration, image, link, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
    args: [data.number, data.title, data.guest, data.duration, data.image, data.link, nextOrder],
  });
}

export async function updateEpisode(id: number, data: EpisodeInput): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: "UPDATE episodes SET number = ?, title = ?, guest = ?, duration = ?, image = ?, link = ? WHERE id = ?",
    args: [data.number, data.title, data.guest, data.duration, data.image, data.link, id],
  });
}

export async function deleteEpisode(id: number): Promise<void> {
  const db = await getDb();
  await db.execute({ sql: "DELETE FROM episodes WHERE id = ?", args: [id] });
}
