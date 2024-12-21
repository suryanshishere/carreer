import validationError from "@controllers/controllersUtils/validation-error";
import { JWTRequest } from "@middleware/check-auth";
import PublisherModal from "@models/publisher-model";
import UserModal from "@models/user/user-model";
import HttpError from "@utils/http-errors";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";



export const reqPublisherAccess = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(validationError(errors), 400));
    }
  
    const { userId, email } = (req as JWTRequest).userData;
    const { reason } = req.body;
    try {
      let publisher = await PublisherModal.findById(userId);
      if (publisher) {
        if (publisher.status === "approved") {
          return next(new HttpError("You are already approved!", 400));
        } else if (publisher.status === "rejected") {
          return next(new HttpError("Your request has already been rejected, re-apply after 30 days!", 400));
        }
        publisher.reason = reason;
      } else {
        const user = await UserModal.findById(userId);
        if (!user) {
          return next(new HttpError("User not found!", 404));
        }
        publisher = new PublisherModal({
          _id: user._id,
          reason,
          user: user._id,
          email,
        });
      }
      await publisher.save();
  
      return res.status(200).json({ message: "Request sent for approval!" });
    } catch (error) {
      console.log(error);
      return next(
        new HttpError("Failed to process publisher access request.", 500)
      );
    }
  };