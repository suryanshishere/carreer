import { Request, Response, NextFunction } from "express";
import HttpError from "../../../utils/http-errors";
import AuthorisedAdmin from "@models/admin/authorisedAdmin";
import {
  modelSelector,
  sectionAdminModelSelector,
} from "@controllers/controllersHelpers/section-model-selector";
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
    const modelSelected = sectionAdminModelSelector(post_section, next);
    if (!modelSelected) {
      return next(new HttpError("Invalid post section selected.", 400));
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

//TODO: verify that all the details are filled (while reference(if unfilled), add it as the as id of the post.).
export const approvePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);

  const { post_section, postId } = req.body;
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
    else if (selectedPost.approved === true) {
      return next(new HttpError("Post is already approved.", 400));
    }

    // Approve the selected post
    selectedPost.approved = true;

    // Select the main model for the approved post
    const modelSelected = modelSelector(post_section, next);
    if (!modelSelected) {
      return next(new HttpError("Invalid post section selected.", 400));
    }

    const post = await modelSelected.findById(selectedPost._id);

    if (post) {
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
    console.log(err);
    return next(
      new HttpError("An error occurred while approving the post", 500)
    );
  }
};

