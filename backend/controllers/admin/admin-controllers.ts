import { NextFunction, Request, Response } from "express";
import { JWTRequest } from "@middleware/check-auth";
import HttpError from "@utils/http-errors";
import { handleValidationErrors } from "@controllers/controllersUtils/validation-error";
import AdminModel, { IAdmin } from "@models/admin/admin-model";
import RequestModal, { IRequest } from "@models/admin/request-model";
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
    })
      .select("reason updatedAt _id")
      .sort({ updatedAt: -1 });

    if (!requestList || requestList.length === 0) {
      return next(new HttpError(`No ${status} ${role_applied} found!`, 404));
    }

    return res
      .status(200)
      .json({ data: requestList, message: "Fetched successfully!" });
  } catch (error) {
    return next(new HttpError("Failed to fetch requests.", 500));
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

    const request: IRequest | null = await RequestModal.findById(req_id);

    if (!request) {
      return next(new HttpError("Request not found!", 404));
    }
    if (request.status === status) {
      return next(new HttpError(`Request is already ${status}!`, 400));
    }
    if (request.role_applied != role_applied) {
      return next(new HttpError("Role applied not match!", 400));
    }

    if (status === "rejected") {
      await handleRejection(req, request);
    } else if (status === "approved") {
      await handleApproval(req_id, request);
    } else if (status === "pending" || status === "none") {
      await handlePending(request);
    }

    return res.status(200).json({
      data: request,
      message: `Status successfully updated to '${status}'.`,
    });
  } catch (error) {
    console.error("Error updating publisher access:", error);
    return next(new HttpError("Failed to handle access request.", 500));
  }
};

const handleRejection = async (req: Request, request: IRequest) => {
  const { status, req_id } = req.body;

  request.expireAt = new Date();
  request.status = status;

  await AdminModel.findByIdAndDelete(req_id);
  await request.save();

  // if (
  //   request.role_applied === "publisher" ||
  //   request.role_applied === "approver"
  // ) {
  //   request.user.role = "none";
  //   request.admin.role = "none";
  //   await AdminModel.findByIdAndDelete(request._id);
  // } else if (request.role_applied === "admin") {
  //   if (role_applied === "publisher") {
  //     if (request.admin) {
  //       request.admin.role = "approver";
  //     }
  //     request.user.role = "approver";
  //   } else if (role_applied === "approver") {
  //     request.user.role = "publisher";
  //     if (request.admin) {
  //       request.admin.role = "publisher";
  //     }
  //   }
  // } else if (request.role_applied === "none") {
  //   await AdminModel.findByIdAndDelete(request._id);
  // }

  // request.role_applied = role_applied;
  // request.status = "rejected";
  // request.expireAt = new Date();

  // await request.user.save();
  // await request.save();
};
//SESSIONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN
const handleApproval = async (req_id: string, request: IRequest) => {
  if (request.expireAt) {
    request.expireAt = undefined;
  }
  request.status = "approved";
  //TODO: REFACTOR SCOPE
  const existingAdmin = await AdminModel.findById(req_id);
  if (existingAdmin) {
    existingAdmin.role = request.role_applied;
   await existingAdmin.save()
  } else {
    await new AdminModel({
      user: req_id,
      _id: req_id,
      role: request.role_applied,
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
