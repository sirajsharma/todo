import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

import { compareData, encryptData } from "../utils/encryption";
import { generateToken } from "../utils/token";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { userId: true, email: true, password: true, username: true },
    });

    if (!user) {
      return res.json({ message: "Email is not registered" }).status(400);
    }

    if (!compareData(password, user.password)) {
      return res.json({ message: "Password is incorrect" }).status(400);
    }

    const token = generateToken({
      userId: user.userId,
      email: user.email,
      username: user.username,
    });

    res
      .cookie("token", token, { httpOnly: true, secure: false })
      .json({ message: "Login success" });
  } catch (error) {
    console.error(error);
    res.json({ message: "Something went wrong" }).status(500);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    console.log("token: ", req.headers.cookie);
    if (!req.headers.cookie) {
      return res.json({ message: "User is not logged in" }).status(400);
    }

    res.clearCookie("token").json({ message: "Logout success" }).status(201);
  } catch (error) {
    console.error(error);
    res.json({ message: "Something went wrong" }).status(500);
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
        .json({ message: "Email and username already exist" })
        .status(409);
    }

    if (checkEmail) {
      return res.json({ message: "Email already exist" }).status(409);
    }

    if (checkUsername) {
      return res.json({ message: "Username already exist" }).status(409);
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
      return res.json({ message: "Something went wrong" }).status(500);
    }

    res.json({ message: "Register success" }).status(201);
  } catch (error) {
    console.error(error);
    res.json({ message: "Something went wrong" }).status(500);
  }
};
