import { Request, Response, NextFunction } from "express";
import HttpError from "../utils/http-errors";
import { validationResult } from "express-validator";

// const checkValidationResult = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError("Invalid inputs passed, please check your data", 422)
//     );
//   }
// };

// export default checkValidationResult;

export const snakeToCamel = (snake: string): string =>
  snake
    .split("")
    .reduce(
      (prev: string, cur: string) =>
        cur === "_"
          ? prev
          : prev + ((prev && cur.toUpperCase()) || cur.toLowerCase()),
      ""
    );

export const camelToSnake = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
