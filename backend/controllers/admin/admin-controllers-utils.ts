import AdminModel from "@models/admin/admin-model";
import HttpError from "@utils/http-errors";
import { NextFunction } from "express";

export const authorisedAdmin = async (userId: string, next: NextFunction) => {
  const admin = await AdminModel.findById(userId);

  if (!admin || admin.role != "admin") {
    return next(new HttpError("Access denied! Not authorized as admin.", 403));
  }
};
