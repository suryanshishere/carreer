import { Response, NextFunction } from "express";
import HttpError from "@utils/http-errors";
import generateUniqueId from "./generate-unique-id";
import { sectionAdminModelSelector } from "./section-model-selector";
import { sectionModelSchemaSelector } from "./section-model-schema-selector";
import updateMissingFields from "./update-ref-n-missing-field";
import mongoose from "mongoose";

const addPostToAllSections = async (
  post_section: string,
  name_of_the_post: string,
  post_code: string,
  userid: string | undefined,
  next: NextFunction,
  res: Response
) => {
  const ALL_POST_SECTIONS = [
    "post_common",
    "result",
    "admit_card",
    "latest_job",
    "answer_key",
    "syllabus",
    "certificate_verification",
    "admission",
    "important",
  ];

  let userId;
  try {
    userId = new mongoose.Types.ObjectId(userid);
  } catch (error) {
    return next(new HttpError("Invalid user ID", 400));
  }

  const postId = generateUniqueId(post_code);
  const errorMessages: string[] = [];

  const addPostPromises = ALL_POST_SECTIONS.map(async (section) => {
    try {
      const model = sectionAdminModelSelector(section, next);
      if (!model) {
        errorMessages.push(`Invalid section: ${section}`);
        return;
      }

      const schema = sectionModelSchemaSelector(post_section, next);
      if (!schema) {
        errorMessages.push("Invalid post section; schema not found.");
        return;
      }

      const existingPost = await model.findById(postId);

      // If the document exists
      if (existingPost) {
        // Check if name_of_the_post exists
        if (existingPost.name_of_the_post) {
          // Do nothing if name_of_the_post exists
          return;
        } else if (section === post_section) {
          // Update name_of_the_post if section matches
          existingPost.name_of_the_post = name_of_the_post;
          existingPost.createdBy = userId;
          await existingPost.save(); // Save the existing post
          return;
        }
      } else {
        // Document does not exist
        let newPost;

        // Create a new document with name_of_the_post if section matches
        if (section === post_section) {
          newPost = new model({
            _id: postId,
            createdBy: userId,
            post_code,
            name_of_the_post,
          });
        } else {
          // Create a new document without name_of_the_post if section does not match
          newPost = new model({
            _id: postId,
            post_code,
          });
        }

        await newPost.save()

        const findNewPost = await model.findById(postId);
        const { updatedPost } = updateMissingFields(schema, findNewPost, postId);
        await updatedPost.save(); // Only save if newPost is new
      }
    } catch (error) {
      // Collect error message instead of calling next
      console.log(error);
      errorMessages.push(`Error in section: ${section}`);
    }
  });

  // Await all promises to complete
  await Promise.all(addPostPromises);

  // If there were errors, pass them to the next middleware
  if (errorMessages.length > 0) {
    return next(
      new HttpError(
        `Errors occurred while adding post to sections: ${errorMessages.join(
          ", "
        )}`,
        500
      )
    );
  }
};

export default addPostToAllSections;
