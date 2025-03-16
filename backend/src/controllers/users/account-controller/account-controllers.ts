import handleValidationErrors from "@controllers/utils/validation-error";

import AdminModel from "@models/admin/Admin";
import { ADMIN_DATA } from "@models/admin/db";
import RequestModal from "@models/admin/Request";
// import PostModel from "@models/post/post-model"; 
import HttpError from "@utils/http-errors";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

//TEMP: someone can send none, while expireAt active. to start new req to remove expireAt, but the person will have to loose earlier access then.

export const reqAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleValidationErrors(req, next);

  const { userId } = req.userData || {};
  const { reason, role_applied } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let request = await RequestModal.findById(userId).session(session);

    //revoke access management which user himself requested
    if (role_applied === "none") {
      if (!request) {
        await session.abortTransaction();
        session.endSession();
        //here this means that request will exist forever, and if deleted, then for sure admin will exist
        return next(new HttpError("No existing request found to delete.", 400));
      }

      await request.deleteOne({ session });
      await AdminModel.findByIdAndDelete(userId, { session });
      await session.commitTransaction();
      session.endSession();
      return res
        .status(200)
        .json({ message: "Request / Access deleted successfully." });
    }

    if (request) {
      if (request.expireAt) {
        const daysLeft = Math.ceil(
          (new Date(request.expireAt).getTime() +
            ADMIN_DATA.REQUEST_DOC_EXPIRY * 60 * 1000 -
            Date.now()) /
            (1000 * 3600 * 24)
        );
        await session.abortTransaction();
        session.endSession();
        return next(
          new HttpError(
            `Your request application has already been rejected. Please try again after ${daysLeft} days.`,
            400
          )
        );
      }

      if (request.role_applied === role_applied) {
        await session.abortTransaction();
        session.endSession();
        return next(
          new HttpError(
            "You already applied or have the access you are applying for.",
            400
          )
        );
      }

      request.role_applied = role_applied;
      request.status = "pending";
      await request.save({ session });
    } else {
      await new RequestModal({
        _id: userId,
        reason,
        role_applied,
        user: userId,
        admin: userId,
      }).save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: "Request sent for approval!" });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    return next(new HttpError("Failed to process access request.", 500));
  }
};
