import { Response, NextFunction, Request } from "express";
import User from "@models/users/User";
import HttpError from "@utils/http-errors";
import mongoose from "mongoose";
import POST_DB, { ISectionKey } from "@models/posts/db";
import Contribution, { IContribution } from "@models/users/Contribution";
import { validateContributionField } from "./contribute-validation-utils";
import handleValidationErrors from "@controllers/utils/validation-error";
import UserModal from "@models/users/User";
import POSTS_POPULATE from "@models/posts/db/post-map/post-populate-map";
import { generatePostCodeVersion } from "@controllers/utils/contribute-utils";
import { getTagDateLinkRef } from "@controllers/posts/utils";

const postSectionsArray = POST_DB.sections;

export const savedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userData?.userId;

  try {
    const query = User.findById(userId).select("saved_posts");

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

    // Iterate over each section and add is_saved: true to each post item
    const userSavedPostObj = userSavedPost.toObject();
    if (userSavedPostObj.saved_posts) {
      Object.keys(userSavedPostObj.saved_posts).forEach((section) => {
        if (
          userSavedPostObj.saved_posts &&
          Array.isArray(userSavedPostObj.saved_posts[section])
        ) {
          userSavedPostObj.saved_posts[section] = userSavedPostObj.saved_posts[
            section
          ].map((post: any) => ({
            ...post,
            is_saved: true,
            ...getTagDateLinkRef(
              post.date_ref,
              section as ISectionKey,
              post.link_ref
            ),
            date_ref: undefined,
            link_ref: undefined,
          }));
        }
      });
    }

    return res.status(200).json({ data: userSavedPostObj });
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

    const userId = req.userData?.userId;
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

    const userId = req.userData?.userId;
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
    const userId = req.userData?.userId;
    const contributor: IContribution = await Contribution.findById(
      userId
    ).select("contribution approved disapproved updatedAt");

    if (!contributor) {
      return next(new HttpError("Contribution not found!", 404));
    }

    const { contribution, approved = [], disapproved = [], updatedAt } = contributor;

    // Merge all approved data into a single object
    const mergedApprovedData: Record<string, any> = {};
    const mergedDisapprovedData: Record<string, any> = {};

    const mergeData = (
      sourceArray: Array<{ data: Map<string, Record<string, any>> }>,
      targetObject: Record<string, any>
    ) => {
      sourceArray.forEach(({ data }) => {
        data.forEach((value, key) => {
          if (!targetObject[key]) {
            targetObject[key] = value;
          } else {
            targetObject[key] = { ...targetObject[key], ...value };
          }
        });
      });
    };

    // Merge approved data
    mergeData(approved, mergedApprovedData);

    // Merge disapproved data
    mergeData(disapproved, mergedDisapprovedData);

    return res.status(200).json({
      data: {
        contribution,
        approved: mergedApprovedData,
        disapproved: mergedDisapprovedData,
      },
      metadata: {
        updatedAt,
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
  const errors = handleValidationErrors(req, next);
  if (errors) return;
  let { data, section, post_code, version } = req.body;
  const postCodeVersion = generatePostCodeVersion(post_code, version);
  validateContributionField(req, next);

  const userId = req.userData?.userId;
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
      contribution = new Contribution({
        _id: userId,
        contribution: new Map(), // Initialize the contribution Map
      });
      user.contribution = userId;
      await user.save({ session });
    }

    // Ensure contribution.contribution is always a Map
    if (!(contribution.contribution instanceof Map)) {
      contribution.contribution = new Map();
    }

    //post code + __ + version
    const postContribution =
      contribution.contribution.get(postCodeVersion) || {};

    if (postContribution[section]) {
      postContribution[section] = {
        ...postContribution[section],
        ...data,
      };
    } else {
      postContribution[section] = data;
    }

    // Set the updated contribution back to the Map
    contribution.contribution.set(postCodeVersion, postContribution);

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
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
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
  const errors = handleValidationErrors(req, next);
  if (errors) return;
  const { post_code, version, section } = req.body;
  const postCodeVersion = generatePostCodeVersion(post_code, version);
  const userId = req.userData?.userId;

  try {
    const user = await Contribution.findById(userId);
    if (!user) {
      return next(
        new HttpError("User not found or has no contributions.", 404)
      );
    }

    if (!user.contribution.has(postCodeVersion)) {
      return next(new HttpError("No such contribution found!", 404));
    }

    const postData = user.contribution.get(postCodeVersion);
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
      user.contribution.delete(postCodeVersion);
      user.markModified("contribution");
    } else {
      user.contribution.set(postCodeVersion, postObj);
      user.markModified(`contribution.${postCodeVersion}`);
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
