import { NextFunction } from "express";
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
  next: NextFunction
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
      //if already have name_of_the_post (editing option given earlier)
      if (existingPost && section === post_section) {
        return;
      }

      let newPost; 
      if (!existingPost && section === post_section) {
        newPost = new model({
          _id: postId,
          createdBy: userId,
          post_code,
          name_of_the_post,
        });
      } else {
        newPost = new model({
          _id: postId,
          post_code,
        });
      }

      // Add ref field automatically
      const { updatedPost } = updateMissingFields(schema, newPost, postId);

      await updatedPost.save();
    } catch (error) {
      // Collect error message instead of calling next
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
