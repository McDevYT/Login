import express from "express";
import bcrypt from "bcrypt";
import { type User } from "./types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: { username: string }; // or whatever you put into the token
}

dotenv.config();

const app = express();
app.use(express.json());

const users: User[] = [];
const refreshTokens: string[] = [];
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

app.post("/users/register", async (req, res) => {
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

app.post("/users/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user: User | undefined = users.find(
    (user) => user.username === username
  );

  if (!user) {
    res.status(400).send("Cannot find user");
    return;
  }

  try {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = generateAccessToken({ username: user.username });
      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET as string
      );
      refreshTokens.push(refreshToken);
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
      res.send("Not allowed");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  console.log(refreshToken);
  console.log(refreshTokens);
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
) {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
    return;
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

app.listen(3000);
