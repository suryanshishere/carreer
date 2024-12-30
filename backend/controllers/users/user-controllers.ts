import validationError, {
  handleValidationErrors,
} from "@controllers/sharedControllers/validation-error";
import { JWTRequest } from "@middleware/check-auth";
import AdminModel from "@models/admin/admin-model";
import RequestModal from "@models/admin/request-model";
import PostModel from "@models/post/post-model";
import ContributionModel, {
  IContribution,
} from "@models/user/contribution-model";
import UserModal from "@models/user/user-model";
import { ADMIN_DATA } from "@shared/env-data";
import HttpError from "@utils/http-errors";
import { NextFunction, Request, Response } from "express";
import { snakeCase, upperCase } from "lodash";
import mongoose from "mongoose";

//TEMP: someone can send none, while expireAt active. to start new req to remove expireAt, but the person will have to loose earlier access then.

export const reqAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleValidationErrors(req, next);

  const { userId } = (req as JWTRequest).userData;
  const { reason, role_applied } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let request = await RequestModal.findById(userId).session(session);

    //revoke access management which user himself requested
    if (role_applied === "none") {
      if (!request) {
        await session.abortTransaction();
        session.endSession();
        //here this means that request will exist forever, and if deleted, then for sure admin will exist
        return next(new HttpError("No existing request found to delete.", 400));
      }

      await request.deleteOne({ session });
      await AdminModel.findByIdAndDelete(userId, { session });
      await session.commitTransaction();
      session.endSession();
      return res
        .status(200)
        .json({ message: "Request / Access deleted successfully." });
    }

    if (request) {
      if (request.expireAt) {
        const daysLeft = Math.ceil(
          (new Date(request.expireAt).getTime() +
            ADMIN_DATA.REQUEST_DOC_EXPIRY * 60 * 1000 -
            Date.now()) /
            (1000 * 3600 * 24)
        );
        await session.abortTransaction();
        session.endSession();
        return next(
          new HttpError(
            `Your request application has already been rejected. Please try again after ${daysLeft} days.`,
            400
          )
        );
      }

      if (request.role_applied === role_applied) {
        await session.abortTransaction();
        session.endSession();
        return next(
          new HttpError(
            "You already applied or have the access you are applying for.",
            400
          )
        );
      }

      request.role_applied = role_applied;
      request.status = "pending";
      await request.save({ session });
    } else {
      await new RequestModal({
        _id: userId,
        reason,
        role_applied,
        user: userId,
        admin: userId,
      }).save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: "Request sent for approval!" });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    return next(new HttpError("Failed to process access request.", 500));
  }
};

export const contributeToPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { data, section, post_code } = req.body;
  const userId = (req as JWTRequest).userData.userId;

  const session = await mongoose.startSession(); // Start the session

  try {
    session.startTransaction(); // Start the transaction

    handleValidationErrors(req, next);

    // Find the user and populate contribution field
    let user = await UserModal.findById(userId)
      .populate("contribution")
      .select("contribution")
      .session(session); // Use the session in the find query

    if (!user) return next(new HttpError("No user found!", 400));

    let contribution = user?.contribution as IContribution | undefined;

    // If no contribution exists for the user, create a new one
    if (!contribution) {
      contribution = new ContributionModel({
        _id: userId,
        contribution: new Map(), // Initialize the contribution Map
      });
      user.contribution = userId;
      await user.save({ session }); // Use the session in the save query
    }

    // Ensure contribution.contribution is always a Map
    if (!(contribution.contribution instanceof Map)) {
      contribution.contribution = new Map(); // Initialize it as a Map if not already
    }

    // Ensure the Map for the specific postCode exists
    const postContribution = contribution.contribution.get(post_code) || {};

    // If section is already present, merge data, else create a new entry
    if (postContribution[section]) {
      postContribution[section] = {
        ...postContribution[section], // Keep existing data
        ...data, // Add/Update new data
      };
    } else {
      postContribution[section] = data; // Create new section if not present
    }

    // Set the updated contribution back to the Map
    contribution.contribution.set(post_code, postContribution);

    // Save the contribution document
    await contribution.save({ session }); // Use the session in the save query

    // Commit the transaction if all operations were successful
    await session.commitTransaction();

    // End the session
    session.endSession();

    // Return a success response
    return res.status(200).json({
      message: "Contributed to post successfully",
    });
  } catch (error) {
    // If an error occurs, abort the transaction and roll back
    await session.abortTransaction();
    session.endSession();

    console.log(error);
    return next(new HttpError("An error occurred while contributing", 500));
  }
};
