import { SECTION_POST_MODAL_MAP } from "@controllers/sharedControllers/post-model-map";
import DateModel from "@models/post_models/componentModels/date-model";
import postSortMap from "./post-sort-map";
import HttpError from "@utils/http-errors";
import { NextFunction } from "express"; 
import PostModel from "@models/post_models/post_model";
import {
  ISectionKey,
  PopulateOption,
} from "@models/post_models/post-interface";
import POST_POPULATE from "@models/post_models/posts_db/posts_populate.json";

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

//check for components approve still left

export const filterPopulateArray = (
  populateArray: PopulateOption[],
  max: boolean
): PopulateOption[] => {
  if (max) return populateArray; // Return full array if max is true

  return populateArray.filter(
    (item: PopulateOption): boolean => item.path !== "link_ref"
  );
};

export const fetchPostList = async (
  section: ISectionKey,
  includePopulate: boolean = true,
  next: NextFunction
) => {
  try {
    //ids can made efficient for ref exist (for section)
    const sortedPostIds = await getSortedDateIds(section);
    let populateArray = POST_POPULATE.section_list_populate[section];

    if (!includePopulate) {
      populateArray.filter(
        (item: PopulateOption): boolean => item.path !== "link_ref"
      );
    }

    let posts = await PostModel.find({
      _id: { $in: sortedPostIds },
      [`${section}_approved`]: true,
      [`${section}_ref`]: { $exists: true },
    })
      .select("post_code version")
      .populate(populateArray)
      .exec();

    //for having ordered post list as per sorted ids by dates
    const orderedPosts = sortedPostIds.map((id) =>
      posts.find((post) => post._id.toString() === id.toString())
    );

    return orderedPosts
      .filter((post): post is typeof post & { _doc: any } => Boolean(post))
      .map((post) => post._doc);
  } catch (error) {
    console.error("Error fetching post list:", error);
    return next(
      new HttpError("Failed to fetch post list. Please try again later.", 500)
    );
  }
};

export async function getSectionPostDetails<T>(
  section: ISectionKey,
  postId: string
): Promise<T | null> {
  const model = SECTION_POST_MODAL_MAP[section];
  // const sectionSelect = sectionPostDetailSelect[section] || "";
  // let selectFields: string[] = COMMON_POST_DETAIL_SELECT_FIELDS.split(" ");

  // if (sectionSelect.startsWith("-")) {
  //   selectFields = sectionSelect.split(" ");
  // } else if (sectionSelect) {
  //   selectFields.push(...sectionSelect.split(" "));
  // }

  const result = await model
    .findOne({ _id: postId, approved: true })
    // .select(selectFields)
    .populate(POST_POPULATE.section_detail_populate[section]);

  return result as T | null;
}
