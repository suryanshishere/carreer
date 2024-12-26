import { NextFunction, Request, Response } from "express";
import { JWTRequest } from "@middleware/check-auth";
import HttpError from "@utils/http-errors";
import { handleValidationErrors } from "@controllers/shared/validation-error";
import AdminModel from "@models/admin/admin-model";
import RequestModal, { IRequest } from "@models/admin/request-model";
import { authorisedAdmin } from "./admin-controllers-utils";
import ContributionModel from "@models/user/contribution-model";

export const getRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as JWTRequest).userData.userId;
  try {
    const admin = await AdminModel.findById(userId).select("role");

    if (!admin || !admin.role) {
      return next(new HttpError("Nothing to activate found!", 404));
    }

    return res
      .status(200)
      .json({ data: { role: admin.role }, message: "Activated successfully!" });
  } catch (error) {
    return next(new HttpError("Internal server error!", 500));
  }
};

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

export const getContributionIds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await ContributionModel.aggregate([
      {
        // Step 1: Unwind the 'contribution' field to get individual contribution items
        $project: {
          contribution: { $objectToArray: "$contribution" }, // Convert the contribution object into an array of key-value pairs
        },
      },
      {
        // Step 2: Unwind the contribution array, so each contribution entry is a separate document
        $unwind: "$contribution",
      },
      {
        // Step 3: Group by the 'contribution.k' field (i.e., the contribution ID)
        $group: {
          _id: "$contribution.k", // The key of each contribution is the ID
          count: { $sum: 1 }, // Increment the count for each appearance of this ID
        },
      },
      {
        // Step 4: Sort by the count in descending order (most frequent to least frequent)
        $sort: { count: -1 },
      },
    ]);

    // If no contributions are found, return a 404 response
    if (!result.length) {
      return res.status(404).json({ message: "No contributions found." });
    }

    // Send the counted contribution IDs to the client
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching contribution IDs:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
