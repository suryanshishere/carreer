import validationError from "@controllers/controllersUtils/validation-error";
import { NextFunction, Response, Request } from "express";
import {
  checkAuthorisedPublisher,
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
} from "@controllers/controllersUtils/post-model-map";
import { POST_PROMPT_SCHEMA } from "./postCreation/post-prompt-schema";
import { validationResult } from "express-validator";
import { dateRequiredMap } from "@controllers/posts/postsControllersUtils/post-sort-map";

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId, section } = req.body;

  if (!postId) {
    return res.status(400).json({ error: "postId is required" });
  }

  try {
    if (section) {
      // Check if the section exists in MODAL_MAP
      const model = MODAL_MAP[section];
      if (!model) {
        return res.status(400).json({ error: `Invalid section: ${section}` });
      }

      // Delete the post only from the specified section
      const result = await model.deleteOne({ _id: postId });
      if (result.deletedCount > 0) {
        console.log(`Post deleted from ${section} model`);
        return res
          .status(200)
          .json({ message: `Post deleted from ${section} model` });
      } else {
        console.log(`Post not found in ${section} model`);
        return res
          .status(404)
          .json({ error: `Post not found in ${section} model` });
      }
    } else {
      // If no section is specified, delete the post from all models
      for (const [key, model] of Object.entries(MODAL_MAP)) {
        try {
          const result = await model.deleteOne({ _id: postId });
          if (result.deletedCount > 0) {
            console.log(`Post deleted from ${key} model`);
          } else {
            console.log(`Post not found in ${key} model`);
          }
        } catch (error) {
          console.error(`Error deleting post from ${key} model: `, error);
        }
      }
      return res
        .status(200)
        .json({ message: "Post deletion process completed!" });
    }
  } catch (error) {
    console.error("Error in deletePost function:", error);
    return next(
      new HttpError("An error occurred while deleting the post", 500)
    );
  }
};

//what if one of the component exist
export const createComponentPost = async (
  postObjectId: mongoose.Types.ObjectId,
  userObjectId: mongoose.Types.ObjectId,
  section: string,
  nameOfThePost: string,
  next: NextFunction
) => {
  try {
    // Create posts for all models in COMPONENT_POST_MODAL_MAP
    const postCreationPromises = Object.entries(COMPONENT_POST_MODAL_MAP).map(
      async ([key, model]) => {
        let schema = POST_PROMPT_SCHEMA[key];

        // Ensure the schema's `required` matches the `dateRequiredMap` for `date`
        if (key === "date") {
          schema = { ...schema, required: dateRequiredMap[section] };
        }

        const existingDocument = await model.findById(postObjectId);
        if (existingDocument && key != "date") {
          return;
        }

        // Generate data JSON using `postCreation`
        const dataJson = await postCreation(nameOfThePost, schema, next);
        if (!dataJson) {
          throw new HttpError("Post creation returned no data", 500);
        }

        // Check if the document exists

        if (existingDocument && key === "date") {
          // Update only missing fields for `key === "date"`
          const updateData: Partial<typeof dataJson> = {};
          for (const field in dataJson) {
            if (!existingDocument[field]) {
              updateData[field] = dataJson[field];
            }
          }

          if (Object.keys(updateData).length > 0) {
            await model.findByIdAndUpdate(
              postObjectId,
              {
                $set: updateData,
              },
              {
                new: true,
                upsert: false, // Ensure no new document is created here
              }
            );
          }
        }

        // If the document does not exist, create it
        const newDocument = await model.findByIdAndUpdate(
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
          }
        );

        return newDocument;
      }
    );

    await Promise.all(postCreationPromises);
  } catch (error) {
    console.error("Error in createComponentPost:", error);
    return next(
      new HttpError("Error occurred while creating component post.", 500)
    );
  }
};

export const createNewPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(validationError(errors), 400));
  }
  const { section, name_of_the_post, post_code } = req.body;
  const userId = (req as JWTRequest).userData.userId;
  checkAuthorisedPublisher(req, res, next);

  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const postId = await postIdGeneration(post_code);
    if (!postId) {
      return next(
        new HttpError("Post Id generation failed, please try again.", 400)
      );
    }

    const model = SECTION_POST_MODAL_MAP[section];
    if (!model) {
      return next(
        new HttpError(`No model found for the section: ${section}`, 400)
      );
    }

    const existingPost = await model.findById(postId);
    if (existingPost) {
      return next(new HttpError("Post already exists!", 400));
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
        section,
        name_of_the_post,
        next
        // session
      );
    }

    const schema = POST_PROMPT_SCHEMA[section];
    const dataJson =
      Object.keys(schema).length === 0
        ? {}
        : await postCreation(name_of_the_post, schema, next);

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
    await newPost.save();

    // Update the PostModel
    const postInPostModel = await PostModel.findById(postId);

    if (postInPostModel) {
      await PostModel.updateOne(
        { _id: postId },
        { $set: { [`sections.${section}`]: { exist: true, approved: false } } }
        // { session }
      );
    } else {
      const newPostInPostModel = new PostModel({
        _id: postObjectId,
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

    // Commit the transaction
    // await session.commitTransaction();
    // session.endSession();

    return res
      .status(201)
      .json({ postId, message: "Created new post successfully!" });
  } catch (error) {
    // Abort the transaction on error
    // await session.abortTransaction();
    console.error("Error creating new post:", error);
    return next(new HttpError("Error occurred while creating new post.", 500));
  } finally {
    // Ensure that the session is always ended, regardless of success or failure
    // session.endSession();
  }
};