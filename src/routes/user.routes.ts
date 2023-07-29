import { Router } from "express";

import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controllers";

const userRoutes = Router();

// Get all users
userRoutes.get("/user", getUsers);

// Get user by id
userRoutes.get("/user/:id", getUserById);

// Create user
userRoutes.post("/user", createUser);

// Update user
userRoutes.put("/user/:id", updateUser);

// Delete user
userRoutes.delete("/user/:id", deleteUser);

export default userRoutes;
