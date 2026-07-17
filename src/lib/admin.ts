import { getDb } from "./db";

export type AdminUser = {
  id: number;
  username: string;
  passwordHash: string;
};

export async function findAdminByUsername(username: string): Promise<AdminUser | undefined> {
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT id, username, password_hash as passwordHash FROM admin_users WHERE username = ?",
    args: [username],
  });

  const row = result.rows[0];
  if (!row) return undefined;

  return {
    id: Number(row.id),
    username: String(row.username),
    passwordHash: String(row.passwordHash),
  };
}
