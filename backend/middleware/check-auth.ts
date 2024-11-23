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
    "/api",
    "/api/home",
    "/api/category/:category",
    "/api/category/:category/:postId",
    "/api/user/auth",
    "/api/user/auth/send-password-reset-link",
    "/api/user/auth/reset-password",
    "/api/user/auth/reset-password/:userId",
  ],
});

export default checkAuth;
export const jwtErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.log(req)
  if (err.name === "UnauthorizedError") {
    // Respond with your custom HttpError
    return res.status(401).json({
      message: "Unauthorized user, please do login / signup!",
    });
  }
  next(err); // Pass other errors to the next error handler
};