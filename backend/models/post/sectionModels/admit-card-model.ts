import mongoose, { Types } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./section-common-data";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const admitCardSchema = new Schema<IAdmitCardDetail>({
  how_to_download_admit_card: { type: String },
  syllabus: { type: ObjectId, ref: "Syllabus" },
  common: { type: ObjectId, ref: "Common" },
  important_dates: { type: ObjectId, ref: "Date" },
  important_links: { type: ObjectId, ref: "Link" }
});

admitCardSchema.add(commonDataSchema);

export { admitCardSchema };

const AdmitCardModel = mongoose.model("AdmitCard", admitCardSchema);

export default AdmitCardModel;

export interface IAdmitCardDetail extends ICommonDetailData {
  how_to_download_admit_card?: string;
  syllabus?: Types.ObjectId;
  common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
}