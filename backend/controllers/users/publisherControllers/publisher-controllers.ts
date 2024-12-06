import validationError from "@controllers/controllersHelpers/validation-error";
import { NextFunction, Response, Request } from "express";
import {
  checkAuthorisedPublisher,
  modelMap,
  postIdGeneration,
} from "./publisher-controllers-utils";
import HttpError from "@utils/http-errors";
import mongoose from "mongoose";
import PostModel from "@models/post/post-model";
import { JWTRequest } from "@middleware/check-auth";

export const createNewPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);
  const { section, name_of_the_post, post_code } = req.body;
  const userId = (req as JWTRequest).userData.userId;
  checkAuthorisedPublisher(req, res, next);

  try {
    const postId = await postIdGeneration(post_code);
    if (!postId)
      return next(
        new HttpError("Post Id generation failed, please try again.", 400)
      );

    const model = modelMap[section];
    if (!model) {
      return next(
        new HttpError(`No model found for the section: ${section}`, 400)
      );
    }
    const post = await model.findById(postId);
    if (post) return next(new HttpError("Post already exist!", 400));

    const newPost = new model({
      _id: postId,
      name_of_the_post,
      created_by: new mongoose.Types.ObjectId(userId),
    });

    await newPost.save();

    const postInPostModel = await PostModel.findById(postId);

    if (postInPostModel) {
      await PostModel.updateOne(
        { _id: postId },
        { $set: { [`sections.${section}`]: { exist: true, approved: false } } }
      );
    } else {
      const newPostInPostModel = new PostModel({
        _id: postId,
        post_code,
        sections: {
          [section]: {
            exist: true,
            approved: false,
          },
        },
      });
      await newPostInPostModel.save();
    }

    return res.status(201).json({ message: "Created new post successfully!" });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Error occurred while creating new post.", 500));
  }
};
