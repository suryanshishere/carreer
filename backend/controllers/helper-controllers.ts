import { Request, Response, NextFunction } from "express";
import HttpError from "../util/http-errors";
import { validationResult } from "express-validator";

const checkValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
};

export default checkValidationResult;

