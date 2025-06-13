import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "1234",
  database: "login_system",
  waitForConnections: true,
  connectionLimit: 10,
});
