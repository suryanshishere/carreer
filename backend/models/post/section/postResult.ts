import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const resultSchema = new Schema({
  createdAt: { type: Date },
  contributors: [{ type: ObjectId, ref: "User" }],
  name_of_the_post: { type: String, require: true },
  last_updated: { type: Date, require: true },
  how_to_download_result: { type: String },
  result_data: [{ type: Schema.Types.Mixed }],
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_links: { type: ObjectId, ref: "PostLink" },
});

const Result = mongoose.model("Result", resultSchema);

export default Result;
