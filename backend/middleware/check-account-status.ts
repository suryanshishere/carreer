import HttpError from "@utils/http-errors";
import { NextFunction, Response, Request } from "express";
import User, { IUser } from "@models/user/user-model";
import {
  excludedPaths,
  getUserIdFromRequest,
  JWTRequest,
  optionalPaths,
} from "./check-auth";
import { isRegExp } from "lodash";

const checkAccountStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserIdFromRequest(req as JWTRequest);
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      return next();
    }
    req.user = user;
    //todo: check for 30 days
    //append the res for deactivated account
    if (user && user.deactivated_at) {
      const originalSend = res.send;

      res.send = function (body: any) {
        const modifiedBody = {
          ...JSON.parse(body),
          deactivated_at: (req as JWTRequest).user.deactivated_at,
        };

        return originalSend.call(this, JSON.stringify(modifiedBody));
      };

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
