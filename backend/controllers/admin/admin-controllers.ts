import { NextFunction, Request, Response } from "express";
import { JWTRequest } from "@middleware/check-auth";
import HttpError from "@utils/http-errors";
import { handleValidationErrors } from "@controllers/controllersUtils/validation-error";
import AdminModel, { IAdmin } from "@models/admin/admin-model";
import RequestModal from "@models/request-model";
import UserModal, { IUser } from "@models/user/user-model";

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
  const { status, req_id, role_applied } = req.body;

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

    const request = await RequestModal.findById(req_id).populate<{
      user: IUser;
      admin?: IAdmin;
    }>([
      {
        path: "user",
        select: "role",
      },
      {
        path: "admin",
        select: "admin_status role",
      },
    ]);

    if (!request || !request.user) {
      return next(new HttpError("Request or user not found!", 404));
    }

    if (request.status === status) {
      return next(new HttpError(`Request is already ${status}!`, 400));
    }

    if (status === "rejected") {
      await handleRejection(request, role_applied);
    } else if (status === "approved") {
      await handleApproval(request, role_applied, req_id);
    } else if (status === "pending") {
      await handlePending(request);
    }

    return res.status(200).json({
      message: `Publisher status successfully updated to '${status}'.`,
    });
  } catch (error) {
    console.error("Error updating publisher access:", error);
    return next(new HttpError("Failed to handle access request.", 500));
  }
};

const handleRejection = async (request: any, role_applied: string) => {
  if (
    request.role_applied === "publisher" ||
    request.role_applied === "approver"
  ) {
    if (request.admin) {
      await request.admin.deleteOne();
    }
    request.user.role = "none";
  } else if (request.role_applied === "admin") {
    if (role_applied === "publisher") {
      if (request.admin) {
        request.admin.role = "approver";
      }
      request.user.role = "approver";
    } else if (role_applied === "approver") {
      request.user.role = "publisher";
      if (request.admin) {
        request.admin.role = "publisher";
      }
    }

    await request.user.save();
    if (request.admin) {
      await request.admin.save();
    }
  } else if (request.role_applied === "none") {
    if (request.admin) {
      await request.admin.deleteOne();
    }
  }

  request.status = "rejected";
  request.expireAt = new Date();
  await request.save();
};

const handleApproval = async (request: any, role_applied: string, req_id: string) => {
  request.user.role = role_applied;
  request.role_applied = role_applied;
  if (request.admin) {
    request.admin.role = role_applied;
    await request.admin.save();
  } else {
    request.admin = req_id;
    await new AdminModel({
      email: request.email,
      user: req_id,
      _id: req_id,
      role: role_applied,
      admin_status: role_applied === "admin" ? "none" : undefined,
    }).save();
  }

  await request.save();
};

const handlePending = async (request: any) => {
  if (request.admin) {
    request.admin.role = "none";
    if (request.admin?.admin_status) {
      request.admin.admin_status = undefined;
    }
  }
  request.user.role = "none";
  request.role_applied = "none";
  request.status = "pending";

  await request.save();
};
