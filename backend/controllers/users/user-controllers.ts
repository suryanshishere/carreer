import { handleValidationErrors } from "@controllers/controllersUtils/validation-error";
import { JWTRequest } from "@middleware/check-auth";
import AdminModel from "@models/admin/admin-model";
import RequestModal from "@models/admin/request-model";
import { ADMIN_DATA } from "@shared/env-data";
import HttpError from "@utils/http-errors";
import { NextFunction, Request, Response } from "express";

export const reqAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleValidationErrors(req, next);

  const { userId } = (req as JWTRequest).userData;
  const { reason, role_applied } = req.body;

  try {
    let request = await RequestModal.findById(userId);

    //on frontend add warming for request to delete
    if (role_applied === "none") {
      if (!request) {
        //here this means that request will exist forever, and if deleted, then for sure admin will exist
        return next(new HttpError("No existing request found to delete.", 400));
      }

      await request.deleteOne();
      await AdminModel.findByIdAndDelete(userId);
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
        return next(
          new HttpError(
            `Your request application has already been rejected. Please try again after ${daysLeft} days.`,
            400
          )
        );
      }

      if (request.role_applied === role_applied)
        return next(
          new HttpError(
            "You already have the access you are applying for.",
            400
          )
        );

      request.role_applied = role_applied;
      request.status = "pending";
      await request.save();
    } else {
      await new RequestModal({
        _id: userId,
        reason,
        role_applied,
        user: userId,
        admin: userId,
      }).save();
    }

    return res.status(200).json({ message: "Request sent for approval!" });
  } catch (error) {
    console.error(error);
    return next(new HttpError("Failed to process access request.", 500));
  }
};
