import jwt from "jsonwebtoken";

interface User {
  userId: true;
  email: true;
  username: true;
}

export const generateToken = (user: User) => {
  return jwt.sign(user, process.env.JWT_SECRET_KEY as string);
};
