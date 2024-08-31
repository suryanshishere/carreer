import { NextFunction } from "express";
import HttpError from "@utils/http-errors";
import generateUniqueId from "./generate-unique-id";
import { sectionAdminModelSelector } from "./section-model-selector";
import { sectionModelSchemaSelector } from "./section-model-schema-selector";
import updateMissingFields from "./update-ref-n-missing-field";

const addPostToAllSections = async (
  post_section: string,
  name_of_the_post: string,
  post_code: string,
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

  const postId = generateUniqueId(post_code);
  const errorMessages: string[] = []; 

  const addPostPromises = ALL_POST_SECTIONS.map(async (section) => {
    try {
      const model = sectionAdminModelSelector(section, next);
      if (!model) {
        return next(new Error(`Invalid section: ${section}`));
      }

      const schema = sectionModelSchemaSelector(post_section, next);
      if (!schema) {
        return next(new Error("Invalid post section; schema not found."));
      }

      const existingPost = await model.findById(postId);
      if (existingPost && section !== post_section) {
        // Skip the creation if the post already exists in other sections
        return;
      }

      let newPost;
      if (existingPost && section === post_section) {
        existingPost.name_of_the_post = name_of_the_post;
        await existingPost.save();
        return;
      } else if (!existingPost && section === post_section) {
        newPost = new model({
          _id: postId,
          post_code,
          name_of_the_post
        });
      } else {
        newPost = new model({
          _id: postId,
          post_code,
        });
      }

      // Add missing fields to the post as per the schema
      const { updatedPost } = updateMissingFields(schema, newPost, postId);

      await updatedPost.save();
    } catch (error) {
      // Collect error message instead of calling next
      errorMessages.push(`${section}`);
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
