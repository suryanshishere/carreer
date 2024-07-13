import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HttpError from "../utils/http-errors";

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
    const token: string | undefined = req.headers.authorization?.split(" ")[1]; // Get the token part from Authorization header
    if (!token) {
      throw new Error("Authentication failed!");
    }
    
    const decodedToken = jwt.verify(token, JWT_KEY) as DecodedToken;
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
