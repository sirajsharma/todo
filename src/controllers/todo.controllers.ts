import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Retrieves all todos belonging to the authenticated user.
 * @function
 * @async
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves with the retrieved todos.
 * @throws {Error} - Throws an error if something goes wrong while retrieving the todos.
 */
export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const todos = await prisma.todo.findMany({
      where: {
        belongsToId: req.user?.userId,
      },
      select: {
        todoId: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ data: todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Retrieves a single todo item by its ID.
 * @function
 * @async
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
 */
export const getTodoById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.findUnique({
      where: {
        todoId: id,
        belongsToId: req.user?.userId,
      },
      select: {
        todoId: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ data: todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Creates a new todo item.
 * @async
 * @function
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void|Response>} - A promise that resolves to void or a response object.
 */
export const createTodo = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { title, description } = req.body;

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        belongsTo: {
          connect: {
            userId: req.user?.userId,
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        todoId: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!todo) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    res.status(201).json({ data: todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Updates a todo item with the given id.
 * @async
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void|Response<{message: string;}>>} - A promise that resolves with void or a response object with a message property.
 */
export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void | Response<{
  message: string;
}>> => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updatePayload: {
      [key: string]: string | boolean | Date | undefined;
    } = {
      updatedAt: new Date(),
    };

    if (title) {
      updatePayload["title"] = title;
    }

    if (description) {
      updatePayload["description"] = description;
    }

    if (completed) {
      updatePayload["completed"] = completed;
    }

    const todo = await prisma.todo.update({
      where: {
        todoId: id,
        belongsToId: req.user?.userId,
      },
      data: updatePayload,
      select: {
        todoId: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(201).json({ data: todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Deletes a todo item with the specified ID belonging to the authenticated user.
 * @async
 * @function
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void | import('express').Response<Record<string, string>>>} - A Promise that resolves with void or an Express response object containing a message property.
 */
export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<void | Response<Record<string, string>>> => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.delete({
      where: {
        todoId: id,
        belongsToId: req.user?.userId,
      },
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
