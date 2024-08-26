import HttpError from "@utils/http-errors";
import { Request, Response, NextFunction } from "express";
import mongoose, { Schema } from "mongoose";
import validationError from "../validation-error";
import sectionModelSelector from "@controllers/controllersHelpers/section-model-selector";
import {
  IPostImportant,
  IPostCommon,
} from "@models/post/post-section-interface";
import { postImportantSchema } from "@models/post/section/postImportant";
import { postCommonSchema } from "@models/post/section/postCommon";
import { admissionSchema } from "@models/post/section/postAdmission";
import { admitCardSchema } from "@models/post/section/postAdmitCard";
import { answerKeySchema } from "@models/post/section/postAnswerKey";
import { certificateVerificationSchema } from "@models/post/section/postCertificateVerification";
import { latestJobSchema } from "@models/post/section/postLatestJob";
import { resultSchema } from "@models/post/section/postResult";
import { syllabusSchema } from "@models/post/section/postSyllabus";

const schemaDefinitions: { [key: string]: Schema<any> } = {
  //using post schema instead of post admin Schema provide stoppage from manipulating the approved.
  PostImportantAdminData: postImportantSchema,
  PostCommonAdminData: postCommonSchema,
  AdmissionAdminData: admissionSchema,
  AdmitCardAdminData: admitCardSchema,
  AnswerKeyAdminData: answerKeySchema,
  CertificateVerificationAdminData: certificateVerificationSchema,
  LatestJobAdminData: latestJobSchema,
  ResultAdminData: resultSchema,
  SyllabusAdminData: syllabusSchema,
};

function deepMergeUndefined(
  target: any,
  source: any,
  schema: Schema<any>
): any {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      // Skip _id and name_of_the_post
      if (key === "_id" || key === "name_of_the_post" || key === "approved") {
        continue;
      }

      // Check if the key is valid in the schema
      // if (!schema.paths[key] ) {
      //   throw new HttpError(`Invalid field: ${key}`, 400);
      // }

      // If the target value is undefined, update it
      if (
        (target[key] === undefined || target[key] === "") &&
        (source[key] !== undefined || source[key] !== "")
      ) {
        target[key] = source[key];
      }
      // If the value is an object and not null, recursively merge
      else if (typeof target[key] === "object" && target[key] !== null) {
        // If the value is an array and already defined, do not modify it
        if (Array.isArray(target[key])) {
          continue; // Skip the array if it exists
        } else {
          // Recursively merge for objects
          deepMergeUndefined(target[key], source[key], schema);
        }
      }
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

    console.log(modelSelected.modelName);

    const schema = schemaDefinitions[modelSelected.modelName];
    if (!schema) {
      return next(new HttpError("Schema definition not found", 500));
    }

    // Find the post by ID
    let postData = await modelSelected.findById(postId);
    if (!postData) {
      return next(new HttpError("Post not found", 404));
    }

    postData = deepMergeUndefined(postData, data, schema);

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
      .json({ message: "Post updated successfully", data: postData });
  } catch (error) {
    // Handle any errors
    return next(
      new HttpError("Contributing to post failed, please try again later.", 500)
    );
  }
};
