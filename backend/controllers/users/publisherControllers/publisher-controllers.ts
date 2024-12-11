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
  COMPONENT_POST_MODAL_MAP,
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
        console.log(result);
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

//what if one of the component exist
export const createComponentPost = async (
  postObjectId: mongoose.Types.ObjectId,
  userObjectId: mongoose.Types.ObjectId,
  nameOfThePost: string,
  next: NextFunction,
  session: mongoose.ClientSession // Add session as a parameter
) => {
  try {
    // Create posts for all models in COMPONENT_POST_MODAL_MAP
    const postCreationPromises = Object.entries(COMPONENT_POST_MODAL_MAP).map(
      async ([key, model]) => {
        const schema = POST_PROMPT_SCHEMA[key];
        let dataJson: any;

        // Retry logic for postCreation
        for (let attempt = 0; attempt < 3; attempt++) {
          dataJson = await postCreation(nameOfThePost, schema, next);
          if (dataJson) break; // Exit retry loop if successful
          if (attempt === 2)
            throw new Error("Failed to create post data after 3 attempts");
        }

        console.log(dataJson);

        // Update or create post using session
        const updatedPost = await model.findByIdAndUpdate(
          postObjectId,
          {
            $set: {
              created_by: userObjectId,
              approved: true,
              ...dataJson,
            },
          },
          {
            new: true,
            upsert: true, // Create document if it doesn't exist
            session, // Include session for transactional consistency
          }
        );

        return updatedPost;
      }
    );

    await Promise.all(postCreationPromises);
  } catch (error) {
    console.error("Error in createComponentPost:", error);
    throw error; 
  }
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

  const session = await mongoose.startSession(); 
  session.startTransaction();

  try {
    const postId = await postIdGeneration(post_code);
    if (!postId) {
      throw new HttpError("Post Id generation failed, please try again.", 400);
    }

    const model = SECTION_POST_MODAL_MAP[sec];
    if (!model) {
      throw new HttpError(`No model found for the section: ${section}`, 400);
    }

    const existingPost = await model.findById(postId);
    if (existingPost) {
      throw new HttpError("Post already exists!", 400);
    }

    const postObjectId = new mongoose.Types.ObjectId(postId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const isComponentPostMissing = await Promise.all(
      Object.entries(COMPONENT_POST_MODAL_MAP).map(async ([key, model]) => {
        const localPost = await model.findById(postId);
        return !localPost;
      })
    ).then((results) => results.includes(true));

    if (isComponentPostMissing) {
      await createComponentPost(
        postObjectId,
        userObjectId,
        name_of_the_post,
        next,
        session 
      );
    }

    const schema = POST_PROMPT_SCHEMA[sec];
    const dataJson = await postCreation(name_of_the_post, schema, next);

    // Create the new post document
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
    await newPost.save({ session });

    // Update the PostModel
    const postInPostModel = await PostModel.findById(postId).session(session);

    if (postInPostModel) {
      await PostModel.updateOne(
        { _id: postId },
        { $set: { [`sections.${sec}`]: { exist: true, approved: false } } },
        { session }
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
      await newPostInPostModel.save({ session });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json({ postId, message: "Created new post successfully!" });
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating new post:", error);
    return next(new HttpError("Error occurred while creating new post.", 500));
  }
};
