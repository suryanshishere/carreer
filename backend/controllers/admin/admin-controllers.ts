import { NextFunction, Request, Response } from "express";
import { JWTRequest } from "@middleware/check-auth";
import HttpError from "@utils/http-errors";
import { handleValidationErrors } from "@controllers/controllersUtils/validation-error";
import AdminModel, { IAdmin } from "@models/admin/admin-model";
import RequestModal from "@models/admin/request-model";
import { IUser } from "@models/user/user-model";
import { IAdminData } from "@shared/type-check-data";
import { authorisedAdmin } from "./admin-controllers-utils";

export const getReqAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleValidationErrors(req, next);

  const userId = (req as JWTRequest).userData.userId;
  const { status, role_applied } = req.body;

  try {
    authorisedAdmin(userId, next);
    const requestList = await RequestModal.find({
      status,
      role_applied,
    }).select("-user -createdAt");

    if (!requestList || requestList.length === 0) {
      return next(new HttpError(`No ${status} ${role_applied} found!`, 404));
    }

    return res
      .status(200)
      .json({ data: requestList, message: "Fetched successfully!" });
  } catch (error) {
    return next(
      new HttpError("Failed to fetch requests.", 500)
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
    authorisedAdmin(userId, next);

    const request = await RequestModal.findById(req_id).populate<{
      user: IUser;
      admin: IAdmin;
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

    //rejected or approved with none have same features - refactor can happen
    if (status === "rejected") {
      await handleRejection(request, role_applied);
    } else if (status === "approved") {
      // if (request.expireAt) {
      //   return next(new HttpError("It's already being rejected!", 400));
      // }
      await handleApproval(request, role_applied, req_id);
    } else if (status === "pending" || status === "none") {
      await handlePending(request);
    }

    return res.status(200).json({
      data: request,
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
    request.user.role = "none";
    request.admin.role = "none";
    await AdminModel.findByIdAndDelete(request._id);
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
  } else if (request.role_applied === "none") {
    await AdminModel.findByIdAndDelete(request._id);
  }

  request.role_applied = role_applied;
  request.status = "rejected";
  request.expireAt = new Date();

  await request.user.save();
  await request.save();
};

const handleApproval = async (
  request: any,
  role_applied: string,
  req_id: string
) => {
  request.expireAt = undefined;

  request.user.role = role_applied;
  request.role_applied = role_applied;
  request.status = "approved";

  if (request.admin) {
    request.admin.role = role_applied;
    await request.admin.save();
  } else {
    request.admin = req_id;
    const existingAdmin = await AdminModel.findById(req_id);
    if (existingAdmin) {
      existingAdmin.role = role_applied as IAdminData["IRoleApplied"];
      // existingAdmin.admin_status =
      //   role_applied === "admin" ? "none" : undefined;
      await existingAdmin.save();
    } else {
      await new AdminModel({
        email: request.email,
        user: req_id,
        _id: req_id,
        role: role_applied,
        admin_status: role_applied === "admin" ? "none" : undefined,
      }).save();
    }
  }

  await request.user.save();
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
