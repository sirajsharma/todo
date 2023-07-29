import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

import { encryptData } from "../utils/encryption";

const prisma = new PrismaClient();

const login = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = prisma.user.findUnique({
      where: {
        email,
        password: encryptData(password),
      },
      select: {
        userId: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return res.json({ message: "Invalid credentials" }).status(401);
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Something went wrong" }).status(500);
  }
};
