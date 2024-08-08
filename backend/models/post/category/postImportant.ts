import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const importantSchema = new Schema({
  post_code: { type: String, unique: true, require: true },
  name_of_the_post: { type: String, require: true },
  how_to_fill_the_form: [{ type: String }],
  last_updated: { type: Date },
  important_links: { type: ObjectId, ref: "PostLink" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  post_common: { type: ObjectId, ref: "PostCommon" },
});

const PostImportant = mongoose.model("PostImportant", importantSchema);

export default PostImportant;
