import { Response, NextFunction } from "express";
import User, { allowedPostFields } from "@models/user/user-model";
import { Request } from "express-jwt";
import HttpError from "@utils/http-errors";
import { snakeCase } from "lodash";

export const savedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userData.userId;

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
    const { category, post_id } = req.body;

    const fieldName = `${snakeCase(category)}_ref`;

    if (!allowedPostFields.includes(fieldName)) {
      return res.status(400).json({ message: "Invalid category provided." });
    }

    const userId = req.userData.userId;
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const currentPosts = user.saved_posts?.[fieldName] || [];
    // Avoid bookmarking the same post_id if it's already present
    if (!currentPosts.includes(post_id)) {
      user.saved_posts = {
        ...user.saved_posts,
        [fieldName]: [...currentPosts, post_id],
      };
      await user.save();
    }

    return res.status(200).json({ message: "Post bookmarked successfully!" });
  } catch (error) {
    console.error("Error bookmarking post:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
