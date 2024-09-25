// import HttpError from "@utils/http-errors";
// import { Request, Response, NextFunction } from "express";
// import mongoose, { Schema } from "mongoose";
// import validationError from "../backend/controllers/controllersHelpers/validation-error";
// import { sectionAdminModelSelector } from "@controllers/controllersHelpers/section-model-selector";
// import _ from "lodash";
// import { sectionModelSchemaSelector } from "@controllers/controllersHelpers/section-model-schema-selector";

export const postContributeToPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // validationError(req, res, next);

    const { post_id, post_section, data } = req.body;
    const userid = req.headers.userid as string | undefined;

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
      message: "Post updated successfully!",
      data: postData,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Contributing to post failed, please try again later.", 500)
    );
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
