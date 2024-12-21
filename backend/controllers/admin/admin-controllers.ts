import { NextFunction, Request, Response } from "express";
import { JWTRequest } from "@middleware/check-auth";
import HttpError from "@utils/http-errors";
import PublisherModal from "@models/publisher-model";
import validationError from "@controllers/controllersUtils/validation-error";
import AdminModel from "@models/admin/admin-model";
import { validationResult } from "express-validator";

export const getPublisherAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as JWTRequest).userData.userId;
  const { status } = req.body;
  try {
    const admin = await AdminModel.findById(userId);
    if (!admin || !["handlePublisher", "ultimate"].includes(admin.status)) {
      return next(
        new HttpError("Access denied! Not authorized as admin.", 403)
      );
    }
    const pendingPublishers = await PublisherModal.find({
      status,
    }).select("-user -createdAt");

    if (!pendingPublishers || pendingPublishers.length === 0) {
      return next(new HttpError(`No ${status} publisher found!`, 404));
    }

    return res
      .status(200)
      .json({ data: pendingPublishers, message: "Fetched successfully!" });
  } catch (error) {
    return next(
      new HttpError("Failed to fetch pending publisher requests.", 500)
    );
  }
};

export const publisherAccessUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(validationError(errors), 400));
  }

  const userId = (req as JWTRequest).userData.userId;
  const { status } = req.body;
  try {
    //admin authorization check
    const admin = await AdminModel.findById(userId);
    if (!admin || !["handlePublisher", "ultimate"].includes(admin.status)) {
      return next(
        new HttpError("Access denied! Not authorized as admin.", 403)
      );
    }

    const publisher = await PublisherModal.findById(userId).populate({
      path: "user",
      select: "role",
    });
    if (!publisher) {
      return next(new HttpError("Publisher not found!", 404));
    }
    if (status === "rejected") {
      publisher.expire_at = new Date(); // Remove the doc after 30 days
      await publisher.save();
      return res
        .status(200)
        .json({ message: "Publisher request rejected and removed!" });
    }
    if (publisher.status === status) {
      return next(
        new HttpError("Status is already set to the requested value.", 400)
      );
    }
    if (status === "approved") {
      const user = publisher.user as any;
      user.role = "publisher";
      await user.save(); // Update user role to publisher
    }

    publisher.status = status;
    await publisher.save();
    return res.status(200).json({ message: "Publisher request approved!" });
  } catch (error) {
    return next(new HttpError("Failed to handle publisher request.", 500));
  }
};
