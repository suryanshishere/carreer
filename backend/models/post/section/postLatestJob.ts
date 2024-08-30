import mongoose from "mongoose";
import { ILatestJob } from "../post-section-interface";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const latestJobSchema = new Schema<ILatestJob>({
  createdAt: { type: Date },
  contributors: [{ type: ObjectId, ref: "User" }],
  post_code: { type: String, unique: true, required: true },
  name_of_the_post: { type: String, unique: true },
  last_updated: { type: Date },
  how_to_do_registration: { type: String },
  how_to_apply: { type: String },
  post_common: { type: ObjectId, ref: "PostCommon" },
  syllabus: { type: ObjectId, ref: "Syllabus" },
  application_fee: { type: ObjectId, ref: "PostFee" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
  result_data: { type: ObjectId, ref: "Result" },
});

const LatestJob = mongoose.model("LatestJob", latestJobSchema);

export default LatestJob;
