import mongoose from "mongoose";
import { IPostImportant } from "../post-section-interface";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const postImportantSchema = new Schema<IPostImportant>({
  createdAt: { type: Date },
  contributors: [{ type: ObjectId, ref: "User" }],
  post_code: { type: String, unique: true, required: true },
  name_of_the_post: { type: String, unique: true },
  last_updated: { type: Date },
  how_to_fill_the_form: { type: String },
  important_links: { type: ObjectId, ref: "PostLink" },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
});

const PostImportant = mongoose.model("PostImportant", postImportantSchema);

export default PostImportant;
