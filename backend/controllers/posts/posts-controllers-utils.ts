import { MODEL_DATA, sectionListPopulate } from "./postPopulate/posts-populate";
import {
  COMMON_SELECT_FIELDS,
  sectionPostListSelect,
} from "./postSelect/sectionPostListSelect";

export const fetchPostList = async (
  section: string,
  includePopulate: boolean = true
) => {
  const model = MODEL_DATA[section];
  if (!model) {
    return null;
  }

  // Combine select fields
  const selectFields = [
    COMMON_SELECT_FIELDS,
    sectionPostListSelect[section] || "",
  ]
    .filter(Boolean)
    .join(" ");

  let query = model
    .find({ approved: true })
    .sort({ updatedAt: -1 })
    .select(selectFields);

  // Conditionally add population logic
  if (includePopulate && sectionListPopulate[section]) {
    query = query.populate(sectionListPopulate[section]);
  }

  const posts = await query.exec();

  // Return only the _doc part of each document
  return posts.map((post) => post._doc);
};
