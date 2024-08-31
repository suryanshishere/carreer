import { Request, Response, NextFunction } from "express";
import HttpError from "../../../utils/http-errors";
import AuthorisedAdmin from "@models/admin/authorisedAdmin";
import {
  modelSelector,
  sectionAdminModelSelector,
} from "@controllers/controllersHelpers/section-model-selector";
import validationError from "@controllers/controllersHelpers/validation-error";
import { sectionModelSchemaSelector } from "@controllers/controllersHelpers/section-model-schema-selector";
import updateMissingFields from "@controllers/controllersHelpers/update-ref-n-missing-field";
import generateUniqueId from "@controllers/controllersHelpers/generate-unique-id";
import addPostToAllSections from "@controllers/controllersHelpers/add-post-to-all-sections";

export const contributedPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);
  const { userid } = req.headers;
  const { post_section } = req.body;
  checkAuthorisedAdmin(userid, next);
  try {
    // Select the appropriate model based on the section
    const modelSelected = sectionAdminModelSelector(post_section, next);
    if (!modelSelected) {
      return next(new HttpError("Invalid post section selected.", 400));
    }

    // Find the contributed posts
    const contributedPosts = await modelSelected.find({
      approved: { $ne: true },
      name_of_the_post: { $exists: true, $ne: null }, // Check if 'name_of_the_post' exists and is not null
      post_code: { $exists: true, $ne: null },
    });

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
  checkAuthorisedAdmin(userid, next);

  try {
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
      new HttpError("An error occurred while approving the post.", 500)
    );
  }
};

export const createNewPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);
  const { post_section, name_of_the_post, post_code } = req.body;
  const { userid } = req.headers;
  checkAuthorisedAdmin(userid, next);
  try {
    const postId = generateUniqueId(post_code);

    const adminDataModelSelected = sectionAdminModelSelector(
      post_section,
      next
    );
    if (!adminDataModelSelected) {
      return next(new HttpError("Invalid post section selected.", 400));
    }

    const selectedPost = await adminDataModelSelected.findById(postId);
    if (selectedPost && selectedPost.name_of_the_post !== undefined) {
      //TODO: edits of the post (also the user can edits, delete there own contributes)
      return next(
        new HttpError(
          "Such post already exist, try editing the existed post.",
          400
        )
      );
    }

    //creating new post
    addPostToAllSections(post_section, name_of_the_post, post_code, next);

    return res.status(200).json({ message: "Created new post successfully!" });
  } catch (error) {
    return next(new HttpError("Error occured while creating new post.", 500));
  }
};

//locally helper function ------------------------

const checkAuthorisedAdmin = async (
  userid: string | string[] | undefined,
  next: NextFunction
) => {
  try {
    const user = await AuthorisedAdmin.findById(userid);
    if (!user) {
      return next(new HttpError("Unauthorized access.", 403));
    }
  } catch (error) {
    return next(
      new HttpError("Error occurred while finding an authorized admin!", 404)
    );
  }
  return;
};
