import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const importantSchema = new Schema({
  post_code: { type: String, unique: true, require: true },
  name_of_the_post: { type: String, require: true },
  last_updated: { type: Date, require: true  },
  how_to_fill_the_form: [{ type: String }],
  important_links: { type: ObjectId, ref: "PostLink" },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
});

const PostImportant = mongoose.model("PostImportant", importantSchema);

export default PostImportant;
