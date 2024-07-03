import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HttpError from "../util/http-errors";

let JWT_KEY: string = process.env.JWT_KEY || "";

interface DecodedToken {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      userData?: { userId: string };
    }
  }
}

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token: string | undefined = req.headers.authorization?.split(" ")[1]; // Splitting and getting the token part
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken: DecodedToken | undefined = jwt.verify(
      token,
      JWT_KEY
    ) as DecodedToken | undefined;
    if (!decodedToken || typeof decodedToken.userId !== "string") {
      throw new Error("Invalid token payload!");
    }
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};

export default checkAuth;
