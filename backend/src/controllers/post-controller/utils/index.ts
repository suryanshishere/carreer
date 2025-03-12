import POSTS_POPULATE from "@models/post-model/db/post-map/post-populate-map";
import HttpError from "@utils/http-errors";
import { NextFunction } from "express";
import PostModel from "@models/post-model/Post";
import { PopulateOption } from "@models/post-model/db";
import POST_POPULATE from "@models/post-model/db/post-map/post-populate-map";
import { ISectionKey } from "@models/post-model/db";
import getSortedDateIds from "./get-sorted-date-ids";
import mongoose from "mongoose";

export const fetchPostList = async (
  section: ISectionKey,
  includePopulate: boolean = true,
  next: NextFunction
) => {
  try {
    // sorted ids as per required dates nearest
    const sortedPostIds = await getSortedDateIds(section);

    // Prepare populate array only if needed
    const populateArray = !includePopulate
      ? POST_POPULATE.section_list_populate[section].filter(
          (item: PopulateOption) => item.path !== "link_ref"
        )
      : POST_POPULATE.section_list_populate[section];

    // Fetch posts from DB
    const posts = await PostModel.find({
      _id: { $in: sortedPostIds },
      [`${section}_approved`]: true,
      [`${section}_ref`]: { $exists: true },
    })
      .select("post_code version")
      .populate(populateArray)
      .lean()
      .exec();

    // Manually sort posts based on sortedPostIds order
    // At the end of fetchPostList, instead of returning orderedPosts directly:
    const orderedPosts = sortedPostIds
      .map((id) => posts.find((post) => post._id.toString() === id.toString()))
      .filter((post): post is NonNullable<typeof post> => Boolean(post));

    return orderedPosts;
  } catch (error) {
    console.error("Error fetching post list:", error);
    return next(
      new HttpError("Failed to fetch post list. Please try again later.", 500)
    );
  }
};

export const fetchPostDetail = async (
  section: ISectionKey,
  postIdOrCode: string,
  version: string = "main",
  useLean: boolean = true  
) => {
  const query = mongoose.Types.ObjectId.isValid(postIdOrCode)
    ? {
        _id: postIdOrCode,
        [`${section}_approved`]: true,
        [`${section}_ref`]: { $exists: true },
      }
    : {
        post_code: postIdOrCode,
        version,
        [`${section}_approved`]: true,
        [`${section}_ref`]: { $exists: true },
      };

  let queryBuilder = PostModel.findOne(query)
    .select("post_code version")
    .populate(POSTS_POPULATE.section_detail_populate[section]);

  if (useLean) {
    queryBuilder = queryBuilder.lean();
  }

  return await queryBuilder;
};
