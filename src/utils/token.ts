import jwt from "jsonwebtoken";

export const generateToken = (user: User | null) => {
  if (!user) throw new Error("User is null");

  return jwt.sign(user, process.env.JWT_SECRET_KEY as string);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY as string);
};
