import { MODEL_DATA, sectionListPopulate } from "./postPopulate/posts-populate";
import {
  COMMON_SELECT_FIELDS,
  sectionPostListSelect,
} from "./postSelect/sectionPostListSelect";

export const fetchPostList = async (section: string) => {
  const model = MODEL_DATA[section];
  if (!model) {
    return null;
  }

  const selectFields = [
    COMMON_SELECT_FIELDS,
    sectionPostListSelect[section] || "",
  ]
    .filter(Boolean)
    .join(" ");

  const posts = await model
    .find({ approved: true })
    .sort({ last_updated: -1 })
    .select(selectFields)
    .populate(sectionListPopulate[section])
    .exec();

  // Return only the _doc part of each document
  return posts.map((post) => post._doc);
};
