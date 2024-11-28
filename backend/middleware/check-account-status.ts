import User, { IUser } from "@models/user/user-model";
import HttpError from "@utils/http-errors";
import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { getUserIdFromRequest } from "./check-auth";

const checkAccountStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserIdFromRequest(req);
    const user = await User.findById(userId);

    // If user is deactivated and the request is for account activation (POST)
    if (
      user &&
      req.originalUrl === "/api/user/account/activate-account" &&
      req.method === "POST"
    ) {
      if (!user.deactivated_at)
        return next(
          new HttpError("Your account is already being activated.", 400)
        );
      //todo: store the deactivate dates all the and find the gap between to stop the user mood swings
      user.deactivated_at = undefined;
      await user.save();

      return res.status(200).json({
        message: "Account successfully activated.",
      });
    } else if (user && user.deactivated_at) {
      res.setHeader("x-deactivated-at", user.deactivated_at.toISOString());
      if (
        req.method !== "GET" &&
        req.originalUrl &&
        !EXEMPT_URLS.includes(req.originalUrl)
      ) {
        return next(
          new HttpError(
            "Your account is deactivated. Please activate your account or login again.",
            403 // Forbidden
          )
        );
      }
    }else {
      // If the account is not deactivated, remove the deactivated header if set previously
      res.removeHeader("x-deactivated-at");
    }

    req.user = user;
    next();
    // Pass the user object to the next middleware or route handler
  } catch (error) {
    console.error(error);
    return next(
      new HttpError("An error occurred while checking account status.", 500)
    );
  }
};

export default checkAccountStatus;

//
const EXEMPT_URLS = ["/api/contact-us"];
