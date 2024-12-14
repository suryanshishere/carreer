import { SECTION_POST_MODAL_MAP } from "@controllers/controllersUtils/post-model-map";
import { sectionListPopulate } from "./postPopulate/posts-populate";
import {
  COMMON_SELECT_FIELDS,
  sectionPostListSelect,
} from "./postSelect/sectionPostListSelect";
import DateModel from "@models/post/componentModels/date-model";
import postSortMap from "./post-sort-map";

const getSortedDateIds = async (section: string) => {
  const currentDate = new Date();
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

  const sortedDateIds = await DateModel.find({
    [`${postSortMap[section]}.current_year`]: {
      $gte: startOfPreviousMonth,
      $lte: endOfNextMonth,
    },
  })
    .select("_id") // Only fetch the IDs
    .lean();
  // .sort({ current_year: 1 }) // Ascending order

  return sortedDateIds.map((date) => date._id); // Return an array of IDs
};

export const fetchPostList = async (
  section: string,
  includePopulate: boolean = true
) => {
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
  console.log(sortedPostIds);
  // Step 1: Fetch posts using sorted IDs
  let query = model
    .find({
      _id: { $in: sortedPostIds }, // Match posts with sorted IDs
      approved: true,
    })
    .select(selectFields);

  if (includePopulate && sectionListPopulate[section]) {
    query = query.populate(sectionListPopulate[section]);
  }

  const posts = await query.exec();

  // Step 2: Reorder posts based on sortedPostIds
  const orderedPosts = sortedPostIds.map((id) =>
    posts.find((post) => post._id.toString() === id.toString())
  );

  return orderedPosts.filter(Boolean).map((post) => post._doc); // Ensure no undefined values
};
