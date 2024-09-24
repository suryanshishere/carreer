import mongoose from "mongoose";
import { ILatestJob } from "../post-section-interface";
import commonDataSchema from "../post-common";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const latestJobSchema = new Schema<ILatestJob>({
  how_to_do_registration: { type: String },
  how_to_apply: { type: String },
  post_common: { type: ObjectId, ref: "PostCommon" },
  syllabus: { type: ObjectId, ref: "Syllabus" },
  application_fee: { type: ObjectId, ref: "PostFee" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
  result_data: { type: ObjectId, ref: "Result" },
});

latestJobSchema.add(commonDataSchema);

export {latestJobSchema}

const LatestJob = mongoose.model("LatestJob", latestJobSchema);

export default LatestJob;
