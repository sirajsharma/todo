import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import { verifyToken } from "../utils/token";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const prisma = new PrismaClient();

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jwtToken = req.cookies.token || "";

    if (!jwtToken) {
      return res.json({ message: "Not authorized" }).status(401);
    }

    const decodedToken = verifyToken(jwtToken) as User;

    const user = await prisma.user.findUnique({
      where: {
        userId: decodedToken.userId,
        email: decodedToken.email,
        username: decodedToken.username,
      },
      select: {
        userId: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return res.json({ message: "Not authorized" }).status(401);
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
