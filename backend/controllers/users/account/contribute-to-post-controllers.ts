import HttpError from "@utils/http-errors";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import validationError from "../validation-error";
import sectionModelSelector from "@controllers/controllersHelpers/section-model-selector";
import { IPostDetail } from "@models/admin/IPostDetail";

function deepMergeUndefined(target: any, source: any): any {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      // If the target value is undefined, update it
      if (target[key] === undefined) {
        target[key] = source[key];
      } 
      // If the value is an object and not null, recursively merge
      else if (typeof target[key] === 'object' && target[key] !== null) {
        // If the value is an array and already defined, do not modify it
        if (Array.isArray(target[key])) {
          continue; // Skip the array if it exists
        } else {
          // Recursively merge for objects
          deepMergeUndefined(target[key], source[key]);
        }
      }
      // If the target value exists and is not undefined, leave it unchanged
    }
  }
  return target;
}



export const postContributeToPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Run the validation error handler
    validationError(req, res, next);

    const { postId, data } = req.body;
    const { userid } = req.headers;

    // Ensure that userid is a string
    if (typeof userid !== "string") {
      return next(
        new HttpError("User ID is required and must be a string", 400)
      );
    }

    // Convert userid to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userid);

    // Select the model based on post_section
    const modelSelected = sectionModelSelector(req, res, next);

    if (!modelSelected) {
      return next(new HttpError("Model selection failed", 400));
    }

    // Find the post by ID
    const postData = await modelSelected.findById(postId);
    if (!postData) {
      return next(new HttpError("Post not found", 404));
    }
    
    postData.data = deepMergeUndefined(postData.data, data);

    // Initialize the contributors array if it doesn't exist
    if (!postData.contributors) {
      postData.contributors = [];
    }

    // Add userObjectId to the contributors array if it's not already present
    if (!postData.contributors.includes(userObjectId)) {
      postData.contributors.push(userObjectId);
    }

    // Save the updated post
    await postData.save();

    // Return the updated post data
    res
      .status(200)
      .json({ message: "Post updated successfully", data: postData.data });
  } catch (error) {
    // Handle any errors
    return next(
      new HttpError("Contributing to post failed, please try again later.", 500)
    );
  }
};
