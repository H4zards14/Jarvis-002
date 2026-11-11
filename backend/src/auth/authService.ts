import { pool } from "../config/database.js";
import { hashPassword, verifyPassword } from "./password.js";

export interface AuthUser {
  id: string;
  username: string;
}

export async function createAdminAccount(
  username: string,
  password: string,
): Promise<AuthUser> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Prevent simultaneous account creation requests.
    await client.query("SELECT pg_advisory_xact_lock(20261111)");

    const existing = await client.query("SELECT id FROM users LIMIT 1");

    if (existing.rows.length > 0) {
      throw new Error("An administrator account already exists.");
    }

    const passwordHash = await hashPassword(password);

    const result = await client.query(
      `INSERT INTO users (username, password_hash)
       VALUES ($1, $2)
       RETURNING id, username`,
      [username, passwordHash],
    );

    await client.query("COMMIT");

    return result.rows[0] as AuthUser;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<AuthUser | null> {
  const result = await pool.query(
    `SELECT id, username, password_hash
     FROM users
     WHERE username = $1`,
    [username],
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const passwordIsValid = await verifyPassword(password, user.password_hash);

  if (!passwordIsValid) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
  };
}
