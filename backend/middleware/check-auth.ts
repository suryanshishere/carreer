import HttpError from "@utils/http-errors";
import { Response, NextFunction } from "express";
import { expressjwt, Request } from "express-jwt";

const JWT_KEY = process.env.JWT_KEY || "";

// Define paths that do not require authorization (excluded routes)
const excludedPaths = [
  "/api",
  "/api/user/auth",
  "/api/user/auth/reset-password",
  /^\/api\/user\/auth\/reset-password\/[^/]+$/, //TODO: regrex can be used to add check for mongodb id
];

// Define paths that optionally require authorization (only if token is present)
const optionalPaths = [
  "/api/home",
  /^\/api\/category\/[^/]+$/,
  /^\/api\/category\/[^/]+\/[^/]+$/,
  "/api/user/auth/send-password-reset-link",
  "/api/user/auth/send-verification-otp",
];

// Middleware to handle authorization
const checkAuth = expressjwt({
  secret: JWT_KEY,
  algorithms: ["HS256"],
  requestProperty: "userData", // Add user data to request if token is valid
  credentialsRequired: true, //default needed authorisation
  getToken: (req) => req.headers["authorization"]?.split(" ")[1], // Extract token from Authorization header
}).unless({
  path: excludedPaths, // These paths don't require token validation at all
});

// Error handler for JWT issues
function isRegExp(path: any): path is RegExp {
  return path instanceof RegExp;
}

// Type guard function to check if a path is a string
function isString(path: any): path is string {
  return typeof path === "string";
}

export const jwtErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isOptionalRoute = optionalPaths.some((path) => {
    if (isRegExp(path)) {
      return path.test(req.path);
    } else if (isString(path)) {
      return req.path === path;
    }
    return false;
  });

  if (err.name === "UnauthorizedError" && !isOptionalRoute) {
    return next(
      new HttpError("Unauthorized user, please do login / signup!", 401)
    );
  }

  return next();
};

export const getUserIdFromRequest = (req: Request): string | undefined => {
  // Extract token and user data, ensuring safety against invalid tokens or expired sessions.
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  return token && req.userData && req.userData.userId
    ? req.userData.userId
    : undefined;
};

// Export the checkAuth middleware
export default checkAuth;
