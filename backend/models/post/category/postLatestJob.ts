import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const latestJobSchema = new Schema({  createdAt: { type: Date },
  creadedBy: { type: ObjectId, ref: "User" },
  post_code: { type: String, unique: true, require: true },
  name_of_the_post: { type: String, require: true },
  last_updated: { type: Date , require: true },
  how_to_do_registration: [{ type: String }],
  how_to_apply: [{ type: String }],
  post_common: { type: ObjectId, ref: "PostCommon" },
  syllabus: { type: ObjectId, ref: "Syllabus" },
  application_fee: { type: ObjectId, ref: "PostFee" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
  result_data: { type: ObjectId, ref: "Result" },
});

const LatestJob = mongoose.model("LatestJob", latestJobSchema);

export default LatestJob;
