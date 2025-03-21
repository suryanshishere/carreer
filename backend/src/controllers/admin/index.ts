import { NextFunction, Request, Response } from "express";
import HttpError from "@utils/http-errors";
import handleValidationErrors from "@controllers/utils/validation-error";
import AdminModel from "@models/admin/Admin";
import RequestModal, { IRequest } from "@models/admin/Request";
import { generateJWTToken } from "@controllers/users/auth/auth-controllers-utils";

export const getRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, email, deactivated_at } = req.userData || {};
  try {
    const admin = await AdminModel.findById(userId).select("role");

    if (!userId || !email || !admin || !admin.role) {
      return next(new HttpError("Nothing to activate found!", 404));
    }

    const newToken = generateJWTToken(
      userId,
      email,
      admin.role,
      deactivated_at
    );

    return res.status(200).json({
      data: { role: admin.role },
      token: newToken,
      message: "Activated successfully!",
    });
  } catch (error) {
    return next(new HttpError("Internal server error!", 500));
  }
};

export const getReqAccessList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = handleValidationErrors(req, next);
    if (errors) return;

  const { status, role_applied } = req.body;

  try {
    const requestList = await RequestModal.find({
      status,
      role_applied,
    })
      .sort({ updatedAt: -1 })
      .populate({ path: "user", select: "email" });

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
  const errors = handleValidationErrors(req, next);
    if (errors) return;

  const session = await RequestModal.startSession();
  session.startTransaction();

  try {
    const { status, req_id, role_applied } = req.body;

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
      request.expireAt = undefined;
    }
    request.status = status;
    await request.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: `Status successfully updated to '${status}'.`,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating publisher access:", error);
    return next(new HttpError("Failed to handle access request.", 500));
  }
};
