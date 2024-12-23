import { handleValidationErrors } from "@controllers/controllersUtils/validation-error";
import { JWTRequest } from "@middleware/check-auth";
import RequestModal from "@models/admin/request-model";
import HttpError from "@utils/http-errors";
import { NextFunction, Request, Response } from "express";

export const reqAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleValidationErrors(req, next);

  const { userId, email } = (req as JWTRequest).userData;
  const { reason, role_applied } = req.body;

  try {
    let request = await RequestModal.findById(userId).populate({
      path: "user",
      select: "role",
    });

    // @ts-ignore
    if (request && request.user.role === role_applied) {
      return next(new HttpError("You already have the access you are applying for.", 400));
    }

    if (role_applied === "none") {
      if (request) {
        await request.deleteOne();
        return res
          .status(200)
          .json({ message: "Request deleted successfully." });
      }

      return next(new HttpError("No request found!", 400));
    }

    if (!request) {
      await new RequestModal({
        _id: userId,
        email,
        reason,
        role_applied,
        user: userId,
        admin: userId,
      }).save();

      return res.status(200).json({ message: "Request sent for approval!" });
    }

    // twice request of the same role will remove admin and set to same role
    
    if (request.status === "rejected") {
      return next(
        new HttpError(
          "Your request has already been rejected, re-apply after 30 days!",
          400
        )
      );
    }

    if (request.status === "pending" && request.role_applied === role_applied) {
      return next(new HttpError("Request already sent!", 400));
    }

    if (
      (request.role_applied === "publisher" && role_applied === "approver") ||
      (request.role_applied === "approver" && role_applied === "publisher")
    ) {
      request.role_applied = "admin";
    } else {
      request.role_applied = role_applied;
      request.reason = reason;
    }

    await request.save();

    return res.status(200).json({ message: "Request sent for approval!" });
  } catch (error) {
    console.error(error);
    return next(new HttpError("Failed to process access request.", 500));
  }
};
