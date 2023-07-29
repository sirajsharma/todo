import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { encryptData } from "../utils/encryption";

const prisma = new PrismaClient();

/**
 * Get all users from database
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete
 */
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        userId: true,
        name: true,
        email: true,
        username: true,
        createdAt: true,
        todos: true,
      },
    });

    res.json({ data: users }).status(200);
  } catch (error) {
    console.error(error);
    res.json({ message: "Something went wrong" }).status(500);
  }
};

/**
 * Retrieves a user by their ID.
 * @async
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>}
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        userId: id,
      },
      select: {
        userId: true,
        name: true,
        email: true,
        username: true,
        createdAt: true,
        todos: true,
      },
    });

    if (!user) {
      return res.json({ message: "User not found" }).status(404);
    }

    return res.json({ data: user }).status(200);
  } catch (error) {
    console.error(error);
    return res.json({ message: "Something went wrong" }).status(500);
  }
};

/**
 * Create a new user in database
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void|Response<{ message: string }>>} - A Promise that resolves when the operation is complete or a Response object with an error message
 */
export const createUser = async (
  req: Request,
  res: Response
): Promise<void | Response<{ message: string }>> => {
  try {
    const { name, email, password, username } = req.body;

    const isEmailExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      return res.json({ message: "Email already exist" }).status(409);
    }

    const isUsernameExist = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (isUsernameExist) {
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
        name: true,
        email: true,
        username: true,
        createdAt: true,
        todos: true,
      },
    });

    res
      .json({
        data: user,
      })
      .status(201);
  } catch (error) {
    console.error(error);
    res.json({ message: "Something went wrong" }).status(500);
  }
};

/**
 * Update a user in database by their ID
 * @async
 * @param req {Request} The request object
 * @param res {Response} The response object
 * @returns {Promise<void|Response<{ message: string }>>} - A Promise that resolves when the operation is complete or a Response object with an error message
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void | Response<{ message: string }>> => {
  try {
    const { id } = req.params;
    const { name = "", email = "", password = "", username = "" } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        userId: id,
      },
    });

    if (!user) {
      return res.json({ message: "User not found" }).status(404);
    }

    const isEmailExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExist && isEmailExist.userId !== id) {
      return res.json({ message: "Email already exist" }).status(409);
    }

    const isUsernameExist = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (isUsernameExist && isUsernameExist.userId !== id) {
      return res.json({ message: "Username already exist" }).status(409);
    }

    const updatedUser = await prisma.user.update({
      where: {
        userId: id,
      },
      data: {
        name: name || user.name,
        email: email || user.email,
        password: password ? encryptData(password) : user.password,
        username: username || user.username,
      },
      select: {
        userId: true,
        name: true,
        email: true,
        username: true,
        createdAt: true,
        todos: true,
      },
    });

    res.json({ data: updatedUser }).status(200);
  } catch (error) {
    console.error(error);
    res.json({ message: "Something went wrong" }).status(500);
  }
};

/**
 * Delete a user in database by their ID
 * @param req {Request}
 * @param res {Response}
 * @returns {Promise<void|Response<{ message: string }>>} - A Promise that resolves when the operation is complete or a Response object with an error message
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void | Response<{ message: string }>> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        userId: id,
      },
    });

    if (!user) {
      return res.json({ message: "User not found" }).status(404);
    }

    await prisma.user.delete({
      where: {
        userId: id,
      },
    });

    res.json({ message: "User deleted successfully" }).status(200);
  } catch (error) {
    console.error(error);
    res.json({ message: "Something went wrong" }).status(500);
  }
};
