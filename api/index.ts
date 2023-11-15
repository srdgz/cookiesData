import { PrismaClient } from "@prisma/client";
import { ZenStackMiddleware } from "@zenstackhq/server/express";
import RestApiHandler from "@zenstackhq/server/api/rest";
import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { compareSync } from "bcryptjs";
import { withPresets } from "@zenstackhq/runtime";
import type { Request } from "express";
import swaggerUI from "swagger-ui-express";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();
app.use(express.json());
const prisma = new PrismaClient();
const apiHandler = RestApiHandler({ endpoint: "http://localhost:3000/api" });
const bcrypt = require("bcrypt");
const cors = require("cors");
const options = {
  customCssUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css",
};
const spec = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../cookies-api.json"), "utf8")
);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(spec, options));

app.use(
  cors({
    origin: "https://reimagined-barnacle-9px4vv77v7639x5x-5173.app.github.dev",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

function getUser(req: Request) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("TOKEN:", token);
  if (!token) {
    return undefined;
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return { id: decoded.sub };
  } catch {
    return undefined;
  }
}

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.users.findFirst({
    where: { email },
  });

  if (!user || !compareSync(password, user.password)) {
    res.status(401).json({ error: "Invalid credentials" });
  } else {
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET! as string);
    res.json({ user_id: user.id, email: user.email, token });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await prisma.users.findFirst({
      where: { email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    const token = jwt.sign(
      { sub: newUser.id },
      process.env.JWT_SECRET as string
    );
    res.json({ user_id: newUser.id, email: newUser.email, token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/users/:user_id/favorites", async (req, res) => {
  const { cookie_id } = req.body;
  const { user_id } = req.params;
  try {
    const user = getUser(req);
    if (!user || user.id !== parseInt(user_id, 10)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const newFavorite = await prisma.favorites.create({
      data: {
        user_id: user.id,
        cookie_id,
      },
    });
    return res.status(200).json(newFavorite);
  } catch (error) {
    console.error("Error adding favorite:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/users/:user_id/favorites/:favorite_id", async (req, res) => {
  const { user_id, favorite_id } = req.params;
  try {
    const user = getUser(req);
    if (!user || user.id !== parseInt(user_id, 10)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const existingFavorite = await prisma.favorites.findFirst({
      where: {
        id: parseInt(favorite_id, 10),
        user_id: user.id,
      },
    });
    if (!existingFavorite) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    await prisma.favorites.delete({
      where: {
        id: existingFavorite.id,
      },
    });
    return res.status(200).json({ message: "Favorite deleted successfully" });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use(
  "/api",
  ZenStackMiddleware({
    getPrisma: (req) => {
      return withPresets(prisma, { user: getUser(req) });
    },
    handler: apiHandler,
  })
);

export default app;
