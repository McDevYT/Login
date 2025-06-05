import { pool } from "./db";

export async function insertUser(
  username: string,
  email: string,
  password: string
): Promise<void> {
  const query = "INSERT INTO users (username, email, password) VALUES (?,?,?)";
  await pool.execute(query, [email, username, password]);
}

export async function getUsers(): Promise<any[]> {
  const [rows] = await pool.execute("SELECT * FROM users");
  return rows as any[];
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
  await pool.execute("DELETE FROM users WHERE id = ?", [userId]);
}
