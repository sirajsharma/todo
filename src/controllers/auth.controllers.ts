import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

import { compareData, encryptData } from "../utils/encryption";
import { generateToken, verifyToken } from "../utils/token";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { userId: true, email: true, password: true, username: true },
    });

    if (!user) {
      return res.status(400).json({ message: "Email is not registered" });
    }

    if (!compareData(password, user.password)) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const token = generateToken({
      userId: user.userId,
      email: user.email,
      username: user.username,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({ data: { user: user.userId, username: user.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    if (!req.headers.cookie) {
      return res.status(400).json({ message: "User is not logged in" });
    }

    res.clearCookie("token").status(201).json({ message: "Logout success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, username } = req.body;

    const checkEmail = await prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });

    const checkUsername = await prisma.user.findUnique({
      where: { username },
      select: { username: true },
    });

    if (checkEmail && checkUsername) {
      return res
        .status(409)
        .json({ message: "Email and username already exist" });
    }

    if (checkEmail) {
      return res.status(409).json({ message: "Email already exist" });
    }

    if (checkUsername) {
      return res.status(409).json({ message: "Username already exist" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: encryptData(password),
        username,
      },
      select: {
        userId: true,
      },
    });

    if (!user) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    res.status(201).json({ message: "Register success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).json({ message: "User is not logged in" });
    }

    const decodedToken = verifyToken(token) as User;
    const newToken = generateToken({
      userId: decodedToken.userId,
      email: decodedToken.email,
      username: decodedToken.username,
    });

    res
      .cookie("token", newToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({ message: "Refresh token success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
