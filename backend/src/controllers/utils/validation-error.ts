import HttpError from "@utils/http-errors";
import { NextFunction, Request } from "express";
import { validationResult } from "express-validator";

const validationError = (errors: any) => {
  const errorMessages = errors
    .array()
    .map((error: { msg: string }) => error.msg)
    .join(", ");
  return errorMessages !== "Invalid value" ? errorMessages : "Invalid inputs!";
};

const handleValidationErrors = (req: Request, next: NextFunction): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError(validationError(errors), 400));
    return true; // Indicate that an error was handled
  }
  return false;
};

export default handleValidationErrors;
