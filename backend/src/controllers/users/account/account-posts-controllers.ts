import { Response, NextFunction, Request } from "express";
import User from "@models/user/user-model";
import HttpError from "@utils/http-errors";
import mongoose from "mongoose";
<<<<<<< HEAD:backend/controllers/users/account/account-posts-controllers.ts
import { JWTRequest } from "@middleware/check-auth";
=======
import { getUserIdFromRequest, JWTRequest } from "@middleware/check-auth";
>>>>>>> user:backend/src/controllers/users/account/account-posts-controllers.ts
import { sectionListPopulate } from "@controllers/posts/postsControllersUtils/postPopulate/posts-populate";
import {
  COMMON_SELECT_FIELDS,
  sectionPostListSelect,
} from "@controllers/posts/postsControllersUtils/postSelect/sectionPostListSelect";
<<<<<<< HEAD:backend/controllers/users/account/account-posts-controllers.ts
import { postSectionsArray } from "@shared/post-array";
=======
import { POST_ENV_DATA } from "@shared/env-data";
import ContributionModel from "@models/user/contribution-model";

const postSectionsArray = POST_ENV_DATA.SECTIONS;
>>>>>>> user:backend/src/controllers/users/account/account-posts-controllers.ts

export const savedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as JWTRequest).userData.userId;

  try {
    const query = User.findById(userId).select("saved_posts -_id");

    postSectionsArray.forEach((section) => {
      const selectFields = [
        COMMON_SELECT_FIELDS,
        sectionPostListSelect[section] || "",
      ]
        .filter(Boolean)
        .join(" ");

      query.populate({
        path: `saved_posts.${section}`,
        select: selectFields,
        populate: sectionListPopulate[section] || null,
      });
    });

    const userSavedPost = await query;

    if (!userSavedPost) {
      return next(new HttpError("No user saved post found!", 404));
    }

    return res.status(200).json({ data: userSavedPost });
  } catch (error) {
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
    const contribution = await ContributionModel.findById(userId).select("contribution");

    if (!contribution) {
      return next(new HttpError("Contribution not found!", 404));
    }

    return res
      .status(200)
      .json({
        data: contribution,
        message: "Contribution fetched successfully!",
      });

  } catch (error) {
    console.error("Error fetching contribution:", error);
    return next(
      new HttpError("Error fetching contribution, try again later!", 500)
    );
  }
};
