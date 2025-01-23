import { Request, Response, NextFunction } from "express";
import validationError from "@controllers/controllersUtils/validation-error";
import checkAuthorisedAdmin from "../adminControllersHelpers/check-authorised-admin";
import { sectionAdminModelSelector } from "@controllers/controllersUtils/controllersHelpers/section-model-selector";
import HttpError from "@utils/http-errors";

export const getAllPostAdminData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate the request for any errors
  const errors =validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(validationError(errors), 400));
    }

  const userid = req.headers.userid as string | undefined;
  const { post_section } = req.params;

  // Check if the admin is authorized
  checkAuthorisedAdmin(userid, next);

  try {
    // Select the appropriate model based on the post_section
    const modelSelected = sectionAdminModelSelector(post_section, next);

    // If model is selected, query the database
    if (modelSelected !== undefined) {
      const documents = await modelSelected
        .find({ name_of_the_post: { $exists: true, $ne: null } })
        .select("_id name_of_the_post")
        .sort({ last_updated: -1 }) // Adjust field as necessary (e.g., 'createdAt' or 'last_updated')
        .limit(15); // Limit the results to the latest 15 items

      // Send the result back to the client
      return res.status(200).json({ [post_section]: documents });
    } else {
      // If no model is found, respond with an error
      return res.status(400).json({ error: "Invalid post section" });
    }
  } catch (err) {
    // Handle any errors
    return next(err); // Forward error to the next middleware or error handler
  }
};

export const getEditPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate the request for any errors
  const errors =validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(validationError(errors), 400));
    }

  const userid = req.headers.userid as string | undefined;
  const { post_section, post_id } = req.params;

  // Check if the admin is authorized
  checkAuthorisedAdmin(userid, next);

  try {
    // Select the appropriate model based on the post_section
    const modelSelected = sectionAdminModelSelector(post_section, next);

    // If model is selected, query the database
    if (modelSelected !== undefined) {
      const documents = await modelSelected.findById(post_id);

      if (!documents) {
        return next(new HttpError("An error occurred while fetching posts", 500));
      }

      // Send the result back to the client
      return res.status(200).json(documents);
    } else {
      return next(new HttpError("Invalid post section", 400));
    }
  } catch (err) {
    return next(new HttpError("An error occurred while editing posts", 500));
  }
};
