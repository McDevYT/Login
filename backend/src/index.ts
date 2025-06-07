import express from "express";
import bcrypt from "bcrypt";
import { type User } from "./types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { authenticateToken, authRouter } from "./auth";

interface AuthenticatedRequest extends Request {
  user?: { username: string }; // or whatever you put into the token
}

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("Missing JWT secrets in .env file");
}

const app = express();
app.use(express.json());
app.use("/users", authRouter);

const users: User[] = [];
let refreshTokens: string[] = [];
const posts: { username: string; title: string }[] = [
  {
    username: "Kyle",
    title: "Hehe",
  },
  {
    username: "Bob",
    title: "bobby",
  },
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/posts", authenticateToken, (req: AuthenticatedRequest, res) => {
  res.json(posts.filter((post) => post.username === req.user?.username));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
