import handleValidationErrors from "@controllers/shared-controller/validation-error";
import { NextFunction, Response, Request } from "express";
import HttpError from "@utils/http-errors";
import mongoose from "mongoose";
import PostModel from "@models/post-model/Post";
import { JWTRequest } from "@middlewares/check-auth";
import {
  MODEL_MAP,
  SECTION_POST_MODEL_MAP,
} from "@models/post-model/post-db/post-map/post-model-map";
import {
  createComponentPost,
  generatePostData,
} from "./publisher-controllers-utils";
import AdminModel, { IAdmin } from "@models/admin-model/Admin";
import { SchemaType } from "@google/generative-ai";
import { SECTION_POST_PROMPT_SCHEMA_MAP } from "./post-prompt-schema-map";
import {
  IOverallKey,
  ISectionKey,
  POST_LIMITS_DB,
} from "@models/post-model/post-db";

export const createNewPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleValidationErrors(req, next);

  const {
    section,
    name_of_the_post,
    post_code,
    version,
    api_key_from_user,
  }: {
    section: ISectionKey;
    name_of_the_post: string;
    post_code: string;
    version?: string;
    api_key_from_user?: string;
  } = req.body;

  //since publisher id will be same as user id but just in the publisher model
  const publisherId = (req as JWTRequest).userData.userId;

  const session = await mongoose.startSession();

  try {
    //authorization check
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

    // allow time out constraint to be removed (with transaction)
    const result = await session.withTransaction(async () => {
      //checking the section cuz it's validated already by express validator from the same section it's mapped
      const model = SECTION_POST_MODEL_MAP[section];

      const queryFilter = { post_code, version: version ?? "main" };

      const existingPost = await PostModel.findOne({
        ...queryFilter,
        [`${section}_ref`]: { $exists: true },
      }).session(session);

      if (existingPost) {
        return next(new HttpError("Post already exists!", 400));
      }

      await createComponentPost(req, session, api_key_from_user);

      let schema = SECTION_POST_PROMPT_SCHEMA_MAP[section];
      schema = {
        ...schema,
        properties: {
          ...schema.properties,
          name_of_the_post: {
            description: `Ensure the title is clear and directly reflects the exam name along with the date or relevant event in the "${section}" section, within ${POST_LIMITS_DB.medium_char_limit.min}-${POST_LIMITS_DB.medium_char_limit.max} characters.
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

      console.log("data created for the section", dataJson);

      // Upsert the post model document using post_code as the filter
      const postModelDoc = await PostModel.findOneAndUpdate(
        queryFilter, // Query filter: find the document by post_code
        {
          $setOnInsert: queryFilter,
          $set: {
            [`${section}_created_by`]: publisherId,
          },
        },
        { session, upsert: true, new: true }
      );

      // Now update the document with its own _id as the reference
      postModelDoc[`${section}_ref`] = postModelDoc._id;
      await postModelDoc.save({ session });

      const newPostDocs = await model.create(
        [
          {
            _id: postModelDoc._id,
            ...dataJson,
          },
        ],
        { session }
      );

      return { newPostDocs };
    });

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
  handleValidationErrors(req, next);
  const { post_id, section }: { post_id: string; section: IOverallKey } =
    req.body;
  const publisherId = (req as JWTRequest).userData.userId;

  try {
    //authorization check
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

    await PostModel.deleteOne({ _id: post_id });

    if (section) {
      // Check if the section exists in MODEL_MAP
      const model = MODEL_MAP[section];
      if (!model) {
        return res.status(400).json({ error: `Invalid section: ${section}` });
      }

      // Delete the post only from the specified section
      const result = await model.deleteOne({ _id: post_id });
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
      for (const [key, model] of Object.entries(MODEL_MAP)) {
        try {
          const result = await model.deleteOne({ _id: post_id });
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
