import mongoose, { Types, Schema } from "mongoose";
import commonDataSchema, { ICommonDetailData } from "./common-section-data";

const admitCardSchema = new Schema<IAdmitCard>({
  how_to_download_admit_card: { type: String },
  syllabus: { type: Schema.Types.ObjectId, ref: "Syllabus" },
});

admitCardSchema.add(commonDataSchema);

export { admitCardSchema };

const AdmitCardModel = mongoose.model("AdmitCard", admitCardSchema);

export default AdmitCardModel;

export interface IAdmitCard extends ICommonDetailData {
  how_to_download_admit_card?: string;
  syllabus?: Types.ObjectId;
}
