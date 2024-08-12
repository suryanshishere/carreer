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

    export const convertToSnakeCase = (str: string): string => {
      // Convert camelCase, PascalCase, and other common cases to snake_case
      return str
        .replace(/([a-z])([A-Z])/g, "$1_$2")        // camelCase to snake_case
        .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")   // PascalCase to snake_case
        .replace(/[\s\-]+/g, '_')                   // Replace spaces and dashes with underscores
        .toLowerCase();                             // Convert to lowercase
    };
    
