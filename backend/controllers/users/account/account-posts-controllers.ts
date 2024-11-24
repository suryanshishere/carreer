import { Response, NextFunction } from "express";
import User, { allowedPostFields } from "@models/user/user-model";
import { Request } from "express-jwt";
import HttpError from "@utils/http-errors";
import validationError from "@controllers/controllersHelpers/validation-error";

export const savedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.userData;

  try {
    const user = await User.findById(userId).populate([
      "savedPosts.answerKeyRef",
      "savedPosts.admitCardRef",
      "savedPosts.latestJobRef",
      "savedPosts.admissionRef",
      "savedPosts.certificateRef",
      "savedPosts.postImportantRef",
      "savedPosts.syllabusRef",
      "savedPosts.resultRef",
    ]);

    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error fetching saved posts:", error);
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
    // Validate input
    const { category, post_id } = req.body;

    const fieldName = `${category.replace(
      /_([a-z])/g,
      (match: string, letter: string) => letter.toUpperCase()
    )}Ref`;
    
    if (!allowedPostFields.includes(fieldName)) {
      return res.status(400).json({ message: "Invalid category provided." });
    }

    const userId = req.userData.userId;
    // Update the user's savedPosts
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }


    const currentPosts = user.savedPosts?.[fieldName] || [];
    //not do for the same post_id again if it's present
    if (!currentPosts.includes(post_id)) {
      user.savedPosts = {
        ...user.savedPosts,
        [fieldName]: [...currentPosts, post_id],
      };
      await user.save();
    }

    return res.status(200).json({ message: "Post bookmarked successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
