import HttpError from "@utils/http-errors";
import { NextFunction, Response, Request } from "express";
import { excludedPaths, optionalPaths } from "./check-auth";
import { isRegExp } from "lodash";

const checkAccountStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => { 
  try {
    //todo: check for 30 days
    if (req.userData?.deactivated_at) {
      const isOptional = optionalPaths.some((path) => {
        if (isRegExp(path)) {
          return path.test(req.path);
        } else if (typeof path === "string") {
          return req.path === path;
        }
        return false;
      });

      const isExcluded = excludedPaths.some((path) => {
        if (isRegExp(path)) {
          return path.test(req.path);
        } else if (typeof path === "string") {
          return req.path === path;
        }
        return false;
      });

      if (!isExcluded && !isOptional) {
        return next(
          new HttpError(
            "Your account is deactivated, activate or login again.",
            403
          )
        );
      }
    }
    next();
  } catch (error) {
    return next(
      new HttpError("Checking account status failed, please try again.", 500)
    );
  }
};

export default checkAccountStatus;
