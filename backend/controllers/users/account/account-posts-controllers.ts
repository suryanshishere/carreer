import { Response, NextFunction } from "express";
import { Request } from "express-jwt";

export const savedPosts = (req: Request, res: Response, next: NextFunction) => {
  const {userId,email} = req.userData;

  return res.status(200).json({ message: "cool" });
};
