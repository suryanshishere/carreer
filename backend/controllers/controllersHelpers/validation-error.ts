import HttpError from "@utils/http-errors";
import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validationError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");
    return next(
      new HttpError(
        errorMessages !== "Invalid value" ? errorMessages : "Invalid inputs!",
        400
      )
    );
  }
};

export default validationError;
