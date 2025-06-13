import express from "express";
import bcrypt from "bcrypt";
import { type User } from "../../shared/types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import {
  getUser,
  insertToken,
  insertUser,
  deleteToken,
  includesToken,
} from "./userService";

interface AuthenticatedRequest extends Request {
  user?: { username: string };
}

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("Missing JWT secrets in .env file");
}

const router = express.Router();

router.post("/register", async (req, res): Promise<any> => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const existingUser = await getUser(username);
    if (existingUser) {
      return res.status(409).send("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = {
      id: NaN,
      username,
      hashedPassword,
      score: 0,
    };

    try {
      await insertUser(user);
      res.status(201).send("User registered successfully");
    } catch (insertErr) {
      console.error(insertErr);
      res.status(500).send("Failed to register user");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res): Promise<any> => {
  const username = req.body.username;
  const password: string = req.body.password;

  const user: User | null = await getUser(username);
  if (!user) {
    res.status(400).send("Cannot find user");
    return;
  }

  try {
    if (await bcrypt.compare(password, user.hashedPassword)) {
      const accessToken = generateAccessToken({ userId: user.id });
      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET as string
      );

      await insertToken(refreshToken, user.id);
      return res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
      return res.status(403).send("Invalid password");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post("/logout", async (req, res) => {
  const token = req.body.token;
  await deleteToken(token);
  res.sendStatus(204);
});

router.post("/token", async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (!refreshToken) {
      res.sendStatus(401);
      return;
    }

    if (!(await includesToken(refreshToken))) {
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
        const accessToken = generateAccessToken({ userId: user.id });
        res.json({ accessToken: accessToken });
      }
    );
  } catch (err) {
    console.log(err);
  }
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

function generateAccessToken(user: { userId: number }): string {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15s",
  });
}

export { router as authRouter, authenticateToken };
