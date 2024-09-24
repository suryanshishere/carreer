import mongoose from "mongoose";
import { IAdmitCard } from "../post-section-interface";
import commonDataSchema from "../post-common";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const admitCardSchema = new Schema<IAdmitCard>({
  how_to_download_admit_card: { type: String },
  syllabus: { type: ObjectId, ref: "Syllabus" },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
  result_data: { type: ObjectId, ref: "Result" },
});

admitCardSchema.add(commonDataSchema);

export { admitCardSchema };

const AdmitCard = mongoose.model("AdmitCard", admitCardSchema);

export default AdmitCard;
