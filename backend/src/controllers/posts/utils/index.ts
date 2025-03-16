import POSTS_POPULATE from "@models/posts/db/post-map/post-populate-map";
import HttpError from "@utils/http-errors";
import { NextFunction } from "express";
import PostModel from "@models/posts/Post";
import { PopulateOption, TAGS } from "@models/posts/db";
import POST_POPULATE from "@models/posts/db/post-map/post-populate-map";
import { ISectionKey } from "@models/posts/db";
import getSortedDateIds from "./get-sorted-date-ids";
import mongoose from "mongoose";
import calculateDateDifference from "./calculate-date-diff";
import { IDates } from "@models/posts/components/Date";
import { IRole } from "@models/admin/db";

export const fetchPostList = async (
  section: ISectionKey,
  includePopulate: boolean = true,
  next: NextFunction,
  approvedStatus: boolean = true,
  includeSortedIds: boolean = true
) => {
  try {
    let sortedPostIds: string[] = [];
    if (includeSortedIds) {
      // sorted ids as per required dates nearest
      sortedPostIds = await getSortedDateIds(section);
    }

    // Prepare populate array only if needed
    const populateArray = !includePopulate
      ? POST_POPULATE.section_list_populate[section].filter(
          (item: PopulateOption) => item.path !== "link_ref"
        )
      : POST_POPULATE.section_list_populate[section];

    // Fetch posts from DB
    const query: any = {
      [`${section}_approved`]: approvedStatus,
      [`${section}_ref`]: { $exists: true },
    };
    if (includeSortedIds) {
      query._id = { $in: sortedPostIds };
    }

    const posts = await PostModel.find(query)
      .select(`post_code version updatedAt ${section}_approved`)
      .populate(populateArray)
      .lean()
      .sort(includeSortedIds ? undefined : { updatedAt: -1 })
      .exec();

    if (!includeSortedIds) {
      return posts;
    }

    return posts;
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
  userRole: IRole = "none"
) => {
  const query = mongoose.Types.ObjectId.isValid(postIdOrCode)
    ? {
        _id: postIdOrCode,
        ...(userRole === "none" || userRole === "publisher"
          ? { [`${section}_approved`]: true }
          : {}),
        [`${section}_ref`]: { $exists: true },
      }
    : {
        post_code: postIdOrCode,
        version,
        [`${section}_approved`]: true,
        [`${section}_ref`]: { $exists: true },
      };

  const queryBuilder = PostModel.findOne(query)
    .select(`post_code version updatedAt ${section}_approved`)
    .populate(POSTS_POPULATE.section_detail_populate[section]);

  return await queryBuilder;
};

export const getTagForPost = (
  dateRef: Partial<IDates>,
  section: ISectionKey
): string => {
  const days = calculateDateDifference(dateRef, section);

  let tagKey: string = "none";
  if (days !== null) {
    const matchingTagEntry = Object.entries(TAGS).find(
      ([key, range]) => range && days >= range[0] && days < range[1]
    );

    if (matchingTagEntry) {
      tagKey = matchingTagEntry[0];
    }
  }
  return tagKey;
};
