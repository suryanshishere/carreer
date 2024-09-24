import mongoose from "mongoose";
import { IAdmitCard } from "../post-section-interface";
import createCommonDataModel from "../post-common";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

export const admitCardSchema = new Schema<IAdmitCard>({
  how_to_download_admit_card: { type: String },
  syllabus: { type: ObjectId, ref: "Syllabus" },
  post_common: { type: ObjectId, ref: "PostCommon" },
  important_dates: { type: ObjectId, ref: "PostDate" },
  important_links: { type: ObjectId, ref: "PostLink" },
  result_data: { type: ObjectId, ref: "Result" },
});

const AdmitCard = createCommonDataModel("AdmitCard", admitCardSchema);

export default AdmitCard;
