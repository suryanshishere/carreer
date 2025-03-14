import AdminModel from "@models/admin/Admin";
import { IRole } from "@models/admin/db";
import HttpError from "@utils/http-errors";
import { NextFunction, Request, Response } from "express";
import { JWTRequest } from "./check-auth";

const authorizeRoles = (allowedRoles: IRole[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as JWTRequest).userData?.userId;
      
      const adminUser = await AdminModel.findById(userId).select("role").exec();
      if (
        adminUser &&
        (adminUser.role === "admin" ||
          (allowedRoles.length && allowedRoles.includes(adminUser.role)))
      ) {
        return next();
      }

      return next(
        new HttpError("Not authorized, insufficient role permissions.", 403)
      );
    } catch (error) {
      next(error);
    }
  };
};

export default authorizeRoles;
