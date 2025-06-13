import express from "express";
import { type User, type UserData } from "../../shared/types";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { authenticateToken, authRouter } from "./auth";
import cors from "cors";
import { getUser } from "./userService";

interface AuthenticatedRequest extends Request {
  user?: { username: string };
}

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("Missing JWT secrets in .env file");
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use("/user", authRouter);

app.get(
  "/userdata",
  authenticateToken,
  async (req: AuthenticatedRequest, res): Promise<any> => {
    const user = await getUser(req.user?.username ?? "");
    console.log(req.user?.username);
    if (!user) {
      res.sendStatus(404);
      return;
    }

    const userData: UserData = {
      username: user.username,
      score: user.score,
    };
    res.json(userData);
  }
);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
