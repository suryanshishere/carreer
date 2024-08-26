import mongoose from "mongoose";
import { IAdmitCard } from "../post-section-interface";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const admitCardSchema = new Schema<IAdmitCard>({
  createdAt: { type: Date },
  contributors: [{ type: ObjectId, ref: "User" }],
  name_of_the_post: { type: String, require: true },
  last_updated: { type: Date },
  how_to_download_admit_card: { type: String },
  syllabus: { type: ObjectId, ref: "Syllabus" },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
  result_data: { type: ObjectId, ref: "Result" },
});

const AdmitCard = mongoose.model("AdmitCard", admitCardSchema);

export default AdmitCard;
