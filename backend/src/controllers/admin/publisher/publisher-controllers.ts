import validationError, {
  handleValidationErrors,
} from "@controllers/sharedControllers/validation-error";
import { NextFunction, Response, Request } from "express";
import HttpError from "@utils/http-errors";
import mongoose from "mongoose";
import PostModel from "@models/post/post-model";
import { JWTRequest } from "@middleware/check-auth";
import {
  COMPONENT_POST_MODAL_MAP,
  MODAL_MAP,
  SECTION_POST_MODAL_MAP,
} from "@controllers/sharedControllers/post-model-map";
import {
  COMPONENT_POST_PROMPT_SCHEMA_MAP,
  SECTION_DESCRIPTIONS,
  SECTION_POST_PROMPT_SCHEMA_MAP,
  postCreation,
  postIdGeneration,
} from "./publisher-controllers-utils";
import { validationResult } from "express-validator";
import { updateSchema } from "@controllers/posts/postsControllersUtils/post-sort-map";
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

//TODO: what if one of the component exist
export const createComponentPost = async (
  postId: string,
  req: Request,
  session: mongoose.ClientSession
) => {
  try {
    const userId = (req as JWTRequest).userData.userId;
    const { section, name_of_the_post } = req.body;

    // Loop through the COMPONENT_POST_MODAL_MAP and execute each key in sequence
    for (const [key, model] of Object.entries(COMPONENT_POST_MODAL_MAP)) {
      try {
        if (!model) {
          throw new HttpError(`Model not found for key: ${key}`, 400);
        }

        let schema = COMPONENT_POST_PROMPT_SCHEMA_MAP[key];
        if (!schema) {
          throw new HttpError(`Schema not found for key: ${key}`, 400);
        }
        schema = updateSchema(schema, key, section);

        const existingComponent = await model.findById(postId).session(session);
        if (existingComponent) {
          // Remove fields related to the existing component from the schema
          for (const field in existingComponent.toObject()) {
            if (schema.properties[field]) {
              console.log(`Removing field: ${field} from schema`);
              delete schema.properties[field];
            }
            if (schema.required && schema.required.includes(field)) {
              schema.required = schema.required.filter(
                (requiredField: string) => requiredField !== field
              );
            }
          }
        }

        console.log("schema updated:", schema);

        // Check if schema properties are empty
        if (Object.keys(schema.properties).length === 0) {
          console.log(
            `Skipping post creation for key: ${key} as schema properties are empty`
          );
          continue;
        }

        const dataJson = await postCreation(name_of_the_post, schema);
        if (!dataJson) {
          console.error("Post creation failed for:", key);
          throw new HttpError("Post creation returned no data", 500);
        }

        console.log("component data generated:", dataJson);

        // Create or update the document
        await model.findByIdAndUpdate(
          postId,
          {
            $set: {
              created_by: userId,
              approved: true,
              ...dataJson,
            },
          },
          {
            new: true,
            upsert: true,
            session,
          }
        );
      } catch (error) {
        console.error(
          `Error occurred in component post creation for key: ${key}`,
          error
        );
        throw error; // Propagate the error to abort the entire operation
      }
    }
  } catch (error) {
    console.error("Error in createComponentPost:", error);
    throw error; // Propagate the error to allow transaction rollback
  }
};

export const createNewPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { section, name_of_the_post, post_code } = req.body;
  const publisherId = (req as JWTRequest).userData.userId; //since publisher id will be same as user id but just in the publisher model

  const session = await mongoose.startSession();

  try {
    handleValidationErrors(req, next);
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
      const postId = await postIdGeneration(post_code);
      console.log("Post ID", postId);

      if (!postId) {
        throw new HttpError(
          "Post Id generation failed, please try again.",
          400
        );
      }

      const model = SECTION_POST_MODAL_MAP[section];
      if (!model) {
        return next(
          new HttpError(`No model found for the section: ${section}.`, 400)
        );
      }

      const existingPost = await model.findById(postId).session(session);
      if (existingPost) {
        return next(new HttpError("Post already exists!", 400));
      }

      // Create Components
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
