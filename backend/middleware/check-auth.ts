import HttpError from "@utils/http-errors";
import { Request, Response, NextFunction } from "express";
import { expressjwt } from "express-jwt";

const JWT_KEY = process.env.JWT_KEY || "";

// Define paths that do not require authorization (excluded routes)
const excludedPaths = [
  "/api",
  "/api/user/auth",
  "/api/user/auth/reset-password",
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
  if (err.name === "UnauthorizedError") {
    // Check if the route is optional for token validation
    const isOptionalRoute = optionalPaths.some((path) => {
      // Use type guards to check the type of path
      if (isRegExp(path)) {
        return path.test(req.path); // Test the RegExp against the request path
      } else if (isString(path)) {
        return req.path === path; // Compare the string paths
      }
      return false; // If path is neither string nor RegExp, return false
    });

    // If it's an optional route, skip the error and allow the request to proceed without token
    if (isOptionalRoute) {
      return next(); // Proceed without setting userData
    }

    // Respond with a 401 Unauthorized error for non-optional routes
    return next(
      new HttpError("Unauthorized user, please do login / signup!", 401)
    );
  }
};

// Export the checkAuth middleware
export default checkAuth;
