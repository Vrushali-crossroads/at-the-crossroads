import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "./password";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Reused across hot-reloads in dev so we don't reopen the file on every edit.
const globalForDb = globalThis as unknown as { __atCrossroadsDb?: DatabaseSync };

export const db =
  globalForDb.__atCrossroadsDb ?? new DatabaseSync(path.join(dataDir, "app.db"));

if (process.env.NODE_ENV !== "production") {
  globalForDb.__atCrossroadsDb = db;
}

db.exec(`
  CREATE TABLE IF NOT EXISTS episodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT NOT NULL,
    title TEXT NOT NULL,
    guest TEXT NOT NULL,
    duration TEXT NOT NULL,
    image TEXT NOT NULL,
    link TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );
`);

migrateAddLinkColumn();
seedAdminUser();
seedEpisodes();

// Covers DBs created before the `link` column existed.
function migrateAddLinkColumn() {
  const columns = db.prepare("PRAGMA table_info(episodes)").all() as { name: string }[];
  const hasLink = columns.some((column) => column.name === "link");
  if (!hasLink) {
    db.exec("ALTER TABLE episodes ADD COLUMN link TEXT NOT NULL DEFAULT ''");
  }
}

function seedAdminUser() {
  const row = db.prepare("SELECT COUNT(*) as count FROM admin_users").get() as {
    count: number;
  };
  if (row.count > 0) return;

  const username = process.env.ADMIN_SEED_USERNAME;
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!username || !password) {
    console.warn(
      "[db] No admin_users exist and ADMIN_SEED_USERNAME/ADMIN_SEED_PASSWORD are not set — skipping admin seed."
    );
    return;
  }

  db.prepare("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)").run(
    username,
    hashPassword(password)
  );
}

function seedEpisodes() {
  const row = db.prepare("SELECT COUNT(*) as count FROM episodes").get() as {
    count: number;
  };
  if (row.count > 0) return;

  // Oldest first — sort_order is ascending by release, so newest ends up
  // with the highest sort_order (see getEpisodes(), which orders DESC).
  const seed = [
    {
      number: "EPISODE 01",
      title: "DJ Truth",
      guest: "with DJ Truth",
      duration: "41:12",
      image: "/images/episodes/strip-4.jpg",
    },
    {
      number: "EPISODE 02",
      title: "Inside the Life of a Ranji Player",
      guest: "with a Ranji Player",
      duration: "48:30",
      image: "/images/episodes/strip-3.jpg",
    },
    {
      number: "EPISODE 03",
      title: "You Are Being Hacked",
      guest: "with an Ethical Hacker",
      duration: "55:05",
      image: "/images/episodes/strip-2.jpg",
    },
    {
      number: "EPISODE 04",
      title: "Surviving the Film Industry",
      guest: "with a Bollywood Insider",
      duration: "1:02:18",
      image: "/images/episodes/strip-1.jpg",
    },
    {
      number: "EPISODE 06",
      title: "Inside the Life of a Veterinarian",
      guest: "with Dr. Sahil More",
      duration: "52:42",
      image: "/images/episodes/episode-06.jpg",
    },
    {
      number: "EPISODE 08",
      title: "The Cost of Animal Rescue — 350 Animals, Zero Help",
      guest: "with Vikash Bafna",
      duration: "1:17:04",
      image: "/images/episodes/episode-08.jpg",
    },
    {
      number: "EPISODE 09",
      title: "Leadership Starts From Within — Fix This Before You Lead",
      guest: "with Ravi Pratap",
      duration: "59:50",
      image: "/images/episodes/episode-09.jpg",
    },
  ];

  const insert = db.prepare(
    "INSERT INTO episodes (number, title, guest, duration, image, link, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  seed.forEach((ep, index) => {
    insert.run(ep.number, ep.title, ep.guest, ep.duration, ep.image, "", index + 1);
  });
}
