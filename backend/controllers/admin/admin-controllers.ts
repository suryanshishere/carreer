import { NextFunction, Request, Response } from "express";
import { JWTRequest } from "@middleware/check-auth";
import HttpError from "@utils/http-errors";
import { handleValidationErrors } from "@controllers/controllersUtils/validation-error";
import AdminModel from "@models/admin/admin-model";
import RequestModal, { IRequest } from "@models/admin/request-model";
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

  const session = await RequestModal.startSession();
  session.startTransaction();

  try {
    const userId = (req as JWTRequest).userData.userId;
    const { status, req_id, role_applied } = req.body;

    authorisedAdmin(userId, next);

    const request: IRequest | null = await RequestModal.findById(
      req_id
    ).session(session);

    if (!request) {
      await session.abortTransaction();
      session.endSession();
      return next(new HttpError("Request not found!", 404));
    }
    if (request.status === status) {
      await session.abortTransaction();
      session.endSession();
      return next(new HttpError(`Request is already ${status}!`, 400));
    }
    if (request.role_applied != role_applied) {
      await session.abortTransaction();
      session.endSession();
      return next(new HttpError("Role applied not match!", 400));
    }

    if (status === "rejected") {
      if (!request.expireAt) {
        request.expireAt = new Date();
      }
      await AdminModel.findByIdAndDelete(req_id).session(session);
    } else if (status === "approved") {
      if (request.expireAt) {
        request.expireAt = undefined;
      }

      const existingAdmin = await AdminModel.findById(req_id).session(session);
      if (existingAdmin) {
        existingAdmin.role = request.role_applied;
        await existingAdmin.save({ session });
      } else {
        await new AdminModel({
          user: req_id,
          _id: req_id,
          role: request.role_applied,
        }).save({ session });
      }
    } else {
      const existingAdmin = await AdminModel.findById(req_id).session(session);
      if (existingAdmin) {
        existingAdmin.role = "none";
        await existingAdmin.save({ session });
      }
    }
    request.status = status;
    await request.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      data: request,
      message: `Status successfully updated to '${status}'.`,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating publisher access:", error);
    return next(new HttpError("Failed to handle access request.", 500));
  }
};
