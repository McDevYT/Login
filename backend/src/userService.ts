import { User } from "types";
import { pool } from "./db";

export async function insertUser(user: User): Promise<void> {
  const query =
    "INSERT INTO user (username, hashed_password, score) VALUES (?,?,?)";
  await pool.execute(query, [user.username, user.hashedPassword, user.score]);
}

export async function insertToken(
  token: string,
  userId: number
): Promise<void> {
  const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
  const query =
    "INSERT INTO refreshtoken (token, user_id,created_at) VALUES (?,?,?)";
  await pool.execute(query, [token, userId, createdAt]);
}

import { RowDataPacket } from "mysql2";

export async function getUser(username: string): Promise<User | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM user WHERE username = ?",
    [username]
  );

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    username: row.username,
    hashedPassword: row.hashed_password,
    score: row.score,
  };
}

export async function updateUserEmail(
  userId: number,
  newEmail: string
): Promise<void> {
  await pool.execute("UPDATE users SET email = ? WHERE id = ?", [
    newEmail,
    userId,
  ]);
}

export async function deleteUser(userId: number): Promise<void> {
  await pool.execute("DELETE FROM user WHERE id = ?", [userId]);
}

export async function deleteToken(token: string): Promise<void> {
  await pool.execute("DELETE FROM refreshtoken WHERE token = ?", [token]);
}

export async function includesToken(token: string): Promise<boolean> {
  const [rows] = await pool.execute(
    "SELECT 1 FROM refreshtoken WHERE token = ? LIMIT 1",
    [token]
  );
  return Array.isArray(rows) && rows.length > 0;
}
