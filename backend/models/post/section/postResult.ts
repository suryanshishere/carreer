import mongoose from "mongoose";
import { IResult } from "../post-section-interface";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const resultSchema = new Schema<IResult>({
  createdAt: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  contributors: [{ type: ObjectId, ref: "User" }],
  post_code: { type: String, unique: true, required: true },
  name_of_the_post: { type: String, unique: true },
  how_to_download_result: { type: String },
  result_data: [{ type: Schema.Types.Mixed }],
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_links: { type: ObjectId, ref: "PostLink" },
});

const Result = mongoose.model("Result", resultSchema);

export default Result;
