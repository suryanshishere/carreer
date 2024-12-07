import { SECTION_POST_MODAL_MAP } from "@controllers/shared/post-model-map";
import { sectionListPopulate } from "./postPopulate/posts-populate";
import {
  COMMON_SELECT_FIELDS,
  sectionPostListSelect,
} from "./postSelect/sectionPostListSelect";

export const fetchPostList = async (
  section: string,
  includePopulate: boolean = true
) => {
  const model = SECTION_POST_MODAL_MAP[section];
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

  let query = model.find({ approved: true }).select(selectFields);

  // Conditionally add population logic
  if (includePopulate && sectionListPopulate[section]) {
    query = query.populate(sectionListPopulate[section]);
  }

  const posts = await query.exec();

  const currentDate = new Date();

  // Sort by nearest to the current date
  posts.sort((a, b) => {
    const diffA = Math.abs(
      new Date(a.updatedAt).getTime() - currentDate.getTime()
    );
    const diffB = Math.abs(
      new Date(b.updatedAt).getTime() - currentDate.getTime()
    );
    return diffA - diffB;
  });

  // Return only the _doc part of each document
  return posts.map((post) => post._doc);
};
