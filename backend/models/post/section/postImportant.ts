import mongoose from "mongoose";
import { IPostImportant } from "../post-section-interface";
import createCommonDataModel from "../post-common";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const postImportantSchema = new Schema<IPostImportant>({
  how_to_fill_the_form: { type: String },
  important_links: { type: ObjectId, ref: "PostLink" },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
});

const PostImportant = createCommonDataModel("PostImportant", postImportantSchema);

export default PostImportant;
