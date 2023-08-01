import { Router } from "express";

import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "../controllers/todo.controllers";

const todoRouter = Router();

// GET /todos
todoRouter.get("/todo", getTodos);

// GET /todo/:id
todoRouter.get("/todo/:id", getTodoById);

// POST /todo
todoRouter.post("/todo", createTodo);

// PUT /todo/:id
todoRouter.put("/todo/:id", updateTodo);

// DELETE /todo/:id
todoRouter.delete("/todo/:id", deleteTodo);

export default todoRouter;
