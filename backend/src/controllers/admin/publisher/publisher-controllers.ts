import  handleValidationErrors  from "@controllers/sharedControllers/validation-error";
import { NextFunction, Response, Request } from "express";
import HttpError from "@utils/http-errors";
import mongoose from "mongoose";
import PostModel from "@models/post/post-model";
import { JWTRequest } from "@middleware/check-auth";
import {
  MODAL_MAP,
  SECTION_POST_MODAL_MAP,
} from "@controllers/sharedControllers/post-model-map";
import {
  SECTION_DESCRIPTIONS,
  SECTION_POST_PROMPT_SCHEMA_MAP,
  createComponentPost,
  postCreation,
  postIdGeneration,
} from "./publisher-controllers-utils";
import AdminModel, { IAdmin } from "@models/admin/admin-model";

//may be used in future
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

export const createNewPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleValidationErrors(req, next);

  const { section, name_of_the_post, post_code } = req.body;
  //since publisher id will be same as user id but just in the publisher model
  const publisherId = (req as JWTRequest).userData.userId;

  const session = await mongoose.startSession();

  try {
    const publisher: IAdmin | null = await AdminModel.findById(publisherId)
      .select("role")
      .exec();
    if (
      !publisher ||
      (publisher.role != "publisher" && publisher.role != "admin")
    ) {
      return next(
        new HttpError(
          "Not authorised, request for access or approval of req!",
          403
        )
      );
    }

    const postId = await postIdGeneration(post_code);
    if (!postId) {
      return next(
        new HttpError("Post Id generation failed, please try again.", 400)
      );
    }

    // allow time out constraint to be removed (with transaction)
    const result = await session.withTransaction(async () => {
      //checking the section cuz it's validated already by express validator from the same section it's mapped
      const model = SECTION_POST_MODAL_MAP[section];

      const existingPost = await model.findById(postId).session(session);
      if (existingPost) {
        return next(new HttpError("Post already exists!", 400));
      }

      await createComponentPost(postId, req, session);

      // Adjust schema for the section
      let schema = SECTION_POST_PROMPT_SCHEMA_MAP[section];
      schema = {
        ...schema,
        properties: {
          ...schema.properties,
          name_of_the_post: {
            description: SECTION_DESCRIPTIONS[section]
              ? `${SECTION_DESCRIPTIONS[section]} Ensure it captures the intention and provides clarity to the audience.`
              : `A well-described and engaging name for the post, tailored to the purpose and intention of the ${section} section.`,
            type: "string",
          },
        },
        required: [...(schema.required || []), "name_of_the_post"],
      };

      const dataJson = await postCreation(name_of_the_post, schema);
      if (!dataJson) {
        return new HttpError("Post creation returned no data.", 500);
      }

      // Save the new post document
      const newPost = new model({
        _id: postId,
        created_by: publisherId,
        approved: true,
        ...dataJson,
      });
      await newPost.save({ session });

      const postInPostModel = await PostModel.findById(postId).session(session);

      if (postInPostModel) {
        await PostModel.updateOne(
          { _id: postId },
          {
            $set: {
              [`sections.${section}`]: { exist: true, approved: false },
              [`created_by.${section}`]: publisherId,
            },
          },
          { session }
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
          created_by: {
            [section]: publisherId,
          },
        });
        await newPostInPostModel.save({ session });
      }

      return { postId, newPost };
    });

    return res
      .status(201)
      .json({ ...result, message: "Created new post successfully!" });
  } catch (error) {
    console.error("Error creating new post:", error);
    return next(new HttpError("Error occurred while creating new post.", 500));
  } finally {
    session.endSession();
  }
};
