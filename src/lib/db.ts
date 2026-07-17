import { createClient, type Client } from "@libsql/client";
import { hashPassword } from "./password";

// Cached across warm invocations (and across dev-server hot-reloads) so we
// don't reconnect to Turso on every call.
const globalForDb = globalThis as unknown as { __atCrossroadsDb?: Promise<Client> };

export function getDb(): Promise<Client> {
  if (!globalForDb.__atCrossroadsDb) {
    globalForDb.__atCrossroadsDb = initDb();
  }
  return globalForDb.__atCrossroadsDb;
}

async function initDb(): Promise<Client> {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) {
    throw new Error("TURSO_DATABASE_URL environment variable is not set.");
  }

  const client = createClient({ url, authToken });

  await client.migrate([
    `CREATE TABLE IF NOT EXISTS episodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number TEXT NOT NULL,
      title TEXT NOT NULL,
      guest TEXT NOT NULL,
      duration TEXT NOT NULL,
      image TEXT NOT NULL,
      link TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    )`,
  ]);

  await seedAdminUser(client);
  await seedEpisodes(client);

  return client;
}

async function seedAdminUser(client: Client): Promise<void> {
  const result = await client.execute("SELECT COUNT(*) as count FROM admin_users");
  const count = Number(result.rows[0]?.count ?? 0);
  if (count > 0) return;

  const username = process.env.ADMIN_SEED_USERNAME;
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!username || !password) {
    console.warn(
      "[db] No admin_users exist and ADMIN_SEED_USERNAME/ADMIN_SEED_PASSWORD are not set — skipping admin seed."
    );
    return;
  }

  await client.execute({
    sql: "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
    args: [username, hashPassword(password)],
  });
}

async function seedEpisodes(client: Client): Promise<void> {
  const result = await client.execute("SELECT COUNT(*) as count FROM episodes");
  const count = Number(result.rows[0]?.count ?? 0);
  if (count > 0) return;

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

  await client.batch(
    seed.map((ep, index) => ({
      sql: "INSERT INTO episodes (number, title, guest, duration, image, link, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [ep.number, ep.title, ep.guest, ep.duration, ep.image, "", index + 1],
    })),
    "write"
  );
}
