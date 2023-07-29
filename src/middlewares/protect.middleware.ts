import type { Request, Response, NextFunction } from "express";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  // Check if user is logged in
  // If user is logged in, call next()
  // If user is not logged in, send error
  next();
};
