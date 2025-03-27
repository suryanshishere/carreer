import POSTS_POPULATE from "@models/posts/db/post-map/post-populate-map";
import HttpError from "@utils/http-errors";
import { NextFunction, Request } from "express";
import PostModel from "@models/posts/Post";
import { PopulateOption, TAGS } from "@models/posts/db";
import POST_POPULATE from "@models/posts/db/post-map/post-populate-map";
import { ISectionKey } from "@models/posts/db";
import getSortedDateIds from "./get-sorted-date-ids";
import mongoose from "mongoose";
import {
  calculateDateDifference,
  formattedDateRefView,
  IDateRangeView,
} from "./calculate-date";
import { IDates } from "@models/posts/components/Date";
import { ILink } from "@models/posts/components/Link";

export const fetchPostList = async (
  section: ISectionKey,
  includePopulate: boolean,
  next: NextFunction,
  approvedStatus: boolean = true,
  includeSortedIds: boolean = true,
  pageParam?: number
) => {
  try {
    let sortedPostIds: string[] = [];
    let pageNumber: number | null = null;

    if (includeSortedIds) {
      // sorted ids as per required dates nearest
      const result = await getSortedDateIds(section, pageParam);
      sortedPostIds = result.sortedDateIds;
      pageNumber = result.pageNumber;
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
      .select(`post_code version`)
      .populate(populateArray)
      .lean()
      .exec();

    // if (!includeSortedIds) {
    //   return posts;
    // }

    return { posts, pageNumber };
  } catch (error) {
    console.error("Error fetching post list:", error);
    return next(
      new HttpError("Failed to fetch post list. Please try again later.", 500)
    );
  }
};

export const fetchPostDetail = async (req: Request, next: NextFunction) => {
  const {
    section,
    postIdOrCode,
    version = "main",
  } = req.params as {
    section: ISectionKey;
    postIdOrCode: string;
    version?: string;
  };
  const userRole = req.userData?.role ?? "none";

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
        [`${section}_ref`]: { $exists: true },
      };

  const response = await PostModel.findOne(query)
    .select(`post_code version ${section}_approved dynamic_field`)
    .populate(POSTS_POPULATE.section_detail_populate[section]);

  if (!response) {
    return next(new HttpError("Post not found!", 404));
  }

  return response;
};

export const getTagDateLinkRef = (
  dateRef: IDates,
  section: ISectionKey,
  linkRef?: ILink
): {
  tag: string;
  important_dates: Record<keyof IDates, IDateRangeView>;
  important_links?: ILink;
} => {
  // Process the date reference to obtain both formatted versions
  const formattedView = formattedDateRefView(dateRef);
  const days = calculateDateDifference(dateRef, section);

  let tagKey: string = "none";
  if (days !== null) {
    const matchingTagEntry = Object.entries(TAGS).find(
      ([, range]) => range && days >= range[0] && days < range[1]
    );
    if (matchingTagEntry) {
      tagKey = matchingTagEntry[0];
    }
  }

  return {
    tag: tagKey,
    important_dates: formattedView,
    ...(linkRef && { important_links: linkRef }),
  };
};
