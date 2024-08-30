import { Request, Response, NextFunction } from "express";
import HttpError from "../../../utils/http-errors";
import AuthorisedAdmin from "@models/admin/authorisedAdmin";
import {
  modelSelector,
  sectionAdminModelSelector,
} from "@controllers/controllersHelpers/section-model-selector";
import validationError from "@controllers/controllersHelpers/validation-error";
import { sectionModelSchemaSelector } from "@controllers/controllersHelpers/section-model-schema-selector";
import updateMissingFields from "@controllers/controllersHelpers/updateMissingFields";

//TODO: Send only that data which is not approved and all the data is completed.
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
    const modelSelected = sectionAdminModelSelector(post_section, next);
    if (!modelSelected) {
      return next(new HttpError("Invalid post section selected.", 400));
    }

    // Find the contributed posts
    const contributedPosts = await modelSelected.find({ approved: { $ne: true } });

    // Respond with the found posts
    return res.status(200).json({ [post_section]: contributedPosts });
  } catch (err) {
    // Handle any unexpected errors
    return next(new HttpError("An error occurred while fetching posts", 500));
  }
};

export const approvePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);

  const { post_section, postId, approve_anyway } = req.body;
  const { userid } = req.headers;

  try {
    // Verify if the user is authorized
    const user = await AuthorisedAdmin.findById(userid);
    if (!user) {
      return next(new HttpError("Not an authorized admin!", 403));
    }

    // Select the appropriate admin data model based on the post section
    const adminDataModelSelected = sectionAdminModelSelector(
      post_section,
      next
    );
    if (!adminDataModelSelected) {
      return next(new HttpError("Invalid post section selected.", 400));
    }

    // Find the post to be approved
    const selectedPost = await adminDataModelSelected.findById(postId);
    if (!selectedPost) {
      return next(new HttpError("Selected post not found, try again.", 404));
    }
    //added this condition to prevent extra processing.
    if (selectedPost.approved === true) {
      return next(new HttpError("Post is already approved.", 400));
    }

    const schema = sectionModelSchemaSelector(post_section, next);
    if (!schema) {
      return next(new HttpError("Post schema not found, try again.", 404));
    }

    // Get schema fields
    const { updatedPost, missingFields } = updateMissingFields(
      schema,
      selectedPost,
      postId
    );

    // here saving make it save the recent all the correct updates, which can be used to update the main post
    await updatedPost.save();

    // Default approve_anyway to false if it's undefined
    const shouldApproveAnyway = approve_anyway ?? false;

    // Check if missing fields should trigger an error
    if (!shouldApproveAnyway && missingFields.length > 0) {
      return next(
        new HttpError(
          `Incomplete post: Missing fields ${missingFields.join(", ")}`,
          400
        )
      );
    }

    // Approve the selected post but not save it until and unless post is updated.
    selectedPost.approved = true;

    // Select the main model for the approved post
    const modelSelected = modelSelector(post_section, next);
    if (!modelSelected) {
      return next(new HttpError("Invalid post section selected.", 400));
    }

    const post = await modelSelected.findById(selectedPost._id);

    if (post) {
      await selectedPost.save();
      return next(new HttpError("Post is already approved.", 400));
    }

    // Create a new post in the main model with the approved data
    const newPost = new modelSelected(selectedPost.toObject());

    await newPost.save();

    //it's important that until the post is updated in main model, we don't update the approved field
    await selectedPost.save();

    return res
      .status(200)
      .json({ message: "Post approved and added successfully!" });
  } catch (err) {
    return next(
      new HttpError("An error occurred while approving the post", 500)
    );
  }
};
