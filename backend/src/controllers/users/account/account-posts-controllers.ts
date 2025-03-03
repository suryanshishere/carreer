import { Response, NextFunction, Request } from "express";
import User from "@models/user/user_model";
import HttpError from "@utils/http-errors";
import mongoose from "mongoose";
import { getUserIdFromRequest, JWTRequest } from "@middleware/check-auth";
import POST_DB from "@models/post_models/posts_db";
import ContributionModel, {
  IContribution,
} from "@models/user/contribution-model";
import { validateContributionField } from "./account-controllers-utils";
import handleValidationErrors from "@controllers/sharedControllers/validation-error";
import UserModal from "@models/user/user_model";
import POSTS_POPULATE from "@models/post_models/posts_db/posts_populate.json";

const postSectionsArray = POST_DB.sections;

export const savedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as JWTRequest).userData.userId;

  try {
    const query = User.findById(userId).select("saved_posts -_id");

    postSectionsArray.forEach((section) => {
      query.populate({
        path: `saved_posts.${section}`,
        select: "post_code version",
        populate: POSTS_POPULATE.section_list_populate[section] || null,
      });
    });

    const userSavedPost = await query;

    if (!userSavedPost) {
      return next(new HttpError("No user saved post found!", 404));
    }

    return res.status(200).json({ data: userSavedPost });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Fetching saved posts failed, please try again.", 500)
    );
  }
};

export const bookmarkPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { section, post_id } = req.body;

    const userId = getUserIdFromRequest(req as JWTRequest);
    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError("User not found!", 404));
    }
    const currentPosts = user.saved_posts?.[section] || [];
    // Avoid bookmarking the same post_id if it's already present
    if (!currentPosts.includes(post_id)) {
      user.saved_posts = {
        ...user.saved_posts,
        [section]: [...currentPosts, post_id],
      };
      await user.save();
    }

    const message = user.isEmailVerified
      ? "Post bookmarked successfully!"
      : "Post bookmarked successfully! Verify your email to save it permanently.";

    return res.status(200).json({ message });
  } catch (error) {
    console.error("Error bookmarking post:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const unBookmarkPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { section, post_id } = req.body;

    const userId = getUserIdFromRequest(req as JWTRequest);
    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError("User not found!", 404));
    }

    const currentPosts = user.saved_posts?.[section] || [];
    // Remove the post_id from the saved posts if it exists
    const updatedPosts = currentPosts.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== post_id
    );

    if (updatedPosts.length < currentPosts.length) {
      user.saved_posts = {
        ...user.saved_posts,
        [section]: updatedPosts,
      };
      await user.save();

      return res.status(200).json({ message: "Post Un-bookmarked!" });
    } else {
      return next(new HttpError("Post not found in saved posts.", 404));
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Un-bookmarking failed, try again!" });
  }
};

export const myContribution = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as JWTRequest).userData.userId;
    const contributor: IContribution = await ContributionModel.findById(
      userId
    ).select("contribution approved updatedAt");

    if (!contributor) {
      return next(new HttpError("Contribution not found!", 404));
    }

    const { contribution, approved, updatedAt } = contributor;

    // Merge all approved data into a single object
    const mergedApprovedData: Record<string, any> = {};
    approved.forEach(({ data }) => {
      data.forEach((value, key) => {
        if (!mergedApprovedData[key]) {
          mergedApprovedData[key] = value;
        } else {
          mergedApprovedData[key] = { ...mergedApprovedData[key], ...value };
        }
      });
    });

    return res.status(200).json({
      data: {
        contribution,
        approved: mergedApprovedData,
      },
      metadata: {
        timeStamp: {
          updatedAt,
        },
      },
      message: "Contribution fetched successfully!",
    });
  } catch (error) {
    console.error("Error fetching contribution:", error);
    return next(
      new HttpError("Error fetching contribution, try again later!", 500)
    );
  }
};

export const contributeToPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleValidationErrors(req, next);
  let { data, section, post_code } = req.body;
  validateContributionField(req, next);

  const userId = (req as JWTRequest).userData.userId;
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // Start the transaction

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

export const deleteContribute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleValidationErrors(req, next);
  const { post_code, section } = req.body;
  const userId = (req as JWTRequest).userData.userId;

  try {
    const user = await ContributionModel.findById(userId);
    if (!user) {
      return next(
        new HttpError("User not found or has no contributions.", 404)
      );
    }

    if (!user.contribution.has(post_code)) {
      return next(new HttpError("No such contribution found!", 404));
    }

    const postData = user.contribution.get(post_code);
    if (!postData) {
      return next(new HttpError("No such contribution found!", 404));
    }
    const postObj = postData.toObject ? postData.toObject() : { ...postData };

    if (!(section in postObj)) {
      return next(new HttpError("No such contribution found!", 404));
    }

    // Delete the specified section
    delete postObj[section];

    // If the post object is now empty, remove the entire post_code key
    if (Object.keys(postObj).length === 0) {
      user.contribution.delete(post_code);
      user.markModified("contribution");
    } else {
      user.contribution.set(post_code, postObj);
      user.markModified(`contribution.${post_code}`);
    }

    await user.save();

    return res.status(200).json({ message: "Contribution deleted!" });
  } catch (error) {
    console.error("Error deleting contribution:", error);
    return next(
      new HttpError(
        "An internal server error occurred while deleting the contribution.",
        500
      )
    );
  }
};
