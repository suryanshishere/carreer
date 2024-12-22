import { NextFunction, Request, Response } from "express";
import { JWTRequest } from "@middleware/check-auth";
import HttpError from "@utils/http-errors";
import { handleValidationErrors } from "@controllers/controllersUtils/validation-error";
import AdminModel from "@models/admin/admin-model";
import RequestModal from "@models/request-model";

export const getReqAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleValidationErrors(req, next);

  const userId = (req as JWTRequest).userData.userId;
  const { status, role_applied } = req.body;

  try {
    const admin = await AdminModel.findById(userId);
    if (
      !admin ||
      admin.role !== "admin" ||
      admin.admin_status === "none" ||
      (role_applied === "admin" && admin.admin_status !== "admin") ||
      (role_applied === "publisher" &&
        admin.admin_status !== "handlePublisher" &&
        admin.admin_status !== "admin") ||
      (role_applied === "approver" &&
        admin.admin_status !== "handleApprover" &&
        admin.admin_status !== "admin")
    ) {
      
      return next(
        new HttpError("Access denied! Not authorized as admin. ", 403)
      );
    }

    const pendingPublishers = await RequestModal.find({
      status,
      role_applied,
    }).select("-user -createdAt");

    if (!pendingPublishers || pendingPublishers.length === 0) {
      return next(new HttpError(`No ${status} ${role_applied} found!`, 404));
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

export const accessUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleValidationErrors(req, next);

  const userId = (req as JWTRequest).userData.userId;
  const { status, publisher_id } = req.body;

  // try {
  //   // Admin authorization check
  //   const admin = await AdminModel.findById(userId);
  //   if (!admin || ["none"].includes(admin.status)) {
  //     return next(
  //       new HttpError("Access denied! Not authorized as admin.", 403)
  //     );
  //   }

  //   // Validate publisher existence and populate related user data
  //   const publisher = await PublisherModal.findById(publisher_id).populate({
  //     path: "user",
  //     select: "role",
  //   });
  //   if (!publisher) {
  //     return next(new HttpError("Publisher not found!", 404));
  //   }
  //   // Prevent redundant updates
  //   if (publisher.status === status) {
  //     return next(
  //       new HttpError("Status is already set to the requested value.", 400)
  //     );
  //   }
  //   publisher.status = status;

  //   // Handle rejection: set an expiration date for automatic removal
  //   if (status === "rejected") {
  //     publisher.expireAt = new Date(); // Document will expire and be removed after TTL
  //     await publisher.save();
  //     return res.status(200).json({
  //       message: "Publisher request rejected.",
  //     });
  //   }

  //   // Handle approval: update user role and publisher status
  //   if (status === "approved") {
  //     const user = publisher.user as any; // Type assertion for `user` field
  //     if (user.role !== "publisher") {
  //       user.role = "publisher";
  //       await user.save(); // Update user's role to 'publisher'
  //     }
  //   }

  //   // Update publisher status
  //   await publisher.save();

  //   // Return a success response
  //   return res.status(200).json({
  //     message: `Publisher status successfully updated to '${status}'.`,
  //   });
  // } catch (error) {
  //   // Handle unexpected errors
  //   console.error("Error updating publisher access:", error);
  //   return next(new HttpError("Failed to handle publisher request.", 500));
  // }
};
