import HttpError from "@utils/http-errors";
import generateUniqueId from "./generate-unique-id";
import { sectionAdminModelSelector } from "./section-model-selector";
import { sectionModelSchemaSelector } from "./section-model-schema-selector";
import updateMissingFields from "./update-ref-n-missing-field";
import { NextFunction } from "express";

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

  try {
    const postId = generateUniqueId(post_code);

    const addPostPromises = ALL_POST_SECTIONS.map(async (section) => {
      const model = sectionAdminModelSelector(section, next);
      if (!model) {
        return new HttpError(`Invalid section: ${section}`, 400);
      }

      const schema = sectionModelSchemaSelector(post_section, next);
      if (!schema) {
        return next(
          new HttpError("Invalid post section; schema not found.", 400)
        );
      }

      const existingPost = await model.findById(postId);
      if (existingPost) {
        // Skip the creation if the post already exists
        return;
      }

      let newPost;
      // Creating a new post for each section
      if (section === post_section) {
        newPost = new model({
          _id: postId,
          post_code,
          name_of_the_post,
        });
      } else {
        newPost = new model({
          _id: postId,
          post_code,
        });
      }

      //for adding ref postId ref to all the ref fields of the schema
      const { updatedPost } = updateMissingFields(schema, newPost, postId);

      await updatedPost.save();
    });

    // Await all promises to complete
    await Promise.all(addPostPromises);
  } catch (error) {
    // Forward any errors that occur in the process
    return new HttpError(`Error occured while creating new post.`, 400);
  }
};

export default addPostToAllSections;