import { SECTION_POST_MODAL_MAP } from "@controllers/controllersUtils/post-model-map";
import { sectionListPopulate } from "./postPopulate/posts-populate";
import {
  COMMON_SELECT_FIELDS,
  sectionPostListSelect,
} from "./postSelect/sectionPostListSelect";
import DateModel from "@models/post/componentModels/date-model";
import postSortMap from "./post-sort-map";
import HttpError from "@utils/http-errors";
import { NextFunction } from "express";

const getSortedDateIds = async (section: string) => {
  const currentDate = new Date();

  // Calculate the start and end of the range for the current year
  const startOfPreviousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

  const endOfNextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 2,
    0
  );

  // Construct the query conditions dynamically
  const queryConditions = [];

  // Add conditions for `current_year` for the last 5 years
  for (let i = 0; i <= 5; i++) {
    const startOfPreviousMonthYear = new Date(
      startOfPreviousMonth.getFullYear() - i,
      startOfPreviousMonth.getMonth(),
      startOfPreviousMonth.getDate()
    );

    const endOfNextMonthYear = new Date(
      endOfNextMonth.getFullYear() - i,
      endOfNextMonth.getMonth(),
      endOfNextMonth.getDate()
    );

    // Check `current_year` for this year
    queryConditions.push({
      [`${postSortMap[section]}.current_year`]: {
        $gte: startOfPreviousMonthYear,
        $lte: endOfNextMonthYear,
      },
    });
  }

  // Add fallback conditions for `previous_year` for the last 5 years
  for (let i = 0; i <= 5; i++) {
    const startOfPreviousMonthYear = new Date(
      startOfPreviousMonth.getFullYear() - i,
      startOfPreviousMonth.getMonth(),
      startOfPreviousMonth.getDate()
    );

    const endOfNextMonthYear = new Date(
      endOfNextMonth.getFullYear() - i,
      endOfNextMonth.getMonth(),
      endOfNextMonth.getDate()
    );

    // Check `previous_year` for this year
    queryConditions.push({
      [`${postSortMap[section]}.previous_year`]: {
        $gte: startOfPreviousMonthYear,
        $lte: endOfNextMonthYear,
      },
    });
  }

  const query = { $or: queryConditions };

  const sortedDateIds = await DateModel.find(query)
    .select("_id") // Only fetch the IDs
    .lean();

  return sortedDateIds.map((date) => date._id); // Return an array of IDs
};

export const fetchPostList = async (
  section: string,
  includePopulate: boolean = true,
  next: NextFunction
) => {
  try {
    const model = SECTION_POST_MODAL_MAP[section];
    if (!model) {
      return null;
    }

    const sectionSelect = sectionPostListSelect[section] || "";
    let selectFields: string[] = COMMON_SELECT_FIELDS.split(" ");

    if (sectionSelect.startsWith("-")) {
      selectFields = sectionSelect.split(" ");
    } else if (sectionSelect) {
      selectFields.push(...sectionSelect.split(" "));
    }

    const sortedPostIds = await getSortedDateIds(section);
    // console.log(sortedPostIds);

    // Step 1: Fetch posts using sorted IDs
    let query = model
      .find({
        _id: { $in: sortedPostIds }, // Match posts with sorted IDs
        approved: true,
      })
      .select(selectFields);

    if (includePopulate && sectionListPopulate[section]) {
      query = query.populate(sectionListPopulate[section]);
    } else {
      query = query.populate({
        path: "important_dates",
        select: "",
      });
    }

    const posts = await query.exec();

    // Step 2: Reorder posts based on sortedPostIds
    const orderedPosts = sortedPostIds.map((id) =>
      posts.find((post) => post._id.toString() === id.toString())
    );

    return orderedPosts.filter(Boolean).map((post) => post._doc); // Ensure no undefined values
  } catch (error) {
    console.error("Error fetching post list:", error);
    return next(
      new HttpError("Failed to fetch post list. Please try again later.", 500)
    );
  }
};
