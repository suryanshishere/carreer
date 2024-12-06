import mongoose, { Types, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./section-common-data";

const admitCardSchema = new Schema<IAdmitCardDetail>({
  how_to_download_admit_card: { type: String },
  syllabus: { type: Schema.Types.ObjectId, ref: "Syllabus" },
  common: { type: Schema.Types.ObjectId, ref: "Common"},
  important_dates: { type: Schema.Types.ObjectId, ref: "Date" },
  important_links: { type: Schema.Types.ObjectId, ref: "Link"},
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
