import validationError from "@controllers/controllersHelpers/validation-error";
import { NextFunction, Response, Request } from "express";
import {
  checkAuthorisedPublisher,
  checkOverall,
  postIdGeneration,
} from "./publisher-controllers-utils";
import HttpError from "@utils/http-errors";
import mongoose from "mongoose";
import PostModel from "@models/post/post-model";
import { JWTRequest } from "@middleware/check-auth";
import postCreation from "./postCreation/postCreation";
import { snakeCase } from "lodash";
import {
  MODAL_MAP,
  SECTION_POST_MODAL_MAP,
} from "@controllers/shared/post-model-map";
import { POST_PROMPT_SCHEMA } from "./postCreation/post-prompt-schema";


export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.body;

  for (const [key, model] of Object.entries(MODAL_MAP)) {
    try {
      const result = await model.deleteOne({ _id: postId });
      if (result) {
        console.log(result)
        console.log(`Post deleted from ${key} model`);
      } else {
        console.log(`Post not found in ${key} model`);
      }
    } catch (error) {
      console.error(`Error deleting post from ${key} model: `, error);
    }
  }

  return res.status(200).json("completed!");
};

export const createNewPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);
  const { section, name_of_the_post, post_code } = req.body;
  const sec = snakeCase(section);
  const userId = (req as JWTRequest).userData.userId;
  checkAuthorisedPublisher(req, res, next);

  try {
    const postId = await postIdGeneration(post_code);
    if (!postId)
      return next(
        new HttpError("Post Id generation failed, please try again.", 400)
      );

    const model = SECTION_POST_MODAL_MAP[sec];
    if (!model) {
      return next(
        new HttpError(`No model found for the section: ${section}`, 400)
      );
    }

    //section model creation if not found
    const post = await model.findById(postId);
    if (post) return next(new HttpError("Post already exist!", 400));

    const postObjectId = new mongoose.Types.ObjectId(postId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    //todo: also if the ref is there already, use there date especially to make up the updatedAt field, making engagig name of the post as well

    // Check for any unfilled references before creating the post
    await checkOverall(postObjectId, userObjectId, name_of_the_post, next);
    // return res.status(200);

    const schema = POST_PROMPT_SCHEMA[sec];
    const dataJson = await postCreation(name_of_the_post, schema, next);

    const newPost = new model({
      _id: postObjectId,
      name_of_the_post,
      created_by: userObjectId,
      approved: true,
      common: postObjectId,
      important_dates: postObjectId,
      important_links: postObjectId,
      application_fee: postObjectId,
      ...dataJson,
    });

    await newPost.save();

    //post model update or creation
    const postInPostModel = await PostModel.findById(postId);

    //todo: multiple creater id adding left here
    if (postInPostModel) {
      await PostModel.updateOne(
        { _id: postId },
        { $set: { [`sections.${sec}`]: { exist: true, approved: false } } }
      );
    } else {
      const newPostInPostModel = new PostModel({
        _id: postObjectId,
        post_code,
        sections: {
          [sec]: {
            exist: true,
            approved: false,
          },
        },
      });
      await newPostInPostModel.save();
    }

    return res.status(201).json({ "postId": postId, message: "Created new post successfully!" });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Error occurred while creating new post.", 500));
  }
};
