import { Request, Response, NextFunction } from "express";
import HttpError from "../util/http-errors";
import { validationResult } from "express-validator";

export const checkValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
};

export const handleUserNotFound = (next: NextFunction) => {
  return next(new HttpError("User not found, please log in again.", 401));
};

export const handleUserSignupRequired = (next: NextFunction) => {
  return next(new HttpError("User needs to sign up and verify email.", 401));
};

export const handleUnknownServerError = (next: NextFunction) => {
  return next(
    new HttpError("Unknown server error occurred, please try again.", 500)
  );
};
