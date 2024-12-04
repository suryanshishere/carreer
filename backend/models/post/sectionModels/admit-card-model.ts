import mongoose, { Types } from "mongoose";
import commonDataSchema, { ICommonData } from "./section-common-data";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const admitCardSchema = new Schema<IAdmitCard>({
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

export interface IAdmitCard extends ICommonData {
  how_to_download_admit_card?: string;
  syllabus?: Types.ObjectId;
  common?: Types.ObjectId;
  important_dates?: Types.ObjectId;
  important_links?: Types.ObjectId;
}