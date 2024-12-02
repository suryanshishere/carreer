import { Response, NextFunction, Request } from "express";
import User from "@models/user/user-model";
import HttpError from "@utils/http-errors";
import mongoose from "mongoose";
import { JWTRequest } from "@middleware/check-auth";

export const savedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as JWTRequest).userData.userId;

  try {
    const userSavedPost = await User.findById(userId)
      .select("saved_posts -_id")
      .populate([
        "saved_posts.answer_key_ref",
        "saved_posts.admit_card_ref",
        "saved_posts.latest_job_ref",
        "saved_posts.admission_ref",
        "saved_posts.certificate_verification_ref",
        "saved_posts.important_ref",
        "saved_posts.syllabus_ref",
        "saved_posts.result_ref",
      ]);

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

    const user = (req as JWTRequest).user;

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

    const user = (req as JWTRequest).user;

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
