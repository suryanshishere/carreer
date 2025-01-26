import handleValidationErrors from "@controllers/sharedControllers/validation-error";
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
  createComponentPost,
  generatePostData,
  postIdGeneration,
} from "./publisher-controllers-utils";
import AdminModel, { IAdmin } from "@models/admin/admin-model";
import { SchemaType } from "@google/generative-ai";
import { SECTION_POST_PROMPT_SCHEMA_MAP } from "./post-prompt-schema-map";
import { POST_LIMITS_ENV_DB } from "@models/post/post-env-db";

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

    console.log(postId, "post id generated");

    // allow time out constraint to be removed (with transaction)
    const result = await session.withTransaction(async () => {
      //checking the section cuz it's validated already by express validator from the same section it's mapped
      const model = SECTION_POST_MODAL_MAP[section];

      const existingPost = await model.findById(postId).session(session);

      if (existingPost) {
        return next(new HttpError("Post already exists!", 400));
      }

      await createComponentPost(postId, req, session);

      let schema = SECTION_POST_PROMPT_SCHEMA_MAP[section];
      schema = {
        ...schema,
        properties: {
          ...schema.properties,
          name_of_the_post: {
            description: `Ensure the title is clear and directly reflects the exam name along with the date or relevant event in the "${section}" section, within ${POST_LIMITS_ENV_DB.medium_char_limit.min}-${POST_LIMITS_ENV_DB.medium_char_limit.max} characters.
For example:
In the "latest_job" section, include the name of the exam and the post, followed by the year. Example: "UPSC Civil Services Examination - Assistant Manager Recruitment".
In the "result" section, include the name of the exam and append "Result Released", followed by the year. Example: "UPSC Civil Services Examination Result Released".
Each title should be contextually appropriate to its section, ensuring clarity, specificity, and relevance.`,
            type: SchemaType.STRING,
          },
        },
        required: [...(schema.required || []), "name_of_the_post"],
      };

      const dataJson = await generatePostData({
        keyOrSection: section,
        name_of_the_post,
        schema,
      });

      // Save the new post document
      const newPost = new model({
        _id: postId,
        created_by: publisherId,
        approved: true,
        ...dataJson,
      });
      await newPost.save({ session });

      //TODO TO REFACTOR
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

    console.log("done successfully");
    return res
      .status(201)
      .json({ ...result, message: "Created new post successfully!" });
  } catch (error: any) {
    console.error("Error creating new post:", error);
    return next(
      new HttpError(
        error.message || "Error occurred while creating new post.",
        500
      )
    );
  } finally {
    session.endSession();
  }
};

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
