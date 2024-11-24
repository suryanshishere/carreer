import HttpError from "@utils/http-errors";
import { Request, Response, NextFunction } from "express";
import { expressjwt } from "express-jwt";

const JWT_KEY = process.env.JWT_KEY || "";

const checkAuth = expressjwt({
  secret: JWT_KEY,
  algorithms: ["HS256"],
  requestProperty: "userData",
  credentialsRequired: true, // Token is required
  getToken: (req) => req.headers["authorization"]?.split(" ")[1], // Extract token from Authorization header
}).unless({
  path: [
    { url: "/api", methods: ["GET"] },
    { url: "/api/home", methods: ["GET"] },
    { url: /^\/api\/category\/[^/]+$/, methods: ["GET"] }, // Match /api/category/:category
    { url: /^\/api\/category\/[^/]+\/[^/]+$/, methods: ["GET"] }, // Match /api/category/:category/:postId
    { url: "/api/user/auth", methods: ["POST"] },
    { url: "/api/user/auth/send-password-reset-link", methods: ["POST"] },
    { url: "/api/user/auth/reset-password", methods: ["POST"] },
    { url: /^\/api\/user\/auth\/reset-password\/[^/]+$/, methods: ["POST"] }, // Match /api/user/auth/reset-password/:userId
  ],
});

export default checkAuth;
export const jwtErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "UnauthorizedError") {
    // Respond with your custom HttpError
    return res.status(401).json({
      message: "Unauthorized user, please do login / signup!",
    });
  }
  next(err); // Pass other errors to the next error handler
};
