import { db } from "./db";

export type AdminUser = {
  id: number;
  username: string;
  passwordHash: string;
};

export function findAdminByUsername(username: string): AdminUser | undefined {
  return db
    .prepare(
      "SELECT id, username, password_hash as passwordHash FROM admin_users WHERE username = ?"
    )
    .get(username) as AdminUser | undefined;
}
