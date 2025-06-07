import express from "express";
import bcrypt from "bcrypt";
import { type User } from "./types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: { username: string };
}

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("Missing JWT secrets in .env file");
}

const users: User[] = [];
let refreshTokens: string[] = [];

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user: User = {
      username: req.body.username,
      password: hashedPassword,
    };

    users.push(user);
    res.status(201).send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post("/login", async (req, res): Promise<any> => {
  const username = req.body.username;
  const password = req.body.password;

  const user: User | undefined = users.find(
    (user) => user.username === username
  );

  if (!user) {
    res.status(400).send("Cannot find user");
    return;
  }

  console.log(username, " ", password);

  try {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = generateAccessToken({ username: user.username });
      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET as string
      );
      refreshTokens.push(refreshToken);
      return res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
      return res.status(403).send("Invalid password");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post("/logout", (req, res) => {
  const token = req.body.token;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.sendStatus(204);
});

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  console.log(refreshToken);
  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }

  if (!refreshTokens.includes(refreshToken)) {
    res.sendStatus(403);
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) {
        res.sendStatus(403);
        return;
      }
      const accessToken = generateAccessToken({ username: user.username });
      res.json({ accessToken: accessToken });
    }
  );
});

function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): any {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    }
  );
}

function generateAccessToken(user: { username: string }): string {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
}

export { router as authRouter, authenticateToken, users };
