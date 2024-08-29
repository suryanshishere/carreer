import { Request, Response, NextFunction } from "express";
import HttpError from "../../../utils/http-errors";
import AuthorisedAdmin from "@models/admin/authorisedAdmin";
import sectionAdminModelSelector from "@controllers/controllersHelpers/section-model-selector";
import validationError from "@controllers/controllersHelpers/validation-error";

export const contributedPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);

  const { userid } = req.headers;
  const { post_section } = req.body;

  try {
    const user = await AuthorisedAdmin.findById(userid);
    if (!user) {
      return next(new HttpError("Not an authorized admin!", 403));
    }

    // Select the appropriate model based on the section
    const modelSelected = sectionAdminModelSelector(req, res, next);
    if (!modelSelected) {
      return next(new HttpError("Model selection failed", 400));
    }

    // Find the contributed posts
    const contributedPosts = await modelSelected.find();

    // Respond with the found posts
    return res.status(200).json({ [post_section]: contributedPosts });
  } catch (err) {
    // Handle any unexpected errors
    return next(new HttpError("An error occurred while fetching posts", 500));
  }
};
