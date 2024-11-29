import HttpError from "@utils/http-errors";
import { Response, NextFunction } from "express";
import { expressjwt, Request } from "express-jwt";
import { isRegExp } from "lodash";

const JWT_KEY = process.env.JWT_KEY || "";

// Define paths that do not require authorization (excluded routes)
export const excludedPaths: (string | RegExp)[] = [
  "/api",
  "/api/user/auth",
  "/api/user/auth/reset-password",
  /^\/api\/user\/auth\/reset-password\/[^/]+$/, //TODO: regrex can be used to add check for mongodb id
];

// Define paths that optionally require authorization (only if token is present)
export const optionalPaths: (string | RegExp)[] = [
  "/api/public/home",
  /^\/api\/public\/category\/[^/]+$/,
  /^\/api\/public\/category\/[^/]+\/[^/]+$/,
  "/api/user/auth/send-password-reset-link",
  "/api/user/auth/send-verification-otp",
];


const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const checkAuth = expressjwt({
    secret: JWT_KEY,
    algorithms: ["HS256"],
    requestProperty: "userData",
    credentialsRequired: true, // Default: authorization required
    getToken: (req) => req.headers["authorization"]?.split(" ")[1],
  }).unless({
    path: excludedPaths,
  });

  checkAuth(req, res, (err: any) => {
    if (err) {
      const isOptionalRoute = optionalPaths.some((path) => {
        if (isRegExp(path)) {
          return path.test(req.path);
        } else if (typeof path === "string") {
          return req.path === path;
        }
        return false;
      });

      // Handle unauthorized errors for non-optional routes
      if (err.name === "UnauthorizedError" && !isOptionalRoute) {
        return next(
          new HttpError("Unauthorized user, please do login / signup!", 401)
        );
      }
    }
    next();
  });
};

export default checkAuth;

//for the optional path (that may have doubt of getting userid)
export const getUserIdFromRequest = (req: Request): string | undefined => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  return token && req.userData && req.userData.userId
    ? req.userData.userId
    : undefined;
};
