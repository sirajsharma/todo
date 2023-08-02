import { Router } from "express";

import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controllers";

const authRoutes = Router();

authRoutes.post("/login", login);

authRoutes.post("/register", register);

authRoutes.post("/logout", logout);

authRoutes.get("/refresh-token", refreshToken);

export default authRoutes;
