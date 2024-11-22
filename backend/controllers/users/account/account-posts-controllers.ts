import { Response, NextFunction } from "express";
import User from "@models/user/user-model";
import { Request } from "express-jwt";
import HttpError from "@utils/http-errors";

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
