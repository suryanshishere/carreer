import HttpError from "@utils/http-errors";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import validationError from "../validation-error";

export const postCreatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);

  return res.status(200).json("cool")
};
