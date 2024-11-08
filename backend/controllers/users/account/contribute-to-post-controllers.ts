import HttpError from "@utils/http-errors";
import { Request, Response, NextFunction } from "express";
import mongoose, { Schema } from "mongoose";
import validationError from "@controllers/controllersHelpers/validation-error";
import { sectionAdminModelSelector } from "@controllers/controllersHelpers/section-model-selector";
import _ from "lodash";
import { sectionModelSchemaSelector } from "@controllers/controllersHelpers/section-model-schema-selector";

export const getUndefinedFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { post_section, post_id } = req.params;

  try {
    // Select the correct model based on post_section
    const modelSelected = sectionAdminModelSelector(post_section, next);
    if (!modelSelected) {
      return next(new HttpError("Model selection failed", 400));
    }

    // Find post details by post_id
    const postDetail = await modelSelected.findById(post_id);
    if (!postDetail) {
      return next(new HttpError("Post not found", 404));
    }

    if (!postDetail.name_of_the_post) {
      return next(new HttpError("Post not found", 404));
    }

    // Get the schema for the selected post_section
    const schema = sectionModelSchemaSelector(post_section, next);
    if (!schema) {
      return next(new HttpError("Schema selection failed", 400));
    }

    const undefinedFields: string[] = [];

    // Function to check if a value is empty
    function isEmpty(value: any): boolean {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" && Object.keys(value).length === 0)
      );
    }

    // Iterate through the schema and check for undefined or empty fields in postDetail
    Object.keys(schema.paths).forEach((field) => {
      // Use lodash to handle deep checking of nested fields
      const fieldValue = _.get(postDetail, field);
      if (isEmpty(fieldValue)) {
        // Extract the first-level key (before the first dot)
        const topLevelKey = field.split(".")[0];
        if (!undefinedFields.includes(topLevelKey)) {
          undefinedFields.push(topLevelKey);
        }
      }
    });

    const filteredUndefinedFields = undefinedFields.filter(
      (field) => field !== "createdAt" && field !== "updatedAt"
    );

    // Send undefined fields to the client
    res.status(200).json({
      message: "Undefined fields in post detail",
      undefinedFields: filteredUndefinedFields,
    });
  } catch (error) {
    next(new HttpError("Something went wrong", 500));
  }
};

export const contributeToPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);
  const { post_id, post_section, data } = req.body;
  const userid = req.headers.userid as string | undefined;

  try {
    const modelSelected = sectionAdminModelSelector(post_section, next);

    if (!modelSelected) {
      return next(new HttpError("Model selection failed", 400));
    }

    const postData = await modelSelected.findById(post_id);
    if (!postData) {
      return next(new HttpError("Post not found", 404));
    }

    const schema = sectionModelSchemaSelector(post_section, next);
    if (!schema) {
      return next(new HttpError("Schema selection failed", 400));
    }

    const originalPostData = _.cloneDeep(postData.toObject());

    updatePostData(postData, data);

    if (_.isEqual(originalPostData, postData.toObject())) {
      return res.status(200).json({
        message: "No changes were made to the post."
      });
    }

    let userId;
    try {
      userId = new mongoose.Types.ObjectId(userid);
    } catch (error) {
      return next(new HttpError("Invalid user ID", 400));
    }

    postData.contributors = postData.contributors || [];
    if (!postData.contributors.includes(userId)) {
      postData.contributors.push(userId);
      postData.last_updated = Date.now();
    }

    await postData.save();

    res.status(200).json({
      message: "Post updated successfully!"
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Contributing to post failed, please try again later", 500)
    );
  }
};

//not needed schema for validation, it work anyway!
const updatePostData = (postData: any, data: any) => {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (typeof data[key] === "object" && data[key] !== null) {
        if (!postData[key] || _.isEmpty(postData[key])) {
          postData[key] = data[key];
        } else {
          updatePostData(postData[key], data[key]);
        }
      } else {
        if (!postData[key] || postData[key] === "") {
          postData[key] = data[key];
        }
      }
    }
  }
};
