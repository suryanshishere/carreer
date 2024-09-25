import HttpError from "@utils/http-errors";
import { Request, Response, NextFunction } from "express";
import mongoose, { Schema } from "mongoose";
import validationError from "../../controllersHelpers/validation-error";
import { sectionAdminModelSelector } from "@controllers/controllersHelpers/section-model-selector";
import _ from "lodash";
import { sectionModelSchemaSelector } from "@controllers/controllersHelpers/section-model-schema-selector";

export const postContributeToPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validationError(req, res, next);

    const { post_id, post_section, data } = req.body;
    const { userid } = req.headers;

    const modelSelected = sectionAdminModelSelector(post_section, next);

    if (!modelSelected) {
      return next(new HttpError("Model selection failed", 400));
    }

    const postData = await modelSelected.findById(post_id);
    if (!postData) {
      return next(new HttpError("Post not found", 404));
    }

    const originalPostData = _.cloneDeep(postData.toObject());

    postSectionDataHandler(postData, data);

    if (_.isEqual(originalPostData, postData.toObject())) {
      return res.status(200).json({
        message: "No changes were made to the post.",
        data: postData,
      });
    }

    // Convert userId string to ObjectId and add to contributors array

    if (typeof userid !== "string") {
      return next(
        new HttpError("User ID is required and must be a string", 400)
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userid);

    postData.contributors = postData.contributors || [];
    if (!postData.contributors.includes(userObjectId)) {
      postData.contributors.push(userObjectId);
      postData.last_updated = Date.now();
    }

    await postData.save();

    res.status(200).json({
      message: "Post updated successfully!",
      data: postData,
    });
  } catch (error) {
    console.log(error)
    return next(
      new HttpError("Contributing to post failed, please try again later.", 500)
    );
  }
};

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

    // Initialize an array to hold undefined fields
    const undefinedFields: string[] = [];

    // Iterate through the schema and check for undefined fields in postDetail
    Object.keys(schema.paths).forEach((field) => {
      if (postDetail[field] === undefined) {
        undefinedFields.push(field);
      }
    });

    // Send undefined fields to the client
    res.status(200).json({
      message: "Undefined fields in post detail",
      undefinedFields,
    });
  } catch (error) {
    next(new HttpError("Something went wrong", 500));
  }
};

//-----------------------------------------------------------------------------------------------

//Data coming from the user if contains the garbage key-value pair, it not added to the database while valid being get added.
//Definitely in future need improvement to tell the user or prevent the user if it's contain that garbage value or not.
function postSectionDataHandler(target: any, source: any): any {
  _.forOwn(source, (value, key) => {
    if (
      key === "_id" ||
      key === "name_of_the_post" ||
      key === "approved" ||
      key === "contributors"
    ) {
      return;
    }

    if (
      _.isUndefined(target[key]) ||
      target[key] === "" ||
      (Array.isArray(target[key]) && target[key].length === 0)
    ) {
      if (!_.isUndefined(value) && value !== "") {
        target[key] = value;
      }
    } else if (_.isPlainObject(target[key]) && !_.isEmpty(target[key])) {
      postSectionDataHandler(target[key], value);
    }
  });

  return target;
}
